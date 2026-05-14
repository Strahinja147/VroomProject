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

                // 4. Vraćamo Token i osnovne podatke
                return Ok(new
                {
                    message = "Uspešna prijava!",
                    token = jwtString, // OVO SADA REAKTU TREBA
                    userId = user.Id,
                    firstName = user.FirstName,
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



    }
}