using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SSO.DAL.Models;

public class Token
{
    [Key]
    public string UserId { get; set; }
    public string TokenHash { get; set; }
    public DateTime ExpiredDateTime { get; set; }
    public User User { get; set; }
}