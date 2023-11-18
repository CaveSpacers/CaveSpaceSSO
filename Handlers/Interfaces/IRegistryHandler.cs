using SSO.Controllers.RequestModels;
using SSO.Controllers.Results;

namespace SSO.Handlers.Interfaces;

public interface IRegistryHandler
{
    public Task<Result> Registry(RegistryModel model);
}