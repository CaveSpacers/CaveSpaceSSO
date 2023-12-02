using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;

namespace SSO.Services.Interfaces;

public interface IUserValidator
{
    Task<Result> Validate(RegistryModel model);
}