using SSO.Bl.Interfaces;
using SSO.Handlers.Interfaces;
using SSO.Services;

namespace SSO.Handlers.Implementations;

public class RegistryHandler: IRegistryHandler
{
    private readonly IUserBl _userBl;

    public RegistryHandler(IUserBl userBl)
    {
        _userBl = userBl;
    }

    public Task<Result> Registry(IModel model)
    {
        var result = _userBl.CreateUser(model);

        return result;
    }

}