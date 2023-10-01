using SSO.Services;

namespace SSO.Bl.Interfaces;

public interface IUserBl
{
    public Task<Result> CreateUser(IModel model);
}