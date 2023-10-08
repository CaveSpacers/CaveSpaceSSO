using Microsoft.EntityFrameworkCore;
using SSO.DAL.Interfaces;
using SSO.DAL.Models;

namespace SSO.DAL.Implementations;

public class UserDal : IUserDal
{
    private readonly ApplicationContext _dbContext;

    public UserDal(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> FindByEmail(string email)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        return user;
    }

    public async Task Add(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Token?> GetTokenByUserId(string userId)
    {
        var token = await _dbContext.Tokens.FirstOrDefaultAsync(t => t.UserId == userId);
        return token;
    }

    public async Task AddToken(Token token)
    {
        await _dbContext.Tokens.AddAsync(token);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateToken(Token token)
    {
        _dbContext.Entry(token).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }
}