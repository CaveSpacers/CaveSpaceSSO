using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;
using SSO.Handlers.Interfaces;
using SSO.Routing;

namespace SSO.Controllers;

[Route("api/v1")]
[PublicPort]
public class AccountControllerPublic : Controller
{
    private readonly IUserHandler _userHandler;

    public AccountControllerPublic(IUserHandler userHandler)
    {
        _userHandler = userHandler;
    }

    [HttpPost("registry")]
    [AllowAnonymous]
    public async Task<IActionResult> Registry([FromBody] RegistryModel model)
    {
        //вынести все это в отдельный мидлвейр
        if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));

        var result = await _userHandler.Registry(model);

        if (result.IsSucceeded) return Ok();
        
        if (result.IsConflict) return Conflict(result.Errors());

        return StatusCode(500);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));

        var result = await _userHandler.Login(model);

        if (result.IsSucceeded) return Ok(result.Response());
        
        return StatusCode(500);
    }
}