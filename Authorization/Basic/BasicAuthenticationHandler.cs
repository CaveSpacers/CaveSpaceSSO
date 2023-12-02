using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace SSO.Authorization.Basic;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    
    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock
    )
        : base(options, logger, encoder, clock)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var endpoint = Context.GetEndpoint();
        
        if (endpoint?.Metadata.GetMetadata<IAllowAnonymous>() != null)
            return AuthenticateResult.NoResult();
        
        if (!Request.Headers.ContainsKey("Authorization"))
            return AuthenticateResult.Fail(AuthenticateResultDictionary.MissingHeader);
        
        string username;

        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 2);
            username = credentials[0];
            var password = credentials[1];

            var encodedPassword = Environment.GetEnvironmentVariable(username.ToUpper());
            
            Console.Write(encodedPassword);

            if (encodedPassword == null || encodedPassword != password)
            {
                return AuthenticateResult.Fail(AuthenticateResultDictionary.InvalidUsernameOrPassword);
            }
        }
        catch
        {
            return AuthenticateResult.Fail(AuthenticateResultDictionary.InvalidAuthorizationHeader);
        }

        var claims = new[]
         {
             new Claim(ClaimTypes.Name, username),
         };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}