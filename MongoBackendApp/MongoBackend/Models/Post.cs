using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MongoBackend.Models
{
    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Title { get; set; }
        public string? StudentId { get; set; }
        public string? Description { get; set; }
        public string? RepoLink { get; set; }
        public int? Rating { get; set; }
        public string? ProfessorsName { get; set; }
        public string? AuthorId { get; set; }
    }
}
