using Microsoft.AspNetCore.Mvc;
using SSO.Authorization.Basic;
using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;
using SSO.Handlers.Interfaces;
using SSO.Routing;

namespace SSO.Controllers;

[Route("api/v1")]
[InternalPort]
public class AccountControllerInternal : Controller
{
    private readonly IUserHandler _userHandler;

    public AccountControllerInternal(IUserHandler userHandler)
    {
        _userHandler = userHandler;
    }
    
    [HttpPost("access")]
    [BasicAuthorization]
    public async Task<IActionResult> Access([FromBody] AccessModel model)
    {
        if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));

        var result = await _userHandler.Access(model);
        
        if (result.IsSucceeded) return Ok(result.Response());

        if (result.IsForbidden) return Forbid();
        
        return StatusCode(500);
    }
}