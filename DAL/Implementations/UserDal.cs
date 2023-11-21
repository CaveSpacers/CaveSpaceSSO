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

    public async Task<UserModel?> GetUserRecordByLogin(string email)
    {
        var userRecord = await _dbContext.Users.FirstOrDefaultAsync(u => u.Login == email.ToLower());
        return userRecord;
    }

    public async Task AddUser(UserModel userModel)
    {
        await _dbContext.Users.AddAsync(userModel);
        await SaveChangesAsync();
    }

    public async Task<TokenModel?> GetTokenRecordByUserId(string userId)
    {
        var tokenRecord = await _dbContext.Tokens.FirstOrDefaultAsync(t => t.UserId == userId);
        return tokenRecord;
    }

    public async Task AddToken(TokenModel tokenModel)
    {
        await _dbContext.Tokens.AddAsync(tokenModel);
        await SaveChangesAsync();
    }

    public async Task UpdateToken(TokenModel tokenModel)
    {
        _dbContext.Entry(tokenModel).State = EntityState.Modified;
        await SaveChangesAsync();
    }

    public async Task<TokenModel?> GetTokenRecordByToken(string token)
    {
        var tokenRecord = await _dbContext.Tokens.FirstOrDefaultAsync(t => t.Token == token);
        return tokenRecord;
    }

    public async Task<UserModel?> GetUserRecordByUserId(string userId)
    {
        var userRecord = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        return userRecord;
    } 

    private async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}