namespace SSO.DAL.Models;

public class User
{
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; }
}