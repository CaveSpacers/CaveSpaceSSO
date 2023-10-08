using System.ComponentModel.DataAnnotations;

namespace SSO.DAL.Models;

public class User
{
    [Key]
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; }
    public Token Token { get; set; }
}