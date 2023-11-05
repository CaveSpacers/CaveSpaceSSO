using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using SSO.Services;

namespace SSO.Authorization;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly BasicAuthenticationSettings _authenticationSettings;

    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IOptions<BasicAuthenticationSettings> authenticationSettings) :
        base(options, logger, encoder, clock)
    {
        _authenticationSettings = authenticationSettings.Value;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        Console.WriteLine("Error");
        var s = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
        var a = Convert.FromBase64String(s.Parameter);
        Console.WriteLine(a);
        
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return await Task.FromResult(AuthenticateResult.Fail("Missing Authorization header"));
        }

        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 2);
            var username = credentials[0];
            var password = credentials[1];

            if (!IsUserValid(username, password))
            {
                return await Task.FromResult(AuthenticateResult.Fail("Invalid username or password"));
            }
            
            var client = new BasicAuthenticationClient
            {
                AuthenticationType = BasicAuthenticationDefaults.AuthenticationScheme,
                IsAuthenticated = true,
                Name = username
            };

            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(client, new[]
            {
                new Claim(ClaimTypes.Name, username)
            }));

            var ticket = new AuthenticationTicket(claimsPrincipal, Scheme.Name);

            return await Task.FromResult(AuthenticateResult.Success(ticket));
        }
        catch
        {
            return await Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header"));
        }
    }

    private bool IsUserValid(string username, string password)
    {
        return _authenticationSettings.Username == username && _authenticationSettings.Password == password;
    }
}