using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SSO.DAL.Models;

namespace SSO.Models;

public class ApplicationContext: DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    
    public ApplicationContext() => Database.EnsureCreated();
}