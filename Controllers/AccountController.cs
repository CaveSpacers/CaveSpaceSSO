using Microsoft.AspNetCore.Mvc;
using SSO.Controllers.Models;
using SSO.Handlers.Interfaces;

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
        if (!ModelState.IsValid)
        {
            var error = ModelState.Where(entry => entry.Value.Errors.Any())
                .Select(entry => new { Code = entry.Key, Description = entry.Value.Errors.First().ErrorMessage })
                .ToList();
            return BadRequest(error);
        }

        var result = _registryHandler.Registry(model).Result;

        if (result.Succeeded) return Ok();

        var errors = result.Errors().Select(e => new { e.Code, Description = e.Message });
        return BadRequest(errors);
    }
}