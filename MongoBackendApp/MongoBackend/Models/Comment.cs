using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MongoBackend.Models
{
    public class Comment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Text { get; set; }
        public string? AuthorUsername { get; set; }
        public string? AuthorId { get; set; }
        public string? PostId { get; set; }
    }
}
