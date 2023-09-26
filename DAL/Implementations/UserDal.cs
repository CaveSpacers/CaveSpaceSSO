using Microsoft.EntityFrameworkCore;
using SSO.DAL.Interfaces;
using SSO.DAL.Models;
using SSO.Models;

namespace SSO.DAL.Implementations;

public class UserDal : IUserDal
{
    public User? FindByEmail(string email)
    {
        using var db = new ApplicationContext();
        var user = db.Users.FirstOrDefault(u => u.Email == email);
        return user;
    }

    public void Add(User user)
    {
        using var db = new ApplicationContext();
        db.Users.Add(user);
        db.SaveChanges();
    }
}