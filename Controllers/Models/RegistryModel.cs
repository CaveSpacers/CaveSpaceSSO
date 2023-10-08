using System.ComponentModel.DataAnnotations;
using SSO.Bl.Interfaces;

namespace SSO.Controllers.Models;

public class RegistryModel : IModel
{
    [Required] public string Login { get; set; }

    [Required] public string Password { get; set; }

    [Required] public string Name { get; set; }

    [Required] public string Role { get; set; }
}