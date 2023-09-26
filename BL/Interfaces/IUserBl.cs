using SSO.Services;

namespace SSO.BL;

public interface IUserBl
{
    public Task<Result> CreateUser(IModel model);
}