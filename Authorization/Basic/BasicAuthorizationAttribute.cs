using Microsoft.AspNetCore.Authorization;

namespace SSO.Authorization.Basic;

public class BasicAuthorizationAttribute: AuthorizeAttribute
{
    public BasicAuthorizationAttribute()
    {
        AuthenticationSchemes = BasicAuthenticationDefaults.AuthenticationScheme;
    }
}