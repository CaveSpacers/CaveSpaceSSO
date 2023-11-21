using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;

namespace SSO.Bl.Interfaces;

public interface IUserBl
{
    public Task<Result> CreateUser(RegistryModel model);
    public Task<Result> GetAccessToken(LoginModel model);
    public Task<Result> GetUserByToken(AccessModel model);
}