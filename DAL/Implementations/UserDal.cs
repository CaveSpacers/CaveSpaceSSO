using SSO.DAL.Interfaces;
using SSO.DAL.Models;
using SSO.Models;

namespace SSO.DAL.Implementations;

public class UserDal : IUserDal
{
    private readonly ApplicationContext _dbContext;

    public UserDal(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    public User? FindByEmail(string email)
    {
        var user = _dbContext.Users.FirstOrDefault(u => u.Email == email);
        return user;
    }

    public void Add(User user)
    {
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
    }
}