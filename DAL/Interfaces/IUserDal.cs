using SSO.DAL.Models;

namespace SSO.DAL.Interfaces;

public interface IUserDal
{
    public User? FindByEmail(string email);
    public void Add(User user);
}