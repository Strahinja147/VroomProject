using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbTestController : ControllerBase
    {
        private readonly IMongoDatabase _database;

        public DbTestController(IMongoDatabase database)
        {
            _database = database;
        }

        [HttpGet("ping")]
        public IActionResult PingDatabase()
        {
            try
            {
                // Pokušaj da pošalješ "ping" komandu bazi
                var isAlive = _database.RunCommand((Command<BsonDocument>)"{ping:1}");
                return Ok(new { message = "Konekcija sa MongoDB Atlasom je USPEŠNA!", details = isAlive.ToString() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Greška u povezivanju!", error = ex.Message });
            }
        }
    }
}