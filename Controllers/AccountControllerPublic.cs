using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;
using SSO.Handlers.Interfaces;
using SSO.Routing;

namespace SSO.Controllers;

[Route("api/v1")]
// [PortActionConstraint(8080)]
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

        if (result.IsBadRequest) return BadRequest(result.Errors());

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

        if (result.IsBadRequest) return BadRequest(result.Errors());

        return StatusCode(500);
    }
}

// [AttributeUsage(AttributeTargets.Class)]
// public class PortActionConstraint : ActionMethodSelectorAttribute
// {
//     public PortActionConstraint(int port)
//     {
//         Port = port;
//     }
//
//     public int Port { get; }
//
//     public override bool IsValidForRequest(RouteContext routeContext, ActionDescriptor action)
//     {
//         //external port
//         var externalPort = routeContext.HttpContext.Request.Host.Port;
//         //local port 
//         var localPort = routeContext.HttpContext.Connection.LocalPort;
//         //write here your custom logic. for example  
//         return Port == localPort ;
//     }
// }