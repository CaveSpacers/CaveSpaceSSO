using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSO.Authorization.Basic;
using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;
using SSO.Handlers.Interfaces;

namespace SSO.Controllers;

[Route("api/v1")]
public class AccountController : Controller
{
    private readonly IRegistryHandler _registryHandler;
    private readonly ILoginHandler _loginHandler;

    public AccountController(IRegistryHandler registryHandler, ILoginHandler loginHandler)
    {
        _registryHandler = registryHandler;
        _loginHandler = loginHandler;
    }

    [HttpPost("registry")]
    [AllowAnonymous]
    public async Task<IActionResult> Registry([FromBody] RegistryModel model)
    {
        //вынести все это в отдельный мидлвейр
        if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));

        var result = await _registryHandler.Registry(model);

        if (result.IsSucceeded) return Ok();

        if (result.IsBadRequest) return BadRequest(result.Errors());

        if (result.IsConflict) return Conflict(result.Errors());

        return StatusCode(500);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));

        var result = await _loginHandler.Login(model);

        if (result.IsSucceeded) return Ok(result.Response());

        if (result.IsBadRequest) return BadRequest(result.Errors());

        return StatusCode(500);
    }

    [HttpPost("access")]
    [BasicAuthorization]
    public async Task<IActionResult> Access([FromBody] AccessModel model)
    {
        //if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));

        Console.WriteLine("Success");
        //Какая-то бизнес логика

        return StatusCode(500);
    }
}