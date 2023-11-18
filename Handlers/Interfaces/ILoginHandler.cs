using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;

namespace SSO.Handlers.Interfaces;

public interface ILoginHandler
{
    public Task<Result> Login(LoginModel model);
}