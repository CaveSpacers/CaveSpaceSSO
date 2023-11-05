using Microsoft.Extensions.Options;

namespace SSO.Services.Implementations;

public class ClientService
{
    private readonly BasicAuthenticationSettings _authenticationSettings;

    public ClientService(IOptions<BasicAuthenticationSettings> authenticationSettings)
    {
        _authenticationSettings = authenticationSettings.Value;
    }

    public bool IsClientValid(string username, string password)
    {
        return _authenticationSettings.Username == username && _authenticationSettings.Password == password;
    }
}