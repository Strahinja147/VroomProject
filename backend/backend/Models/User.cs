using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string Email { get; set; }
        public required string Password { get; set; } // Kasnije ćemo naučiti kako da je heširamo (zaštitimo)
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string Role { get; set; } = "Klijent"; // Može biti: Klijent, Admin, Menadžer
    }
}