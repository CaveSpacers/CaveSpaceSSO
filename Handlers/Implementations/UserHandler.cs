using SSO.Bl.Interfaces;
using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;
using SSO.Handlers.Interfaces;

namespace SSO.Handlers.Implementations;

public class UserHandler: IUserHandler
{
    private readonly IUserBl _userBl;

    public UserHandler(IUserBl userBl)
    {
        _userBl = userBl;
    }

    public async Task<Result> Registry(RegistryModel model)
    {
        var result = await _userBl.CreateUser(model);

        return result;
    }

    public async Task<Result> Login(LoginModel model)
    {
        var result = await _userBl.GetAccessToken(model);

        return result;
    }

    public async Task<Result> Access(AccessModel model)
    {
        var result = await _userBl.GetUserByToken(model);

        return result;
    }
    
}