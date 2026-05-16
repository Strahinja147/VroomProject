using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Svaka akcija ovde zahteva ulogovanog korisnika (Validan JWT)
    public class ReservationsController : ControllerBase
    {
        private readonly IMongoCollection<Reservation> _reservationsCollection;
        private readonly IMongoCollection<Vehicle> _vehiclesCollection;

        public ReservationsController(IMongoDatabase database)
        {
            _reservationsCollection = database.GetCollection<Reservation>("Reservations");
            _vehiclesCollection = database.GetCollection<Vehicle>("Vehicles");
        }

        // 1. KREIRANJE REZERVACIJE (Glavna metoda za klijente)
        [HttpPost("create")]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationRequestDTO request)
        {
            try
            {
                // Vadimo ID ulogovanog korisnika iz Tokena
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized(new { message = "Korisnik nije prepoznat." });

                // Provera datuma: Da li je EndDate veći od StartDate
                if (request.EndDate <= request.StartDate)
                {
                    return BadRequest(new { message = "Datum vraćanja mora biti posle datuma preuzimanja." });
                }

                // Tražimo vozilo u bazi
                var vehicle = await _vehiclesCollection.Find(v => v.Id == request.VehicleId).FirstOrDefaultAsync();
                if (vehicle == null) return NotFound(new { message = "Vozilo nije pronađeno." });

                // KLJUČNA LOGIKA: Prebrojavanje AKTIVNIH rezervacija za to vozilo u traženom periodu
                // Pravilo preklapanja: (PostojeciPocetak < NoviKraj) I (PostojeciKraj > NoviPocetak)
                var overlappingReservationsCount = await _reservationsCollection.CountDocumentsAsync(r =>
                    r.VehicleId == request.VehicleId &&
                    r.Status != "Otkazana" && // Ne računamo otkazane
                    r.StartDate < request.EndDate &&
                    r.EndDate > request.StartDate
                );

                // Da li imamo dovoljno vozila na stanju?
                if (overlappingReservationsCount >= vehicle.NumberOfAvailableCars)
                {
                    return BadRequest(new { message = "Sva vozila ovog modela su zauzeta u izabranom periodu." });
                }

                // Računanje ukupne cene
                // TotalDays vraća decimalu (npr 3.5 dana), Math.Ceiling to zaokružuje na gore (4 dana)
                int totalDays = (int)Math.Ceiling((request.EndDate - request.StartDate).TotalDays);
                if (totalDays == 0) totalDays = 1; // Minimum 1 dan najma

                int totalPrice = totalDays * vehicle.PricePerDay;

                // Pravljenje rezervacije
                var newReservation = new Reservation
                {
                    UserId = userId,
                    VehicleId = request.VehicleId,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    TotalPrice = totalPrice,
                    Status = "Potvrđena",
                    CreatedAt = DateTime.UtcNow
                };

                await _reservationsCollection.InsertOneAsync(newReservation);

                return Ok(new { message = "Vozilo je uspešno rezervisano!", reservation = newReservation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Greška pri kreiranju rezervacije.", error = ex.Message });
            }
        }

        // 2. PREGLED REZERVACIJA TRENUTNOG KLIJENTA (Stranica "Moje Rezervacije")
        [HttpGet("my-reservations")]
        public async Task<IActionResult> GetMyReservations()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            // Pronalazimo sve rezervacije ovog korisnika
            var myReservations = await _reservationsCollection.Find(r => r.UserId == userId).ToListAsync();

            return Ok(myReservations);
        }

        // 3. OTKAZIVANJE REZERVACIJE (Klijent može da otkaže svoju rezervaciju)
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelReservation(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var reservation = await _reservationsCollection.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (reservation == null) return NotFound(new { message = "Rezervacija nije pronađena." });

            // Provera da li klijent pokušava da otkaže TUĐU rezervaciju
            if (reservation.UserId != userId)
            {
                return Forbid("Ne možete otkazati tuđu rezervaciju.");
            }

            if (reservation.Status == "Otkazana")
            {
                return BadRequest(new { message = "Rezervacija je već otkazana." });
            }

            // Ažuriranje statusa
            var update = Builders<Reservation>.Update.Set(r => r.Status, "Otkazana");
            await _reservationsCollection.UpdateOneAsync(r => r.Id == id, update);

            return Ok(new { message = "Rezervacija je uspešno otkazana." });
        }

        // 4. PREGLED SVIH REZERVACIJA (Samo za Administratore i Menadžere)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllReservations()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Samo Admin ili Menadžer mogu da vide sve rezervacije
            if (userRole != "Admin" && userRole != "Menadžer")
            {
                return Forbid("Nemate pristup ovim podacima.");
            }

            var allReservations = await _reservationsCollection.Find(_ => true).ToListAsync();
            return Ok(allReservations);
        }

        // 5. PROMENA STATUSA OD STRANE ADMINA (npr. u "Završena")
        [HttpPut("change-status/{id}")]
        public async Task<IActionResult> ChangeStatus(string id, [FromBody] string newStatus)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole != "Admin")
            {
                return Forbid("Samo administrator može menjati status rezervacije.");
            }

            var update = Builders<Reservation>.Update.Set(r => r.Status, newStatus);
            var result = await _reservationsCollection.UpdateOneAsync(r => r.Id == id, update);

            if (result.MatchedCount == 0) return NotFound(new { message = "Rezervacija nije pronađena." });

            return Ok(new { message = $"Status uspešno promenjen u {newStatus}." });
        }
    }
}