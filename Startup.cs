using Microsoft.EntityFrameworkCore;
using SSO.BL;
using SSO.DAL.Implementations;
using SSO.DAL.Interfaces;
using SSO.Models;
using SSO.Services.Implementations;
using SSO.Services.Interfaces;

namespace SSO;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<IUserValidator, UserValidator>(_ => new UserValidator());
        services.AddDbContext<ApplicationContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

        Console.WriteLine(Configuration.GetConnectionString("DefaultConnection"));

        services.AddTransient<IUserDal, UserDal>();
        services.AddTransient<IUserBl, UserBl>();

        services.AddControllers();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
            endpoints.MapControllers());
    }
}