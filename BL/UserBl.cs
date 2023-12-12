using SSO.DAL.Interfaces;
using SSO.DAL.Models;
using SSO.Bl.Interfaces;
using SSO.Controllers.RequestModels;
using SSO.Controllers.ResponseModels;
using SSO.Controllers.Results;
using SSO.Exceptions;

namespace SSO.BL;

public class UserBl : IUserBl
{
    private readonly IUserDal _userDal;

    public UserBl(IUserDal userDal)
    {
        _userDal = userDal;
    }

    public async Task<Result> CreateUser(RegistryModel model)
    {

        var userRecord = await _userDal.GetUserRecordByLogin(model.Login);

        if (userRecord != null)
        {
            throw new UserAllReadyExistException();
        }

        var passwordHash = GeneratePasswordHash(model.Password);

        var user = new UserModel
        {
            UserId = Guid.NewGuid().ToString(),
            Name = model.Name,
            Login = model.Login,
            PasswordHash = passwordHash,
            Role = model.Role
        };

        await _userDal.AddUser(user);

        return Result.Success();
    }

    public async Task<Result> GetAccessToken(LoginModel model)
    {
        var userRecord = await _userDal.GetUserRecordByLogin(model.Login);
        if (userRecord == null)
        {
            throw new InvalidCredentialsException();
        }

        if (BCrypt.Net.BCrypt.Verify(model.Password, userRecord.PasswordHash))
        {
            var accessToken = Guid.NewGuid().ToString();
            var tokenExpirationDateTime = DateTime.UtcNow.AddMinutes(15);

            var existingToken = await _userDal.GetTokenRecordByUserId(userRecord.UserId);
            if (existingToken == null)
            {
                var newToken = new TokenModel
                {
                    UserId = userRecord.UserId,
                    Token = accessToken,
                    ExpirationDateTime = tokenExpirationDateTime
                };

                await _userDal.AddToken(newToken);
            }
            else
            {
                existingToken.Token = accessToken;
                existingToken.ExpirationDateTime = tokenExpirationDateTime;
                await _userDal.UpdateToken(existingToken);
            }

            return Result.SuccessWithBody(
                new LoginResponse(accessToken));
        }

        throw new InvalidCredentialsException();
    }

    public async Task<Result> GetUserByToken(AccessModel model)
    {
        var currentUtcTime = DateTime.UtcNow;
        
        var tokenRecord = await _userDal.GetTokenRecordByToken(model.AccessToken);

        if (tokenRecord == null)
        {
            return Result.Forbidden();
        }
        
        if (tokenRecord.ExpirationDateTime < currentUtcTime)
        {
            throw new TokenIsExpiredException();
        }

        var userRecord = await _userDal.GetUserRecordByUserId(tokenRecord.UserId);
        
        if (userRecord == null)
        {
            return Result.Forbidden();
        }
        
        return Result.SuccessWithBody(
            new AccessResponseModel(userRecord.Login, userRecord.Name, userRecord.Role));
    }

    private string? GeneratePasswordHash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}