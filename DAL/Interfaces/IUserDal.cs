using SSO.DAL.Models;

namespace SSO.DAL.Interfaces;

public interface IUserDal
{
    public Task<UserModel?> GetUserRecordByLogin(string email);
    public Task AddUser(UserModel userModel);
    public Task<TokenModel?> GetTokenRecordByUserId(string userId);
    public Task AddToken(TokenModel tokenModel);
    public Task UpdateToken(TokenModel tokenModel);
    public Task<TokenModel?> GetTokenRecordByToken(string token);
    public Task<UserModel?> GetUserRecordByUserId(string userId);
}