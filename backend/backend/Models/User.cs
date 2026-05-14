using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; // Kasnije ćemo naučiti kako da je heširamo (zaštitimo)
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Role { get; set; } = "Klijent"; // Može biti: Klijent, Admin, Menadžer
    }
}