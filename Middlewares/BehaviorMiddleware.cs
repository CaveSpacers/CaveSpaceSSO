using SSO.Controllers.Results;
using SSO.Exceptions;

namespace SSO.Middlewares;

public class BehaviorMiddleware
{
    private readonly RequestDelegate _next;

    public BehaviorMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (BehaviorException e)
        {
            Console.WriteLine(e.Message);

            var error = new Error(
                e.Code,
                e.Message
            );

            httpContext.Response.StatusCode = e.Status;

            await httpContext.Response.WriteAsJsonAsync(error);
        }
    }
}