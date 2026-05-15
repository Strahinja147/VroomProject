using backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : Controller
    {
        private readonly IMongoCollection<Vehicle> _vehiclesCollection;

        public VehiclesController(IMongoDatabase database)
        {
            _vehiclesCollection = database.GetCollection<Vehicle>("Vehicles");
        }

        [HttpGet("getAllVehicles")]
        public async Task<IActionResult> GetAll()
        {
            var vehicles = await _vehiclesCollection.Find(_ => true).ToListAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOne(string id)
        {
            var vehicle = await _vehiclesCollection.Find(v => v.Id == id).FirstOrDefaultAsync();
            return Ok(vehicle);
        }

        [HttpPost("addVehicle")]
        public async Task<IActionResult> AddVehicle([FromBody] Vehicle vehicle)
        {
            await _vehiclesCollection.InsertOneAsync(vehicle);
            return Ok(vehicle);
        }

        [HttpPut("updateVehicle/{id}")]
        public async Task<IActionResult> UpdateVehicle(string id, [FromBody] Vehicle vehicle)
        {
            vehicle.Id = id;

            var result = await _vehiclesCollection.ReplaceOneAsync(v => v.Id == id, vehicle);
            if (result.MatchedCount == 0)
            {
                return NotFound("Vozilo sa tim ID-em ne postoji!");
            }
            return Ok(vehicle);
        }

        [HttpDelete("deleteVehicle/{id}")]
        public async Task<IActionResult> DeleteVehicle(string id)
        {
            var result = await _vehiclesCollection.DeleteOneAsync(v => v.Id == id);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetFilteredVehicles([FromQuery] string? brand, [FromQuery] string? body, [FromQuery] bool? automatic, [FromQuery] int? maxPrice)
        {

            var filterBuilder = Builders<Vehicle>.Filter;
            var filter = filterBuilder.Empty;

            if (!string.IsNullOrEmpty(brand))
            {
                filter &= filterBuilder.Eq(v => v.Brand, brand);
            }

            if (!string.IsNullOrEmpty(body))
            {
                filter &= filterBuilder.Eq(v => v.Body, body);
            }

            if (automatic.HasValue)
            {
                filter &= filterBuilder.Eq(v => v.Automatic, automatic.Value);
            }

            if (maxPrice.HasValue)
            {
                filter &= filterBuilder.Lte(v => v.PricePerDay, maxPrice.Value);
            }

            var vehicles = await _vehiclesCollection.Find(filter).ToListAsync();
            return Ok(vehicles);
        }
    }
}
