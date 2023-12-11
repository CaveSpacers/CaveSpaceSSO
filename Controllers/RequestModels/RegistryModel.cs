using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using SSO.Exceptions;

namespace SSO.Controllers.RequestModels;

public class RegistryModel
{
    //CommonRules
    private const int MaxLength = 50;

    //PasswordRegex
    private const int RequiredLength = 8;
    private const string RequiredLettersPattern = @"[A-Z]";
    private const string RequiredSymbolsPattern = @"[!@#$%^&*()]";
    private const string RequiredDigitsPattern = @"\d";

    //EmailRegex
    private const string RequiredEmailPattern = @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b";

    //RolePattern
    private static readonly string[] RequiredRole = { "client", "renter"};

    [Required] public string Login { get; }

    [Required] public string Password { get; }

    [Required] public string Name { get; }

    [Required] public string Role { get; }

    public RegistryModel(string login, string password, string name, string role)
    {
        if (password.Length < RequiredLength)
        {
            throw new PasswordTooShortException();
        }

        if (!Regex.IsMatch(password, RequiredLettersPattern))
        {
            throw new PasswordMissingUppercaseException();
        }

        if (!Regex.IsMatch(password, RequiredSymbolsPattern))
        {
            throw new PasswordMissingSpecialCharacterException();
        }

        if (!Regex.IsMatch(password, RequiredDigitsPattern))
        {
            throw new PasswordMissingDigitException();
        }

        if (password.Length > MaxLength)
        {
            throw new PasswordIsTooLongException();
        }

        Password = password;

        if (!Regex.IsMatch(login, RequiredEmailPattern))
        {
            throw new InvalidEmailFormatException();
        }

        if (login.Length > MaxLength)
        {
            throw new EmailIsTooLongException();
        }

        Login = login;

        if (name.Length > MaxLength)
        {
            throw new NameIsTooLongException();
        }

        Name = name;

        if (!RequiredRole.Contains(role))
        {
            throw new InvalidRoleException();
        }

        Role = role;
    }
}