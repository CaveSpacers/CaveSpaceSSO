using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using SSO.Authorization.Basic;
using SSO.BL;
using SSO.DAL.Implementations;
using SSO.DAL.Interfaces;
using SSO.Handlers.Implementations;
using SSO.Handlers.Interfaces;
using SSO.Bl.Interfaces;
using SSO.Configuration;
using SSO.Middlewares;
using SSO.DAL;
using SSO.Routing;

namespace SSO;

public class Startup
{
    private IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<ApplicationContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

        Console.WriteLine(Configuration.GetConnectionString("DefaultConnection"));

        services.AddAuthentication(o => o.DefaultAuthenticateScheme = BasicAuthenticationDefaults.AuthenticationScheme)
            .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>(
                BasicAuthenticationDefaults.AuthenticationScheme, null);

        services.AddScoped<IUserDal, UserDal>();
        services.AddScoped<IUserBl, UserBl>();
        services.AddScoped<IUserHandler, UserHandler>();

        services.AddControllers();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.ConfigureDateStorage<ApplicationContext>();
        
        app.MapOnPublicPort(publicApp => publicApp
            .UseRouting()
            .UseMiddleware<IncomingMessagesMiddleware>()
            .UseMiddleware<BehaviorMiddleware>()
            .UseEndpoints(endpoints =>
            endpoints.MapControllers()));
        
        app.MapOnInternalPort(publicApp => publicApp
            .UseRouting()
            .UseAuthentication()
            .UseAuthorization()
            .UseMiddleware<IncomingMessagesMiddleware>()
            .UseMiddleware<BehaviorMiddleware>()
            .UseEndpoints(endpoints =>
                endpoints.MapControllers()));
    }
}