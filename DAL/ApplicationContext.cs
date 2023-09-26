using Microsoft.EntityFrameworkCore;
using SSO.DAL.Models;

namespace SSO.Models;

public class ApplicationContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;

    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
}