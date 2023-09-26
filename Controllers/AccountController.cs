using Microsoft.AspNetCore.Mvc;
using SSO.BL;

namespace SSO.Controllers;

[Route("api/v1")]
public class AccountController : Controller
{
    private readonly IUserBl _userBl;

    public AccountController(IUserBl userBl)
    {
        _userBl = userBl;
    }

    [HttpPost("registry")]
    public async Task<IActionResult> Registry([FromBody] RegistryModel model)
    {
        var result = _userBl.CreateUser(model).Result;
        if (result.Succeeded)
        {
            return Ok();
        }

        var errors = result.Errors().ToArray().Select(e => new { Code = e.Code, Description = e.Message });

        return BadRequest(errors);
    }

    public class RegistryModel : IModel
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
    }

    public class LoginModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }

    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginModel model)
    // {
    //     var result = await _signInManager.PasswordSignInAsync(model.Name, model.Password, false, false);
    //     if (result.Succeeded)
    //     {
    //         return Ok();
    //         //TODO: Обработка успешного запроса
    //     }
    //     
    //     var errors = result.Errors.Select(e => new { e.Code, e.Description });
    //     
    //     return BadRequest(errors);
    // }
}