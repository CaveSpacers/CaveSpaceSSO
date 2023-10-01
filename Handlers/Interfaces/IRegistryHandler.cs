using SSO.Bl.Interfaces;
using SSO.Services;

namespace SSO.Handlers.Interfaces;

public interface IRegistryHandler
{
    public Task<Result> Registry(IModel model);

}