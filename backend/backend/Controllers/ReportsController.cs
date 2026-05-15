using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "Menadzer,Admin")] // Otkomentarisaćemo ovo kada napravite uloge!
    [Authorize] // Za sada može bilo ko ko je ulogovan
    public class ReportsController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Vehicle> _vehiclesCollection;
        // Ovde ćemo kasnije dodati _vehiclesCollection i _reservationsCollection kada ih kolege naprave

        public ReportsController(IMongoDatabase database)
        {
            _usersCollection = database.GetCollection<User>("Users");
            _vehiclesCollection = database.GetCollection<Vehicle>("Vehicles");
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardReport>> GetDashboardStats()
        {
            try
            {
                // Brojimo koliko imamo korisnika u bazi
                var usersCount = await _usersCollection.CountDocumentsAsync(_ => true);
                var vehiclesCount = await _vehiclesCollection.CountDocumentsAsync(_ => true);
                // Za vozila i rezervacije za sada stavljamo 0
                // Kada kolege naprave kolekcije, ovde će pisati: await _vehiclesCollection.CountDocumentsAsync(...)
                var report = new DashboardReport
                {
                    TotalUsers = (int)usersCount,
                    TotalVehicles = (int)vehiclesCount,
                    TotalReservations = 0
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Greška pri generisanju izveštaja", error = ex.Message });
            }
        }
    }
}