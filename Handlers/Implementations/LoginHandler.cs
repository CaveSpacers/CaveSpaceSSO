using SSO.Bl.Interfaces;
using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;
using SSO.Handlers.Interfaces;

namespace SSO.Handlers.Implementations;

public class LoginHandler: ILoginHandler
{
    private readonly IUserBl _userBl;

    public LoginHandler(IUserBl userBl)
    {
        _userBl = userBl;
    }

    public async Task<Result> Login(LoginModel model)
    {
        var result = await _userBl.GetAccessToken(model);

        return result;
    }
}