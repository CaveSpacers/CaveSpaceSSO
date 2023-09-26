using SSO.DAL.Interfaces;
using SSO.DAL.Models;
using SSO.Services;
using SSO.Services.Interfaces;

namespace SSO.BL;

public class UserBl : IUserBl
{
    private readonly IModel? _model;
    private readonly IUserValidator _userValidator;
    private readonly IUserDal _userDal;

    public UserBl(IModel model, IUserDal userDal, IUserValidator userValidator)
    {
        _model = model;
        _userValidator = userValidator;
        _userDal = userDal;
    }

    public Task<Result> CreateUser()
    {
        if (_model == null)
        {
            return Task.FromResult(Result.Failed(
                new Error
                {
                    Code = "Request is empty"
                }
            ));
        }

        var validationResults = _userValidator.Validate(_model).Result;

        if (!validationResults.Succeeded)
        {
            return Task.FromResult(validationResults);
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(_model.Password);

        var user = new User
        {
            UserId = Guid.NewGuid().ToString(),
            Name = _model.Name,
            Email = _model.Email,
            PasswordHash = passwordHash,
            Role = _model.Role
        };

        try
        {
            _userDal.Add(user);
            return Task.FromResult(Result.Success());
        }
        catch (Exception e)
        {
            var error = new Error
            {
                Code = "FailedToCreateUser",
                Message = e.Message
            };
            return Task.FromResult(Result.Failed(error));
        }
    }

    // public User? GetUser()
    // {
    //     _model
    // }

    // public Task<Result> Authorization()
    // {
    // }
}