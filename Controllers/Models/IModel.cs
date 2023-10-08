namespace SSO.Controllers.Models;

public interface IModel
{
    string Name { get; set; }
    string Login { get; set; }
    string Password { get; set; }
    string Role { get; set; }
}