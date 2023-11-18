using System.ComponentModel.DataAnnotations;

namespace SSO.Controllers.RequestModels;

public class AccessModel
{
    [Required] public string AccessToken { get; set; }
}