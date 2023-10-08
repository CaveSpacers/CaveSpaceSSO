using Microsoft.EntityFrameworkCore;
using SSO.DAL.Models;

namespace SSO.DAL;

public class ApplicationContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Token> Tokens { get; set; } = null!;

    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasOne(u => u.Token)
            .WithOne(t => t.User)
            .HasForeignKey<Token>(t => t.UserId);

        base.OnModelCreating(modelBuilder);
    }
}