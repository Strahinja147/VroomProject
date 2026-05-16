using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Reservation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!; 

        [BsonRepresentation(BsonType.ObjectId)]
        public string VehicleId { get; set; } = null!; 

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int TotalPrice { get; set; } 

        public string Status { get; set; } = "Potvrđena"; 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    }
}