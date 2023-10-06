using System.Text.RegularExpressions;
using SSO.Bl.Interfaces;
using SSO.Services.Interfaces;

namespace SSO.Services.Implementations;

public class UserValidator : IUserValidator
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

    public Task<Result> Validate(IModel model)
    {
        List<Error> errors = new List<Error>();

        if (model.Password.Length < RequiredLength)
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordTooShort",
                    Message = "The Password must contain at least 8 characters"
                }
            );
        }

        if (!Regex.IsMatch(model.Password, RequiredLettersPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordMissingUppercase",
                    Message = "The Password must contain at least one capital letter"
                }
            );
        }

        if (!Regex.IsMatch(model.Password, RequiredSymbolsPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordMissingSpecialCharacter",
                    Message = "The Password must contain at least one special character"
                }
            );
        }

        if (!Regex.IsMatch(model.Password, RequiredDigitsPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordMissingDigit",
                    Message = "The Password must contain at least one digit"
                }
            );
        }

        if (!Regex.IsMatch(model.Email, RequiredEmailPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "InvalidEmailFormat",
                    Message = "The Email format is not valid"
                }
            );
        }
        
        if (!RequiredRole.Contains(model.Role))
        {
            errors.Add(new Error
            {
                Code = "InvalidRole",
                Message = "The Role is not valid"
            });
        }

        if (model.Name.Length > MaxLength)
        {
            errors.Add(new Error
            {
                Code = "NameIsTooLong",
                Message = "The Name is longer than 50 characters"
            });
        }
        
        if (model.Password.Length > MaxLength)
        {
            errors.Add(new Error
            {
                Code = "PasswordIsTooLong",
                Message = "The Password is longer than 50 characters"
            });
        }
        
        
        if (model.Email.Length > MaxLength)
        {
            errors.Add(new Error
            {
                Code = "EmailIsTooLong",
                Message = "The Email is longer than 50 characters"
            });
        }

        return Task.FromResult(errors.Count == 0
            ? Result.Success()
            : Result.Failed(errors.ToArray()));
    }
}