namespace SSO.BL;

public interface IModel
{
    string Name { get; set; }
    string Email { get; set; }
    string Password { get; set; }
    string Role { get; set; }
}