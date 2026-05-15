using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;

        public AuthController(IMongoDatabase database)
        {
            // Povezujemo se sa kolekcijom "Users" koju si upravo napravio u Compassu
            _usersCollection = database.GetCollection<User>("Users");
        }

        // METODA ZA REGISTRACIJU
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            try
            {
                // 1. Provera da li korisnik sa tim mejlom već postoji
                var existingUser = await _usersCollection.Find(u => u.Email == newUser.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Korisnik sa ovim email-om već postoji!" });
                }

                // NOVO: Heširanje lozinke
                newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);


                // 2. Upis u bazu
                // NAPOMENA: Za sada čuvamo "čistu" šifru. U sledećem koraku ćemo dodati heširanje zbog bezbednosti.
                await _usersCollection.InsertOneAsync(newUser);

                return Ok(new { message = "Registracija uspešna!", userId = newUser.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Greška pri registraciji", error = ex.Message });
            }
        }

        // Klasa koja predstavlja ono što nam React šalje (samo mejl i šifru)
        public class LoginRequest
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        // METODA ZA PRIJAVU (LOGIN)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginInfo)
        {
            try
            {
                // 1. Pronađi korisnika u bazi po email-u
                var user = await _usersCollection.Find(u => u.Email == loginInfo.Email).FirstOrDefaultAsync();

                // 2. Ako korisnik ne postoji
                if (user == null)
                {
                    return Unauthorized(new { message = "Pogrešan email ili lozinka!" }); // Vraćamo Unauthorized (401)
                }

                // NOVO: BCrypt proverava da li se kucana šifra slaže sa onom u bazi
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginInfo.Password, user.Password);

                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Pogrešan email ili lozinka!" });
                }

                // KREIRANJE JWT TOKENA
                // 1. Definišemo šta stavljamo unutar tokena (Pasoša)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id!),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role), // Najbitnije!
                    new Claim("FirstName", user.FirstName) // Zadržavamo ime za React
                };

                // 2. Uzimamo tajni ključ iz appsettings.json (Ovo treba izmestiti u neki Config servis, ali ovako je lakše za početak)
                var configuration = HttpContext.RequestServices.GetRequiredService<IConfiguration>();
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSettings:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                // 3. Pravimo token
                var token = new JwtSecurityToken(
                    issuer: configuration["JwtSettings:Issuer"],
                    audience: configuration["JwtSettings:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(2), // Token traje 2 sata
                    signingCredentials: creds
                );

                var jwtString = new JwtSecurityTokenHandler().WriteToken(token);

                // 4. Ako je sve OK, vraćamo podatke korisnika
                return Ok(new
                {
                    message = "Uspešna prijava!",
                    token = jwtString,
                    userId = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName, // DODATO
                    email = user.Email,       // DODATO
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Greška na serveru", error = ex.Message });
            }
        }



        // METODA ZA PREGLED SVIH KORISNIKA (da proveriš da li radi)
        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            var users = await _usersCollection.Find(_ => true).ToListAsync();
            return Ok(users);
        }

        // METODA ZA IZVEŠTAJE (Samo za ulogovane!)
        [HttpGet("reports")]
        [Microsoft.AspNetCore.Authorization.Authorize] // OVO JE KLJUČ! Zabrani pristup bez tokena!
        public IActionResult GetBasicReport()
        {
            // Pošto je korisnik prošao "kapiju" (ima validan JWT),
            // C# automatski izvlači njegove podatke iz tokena u objekat "User" (ovaj User sa velikim U je ugrađen u C#)

            var emailKorisnikaKojiPita = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var rolaKorisnika = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "Uspesno ste pristupili zasticenim podacima!",
                reportData = $"Ovo je tajni izveštaj. Vaš mejl je {emailKorisnikaKojiPita}, a vaša uloga je {rolaKorisnika}."
            });
        }

        // Klasa za primanje novih podataka
        public class UpdateProfileRequest
        {
            public string FirstName { get; set; } = null!;
            public string LastName { get; set; } = null!;
        }

        // METODA ZA AZURIRANJE PROFILA
        [HttpPut("update-profile")]
        [Microsoft.AspNetCore.Authorization.Authorize] // Samo ulogovani mogu da menjaju SVOJ profil
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                // Vadimo ID trenutno ulogovanog korisnika iz JWT tokena!
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (userId == null) return Unauthorized(new { message = "Korisnik nije prepoznat." });

                // Tražimo MongoDB da izmeni samo Ime i Prezime
                var update = Builders<User>.Update
                    .Set(u => u.FirstName, request.FirstName)
                    .Set(u => u.LastName, request.LastName);

                await _usersCollection.UpdateOneAsync(u => u.Id == userId, update);

                return Ok(new { message = "Profil uspešno ažuriran!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Greška pri ažuriranju.", error = ex.Message });
            }
        }


        // Klasa za primanje podataka o lozinki
        public class ChangePasswordRequest
        {
            public string OldPassword { get; set; } = null!;
            public string NewPassword { get; set; } = null!;
        }

        // METODA ZA PROMENU LOZINKE
        [HttpPut("change-password")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized(new { message = "Niste prijavljeni." });

                // 1. Nadji korisnika u bazi
                var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
                if (user == null) return NotFound(new { message = "Korisnik nije pronadjen." });

                // 2. Proveri da li se stara lozinka poklapa sa onom u bazi
                if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
                {
                    return BadRequest(new { message = "Stara lozinka nije tačna!" });
                }

                // 3. Heširaj novu lozinku
                var newHashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                // 4. Ažuriraj samo polje Password u bazi
                var update = Builders<User>.Update.Set(u => u.Password, newHashedPassword);
                await _usersCollection.UpdateOneAsync(u => u.Id == userId, update);

                return Ok(new { message = "Lozinka je uspešno promenjena!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Greška pri promeni lozinke.", error = ex.Message });
            }
        }



    }
}