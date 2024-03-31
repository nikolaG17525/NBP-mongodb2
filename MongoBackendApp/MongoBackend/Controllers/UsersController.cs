using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoBackend.Models;
using MongoBackend.Services;
using MongoDB.Driver;

namespace MongoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;

        public UsersController()
        {
            MongoClient _client = new MongoClient("mongodb://localhost/?safe=true");
            IMongoDatabase database = _client.GetDatabase("ratemyproject");
            _users = database.GetCollection<User>("users");
        }

        [HttpGet]
        public ActionResult<List<User>> Get() =>
            _users.Find(user => true).ToList();

        [HttpPost("login")]
        public ActionResult<User> LoginUser([FromBody] LoginRequest loginRequest)
        {
            var user = _users.Find(u => u.Username == loginRequest.Username && u.Password == loginRequest.Password).FirstOrDefault();

            if (user == null)
            {
                return NotFound("Korisnik nije pronadjen.");
            }

            // Izbrišite lozinku prije nego što vratite korisnika
            user.Password = null;

            return user;
        }

        [HttpPut("changePassword/{id}")]
        public IActionResult ChangePassword(string id, [FromBody] ChangePasswordRequest request)
        {
            var user = _users.Find(u => u.Id == id).FirstOrDefault();

            if (user == null)
            {
                return NotFound("Korisnik nije pronadjen.");
            }

            if (user.Password != request.OldPassword)
            {
                return BadRequest("Stara lozinka nije ispravna.");
            }

            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var update = Builders<User>.Update.Set(u => u.Password, request.NewPassword);
            _users.UpdateOne(filter, update);

            return Ok("Lozinka uspesno promenjena.");
        }

        [HttpPost("createUser")]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            try
            {
                _users.InsertOne(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost("createMultipleUsers")]
        public ActionResult<List<User>> CreateMultipleUsers(int startIndex, int count)
        {
            try
            {
                List<User> users = new List<User>();

                for (int i = startIndex; i < startIndex + count; i++)
                {
                    string username = "S" + i.ToString();
                    string password = username;

                    User user = new User
                    {
                        Username = username,
                        Password = password,
                        IsProfessor = false
                    };

                    _users.InsertOne(user);
                    users.Add(user);
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

    }
}
