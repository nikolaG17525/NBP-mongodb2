using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoBackend.Models;
using MongoDB.Driver;
using System.Xml.Linq;

namespace MongoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IMongoCollection<Post> _posts;
        private readonly IMongoCollection<Comment> _comments;

        public PostsController()
        {
            MongoClient _client = new MongoClient("mongodb://localhost/?safe=true");
            IMongoDatabase database = _client.GetDatabase("ratemyproject");
            _posts = database.GetCollection<Post>("posts");
            _comments = database.GetCollection<Comment>("comments");
        }

        [HttpGet("getUnrated")]
        public ActionResult<List<Post>> GetUnrated() =>
            _posts.Find(post => post.Rating == 0).ToList();


        [HttpGet("getRated")]
        public ActionResult<List<Post>> GetRated() =>
            _posts.Find(post => post.Rating != 0).ToList();

        [HttpGet("getPostById/{postId}")]
        public ActionResult<Post> GetPostById(string postId)
        {
            var filter = Builders<Post>.Filter.Eq("Id", postId);
            var post = _posts.Find(filter).FirstOrDefault();

            if (post == null)
            {
                return NotFound("Nepostojeci post.");
            }

            return Ok(post);
        }


        [HttpPost("kreirajPost")]
        public ActionResult<Post> CreatePost(Post post)
        {
            try
            {
                _posts.InsertOne(post);
                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpDelete]
        public IActionResult DeletePost([FromQuery] string id)
        {
            try
            {
                var deleteFilter = Builders<Post>.Filter.Eq("Id", id);
                var result = _posts.DeleteOne(deleteFilter);

                if (result.DeletedCount > 0)
                {
                    var deleteCommentsFilter = Builders<Comment>.Filter.Eq("PostId", id);
                    _comments.DeleteMany(deleteCommentsFilter);
                    return Ok("Post successfully deleted.");
                }
                else
                {
                    return NotFound("Post not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("azurirajPost")]
        public IActionResult UpdatePost(string id, int rating, string professorsName)
        {
            try
            {
                var filter = Builders<Post>.Filter.Eq("Id", id);
                var update = Builders<Post>.Update
                    .Set(p => p.Rating, rating)
                    .Set(p => p.ProfessorsName, professorsName);

                var result = _posts.UpdateOne(filter, update);

                if (result.ModifiedCount > 0)
                {
                    return Ok("Post je uspesno ocenjen.");
                }
                else
                {
                    return NotFound("Post nije pronadjen.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        

    }
}
