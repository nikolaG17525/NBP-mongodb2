using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoBackend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MongoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly IMongoCollection<Comment> _comments;

        public CommentsController()
        {
            MongoClient _client = new MongoClient("mongodb://localhost/?safe=true");
            IMongoDatabase database = _client.GetDatabase("ratemyproject");
            _comments = database.GetCollection<Comment>("comments");
        }

        [HttpPost("dodajKomentar")]
        public ActionResult<Comment> CreateComment([FromBody]Comment comment)
        {
            try
            {
                _comments.InsertOne(comment);
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("vratiKomentare/{postId}")]
        public ActionResult<List<Comment>> GetComments(string postId)
        {
            try
            {
                var comments = _comments.Find(comment => comment.PostId == postId).ToList();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpDelete("obrisiKomentar/{commentId}")]
        public IActionResult DeleteComment(string commentId)
        {
            try
            {
                var deleteFilter = Builders<Comment>.Filter.Eq("Id", commentId);
                var result = _comments.DeleteOne(deleteFilter);

                if (result.DeletedCount > 0)
                {
                    return Ok("Komentar uspesno obrisan.");
                }
                else
                {
                    return NotFound("Nepostojeci komentar.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("izmeniKomentar/{commentId}")]
        public IActionResult UpdateComment(string commentId, [FromBody] string newText)
        {
            try
            {
                var filter = Builders<Comment>.Filter.Eq("Id", commentId);
                var update = Builders<Comment>.Update.Set("Text", newText);

                var result = _comments.UpdateOne(filter, update);

                if (result.ModifiedCount > 0)
                {
                    return Ok("Komentar uspesno izmenjen.");
                }
                else
                {
                    return NotFound("Neostojeci komentar.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }



    }
}
