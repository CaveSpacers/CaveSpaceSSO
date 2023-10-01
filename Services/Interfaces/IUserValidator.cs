using SSO.Bl.Interfaces;

namespace SSO.Services.Interfaces;

public interface IUserValidator
{
    Task<Result> Validate(IModel model);
}