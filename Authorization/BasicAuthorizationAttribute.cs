using Microsoft.AspNetCore.Authorization;

namespace SSO.Authorization;

public class BasicAuthorizationAttribute: AuthorizeAttribute
{
    public BasicAuthorizationAttribute()
    {
        AuthenticationSchemes = BasicAuthenticationDefaults.AuthenticationScheme;
    }
}