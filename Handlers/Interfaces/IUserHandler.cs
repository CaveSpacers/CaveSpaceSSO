using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;

namespace SSO.Handlers.Interfaces;

public interface IUserHandler
{
    public Task<Result> Registry(RegistryModel model);
    public Task<Result> Login(LoginModel model);
    public Task<Result> Access(AccessModel model);
}