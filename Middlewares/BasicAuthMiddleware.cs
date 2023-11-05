using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using SSO.Authorization;
using SSO.Services;

namespace SSO.Middlewares;

public class BasicAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public BasicAuthMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(context.Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);
            var username = credentials[0];
            var password = credentials[1];
            if (IsClientValid(username, password))
            {
                // Если учетные данные верны, создайте принцип аутентификации
                var identity = new ClaimsIdentity(BasicAuthenticationDefaults.AuthenticationScheme);
                identity.AddClaim(new Claim(ClaimTypes.Name, username));
                var principal = new ClaimsPrincipal(identity);

                // Установите пользовательский принцип в контексте
                context.User = principal;
            }
            else
            {
                // Если учетные данные недействительны, верните код 401 Unauthorized
                context.Response.StatusCode = 401;
                return;
            }
           
        }
        catch
        {
            context.Response.StatusCode = 400;
            return;
        }

        await _next(context);
    }
    
    private bool IsClientValid(string username, string password)
    {
        var expectedUsername = _configuration["BasicAuthentication:Username"];
        var expectedPassword = _configuration["BasicAuthentication:Password"];

        // Сравниваем учетные данные с настройками из appsettings.json
        return username == expectedUsername && password == expectedPassword;
    }
    
    
}