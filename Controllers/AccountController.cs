using Microsoft.AspNetCore.Mvc;
using SSO.Controllers.Models;
using SSO.Handlers.Interfaces;
using SSO.Services;

namespace SSO.Controllers;

[Route("api/v1")]
public class AccountController : Controller
{
    private readonly IRegistryHandler _registryHandler;

    public AccountController(IRegistryHandler registryHandler)
    {
        _registryHandler = registryHandler;
    }

    [HttpPost("registry")]
    public async Task<IActionResult> Registry([FromBody] RegistryModel model)
    {
        if (!ModelState.IsValid) return BadRequest(new Error("ModelException", "Invalid model in request"));
        
        var result = await _registryHandler.Registry(model);

        if (result.IsSucceeded) return Ok();
        
        if (result.IsBadRequest) return BadRequest(result.Errors());

        if (result.IsConflict) return Conflict(result.Errors());

        return StatusCode(500);
    }
}