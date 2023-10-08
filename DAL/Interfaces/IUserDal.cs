using SSO.DAL.Models;

namespace SSO.DAL.Interfaces;

public interface IUserDal
{
    public Task<User?> FindByEmail(string email);
    public Task Add(User user);
}