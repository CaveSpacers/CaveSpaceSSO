using SSO.DAL.Models;

namespace SSO.DAL.Interfaces;

public interface IUserDal
{
    public Task<User?> FindByEmail(string email);
    public Task Add(User user);

    public Task<Token?> GetTokenByUserId(string userId);

    public Task AddToken(Token token);

    public Task UpdateToken(Token token);

}