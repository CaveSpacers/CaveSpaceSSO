namespace SSO.Routing;

public static class RegistrationExtensions
{
    private const string PublicPortEnvVarName = "HTTP_SERVER_PUBLIC_PORT";
    private const string InternalPortEnvVarName = "HTTP_SERVER_INTERNAL_PORT";

    public static int PublicPort => GetInt32FromEnvOrDefault(PublicPortEnvVarName, 8080);
    public static int InternalPort => GetInt32FromEnvOrDefault(InternalPortEnvVarName, 8082);

    private static int GetInt32FromEnvOrDefault(string envVarName, int @default)
    {
        if (!int.TryParse(Environment.GetEnvironmentVariable(envVarName), out int result))
        {
            result = @default;
        }

        return result;
    }
    
    public static IApplicationBuilder MapOnInternalPort(this IApplicationBuilder app,
        Action<IApplicationBuilder> builder)
    {
        return app.MapWhen(ctx => ctx.Connection.LocalPort == InternalPort, builder);
    }

    public static IApplicationBuilder MapOnPublicPort(this IApplicationBuilder app, Action<IApplicationBuilder> builder)
    {
        return app.MapWhen(ctx => ctx.Connection.LocalPort == PublicPort, builder);
    }
    
}