using SSO.Services;

namespace SSO.Middlewares;

public class RegistryMiddleware
{
    public readonly RequestDelegate _next;

    public RegistryMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception exception)
        {
            Console.WriteLine(exception.Message);
            
            var error = new Error
            {
                Code = "FailedToCreateUser"
            };

            await httpContext.Response.WriteAsJsonAsync(error);
        }
    }
}