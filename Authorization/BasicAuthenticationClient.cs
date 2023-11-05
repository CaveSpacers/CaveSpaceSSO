using System.Security.Principal;

namespace SSO.Authorization;

public class BasicAuthenticationClient : IIdentity
{
    public string? AuthenticationType { get; set; }

    public bool IsAuthenticated { get; set; }

    public string? Name { get; set; }
}