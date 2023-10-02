using SSO.DAL.Interfaces;
using SSO.DAL.Models;
using SSO.Bl.Interfaces;
using SSO.Controllers.Models;
using SSO.Services;
using SSO.Services.Interfaces;

namespace SSO.BL;

public class UserBl : IUserBl
{
    private readonly IUserValidator _userValidator;
    private readonly IUserDal _userDal;

    public UserBl(IUserDal userDal, IUserValidator userValidator)
    {
        _userValidator = userValidator;
        _userDal = userDal;
    }

    public async Task<Result> CreateUser(IModel model)
    {
        var validationResults = _userValidator.Validate(model).Result;

        if (validationResults.IsBadRequest)
        {
            return await Task.FromResult(validationResults);
        }

        var userRecord = await _userDal.FindByEmail(model.Email);

        if (userRecord != null)
        {
            return await Task.FromResult(Result.Conflict(new Error("UserAlreadyExist",
                "User with current email already exist")));
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

        var user = new User
        {
            UserId = Guid.NewGuid().ToString(),
            Name = model.Name,
            Email = model.Email,
            PasswordHash = passwordHash,
            Role = model.Role
        };

        await _userDal.Add(user);

        return await Task.FromResult(Result.Success());
    }
}