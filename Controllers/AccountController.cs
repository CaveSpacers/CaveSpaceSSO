using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SSO.BL;
using SSO.DAL.Implementations;
using SSO.DAL.Models;
using SSO.Models;
using SSO.Services.Implementations;

namespace SSO.Controllers;

[Route("api/v1")]
public class AccountController : Controller
{
    // private readonly UserManager<User> _userManager;
    // private readonly SignInManager<User> _signInManager;
    //
    // public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
    // {
    //     _userManager = userManager;
    //     _signInManager = signInManager;
    // }

    [HttpPost("registry")]
    public async Task<IActionResult> Registry([FromBody] RegistryModel model)
    {
        UserBl user = new UserBl(model, new UserDal(), new UserValidator());
        var result = user.CreateUser().Result;
        if (result.Succeeded)
        {
            return Ok();
        }
        
        //var errors = result.Select(e => new { e.Code, e. });
        
        return BadRequest();
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

    public class RegistryModel: IModel
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
}