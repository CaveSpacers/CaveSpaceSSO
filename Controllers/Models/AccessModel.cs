using System.ComponentModel.DataAnnotations;

namespace SSO.Controllers.Models;

public class AccessModel
{
    [Required] public string AccessToken { get; set; }
}