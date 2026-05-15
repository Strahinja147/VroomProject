using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Vehicle
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string Brand { get; set; }

        public required string Model { get; set; }

        public int ModelYear { get; set; }

        public int PricePerDay { get; set; }

        public required string Body{get;set;}

        public required string FuelType { get; set; }

        public bool Automatic { get; set; }

        public int NumberOfSuitcases { get; set; }

        public bool Offroad { get; set; }

        public int NumberOfSeats { get; set; }

        public int Rating { get; set; }

        public int NumberOfAvailableCars { get; set; }
    }
}
