using SSO.Controllers.Models;

namespace SSO.Services.Interfaces;

public interface IUserValidator
{
    Task<Result> Validate(IModel model);
}