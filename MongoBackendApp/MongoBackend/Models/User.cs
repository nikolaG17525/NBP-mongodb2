using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MongoBackend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Username { get; set; }
        public string? Password { get; set; }
        public bool IsProfessor { get; set; }
    }
}
