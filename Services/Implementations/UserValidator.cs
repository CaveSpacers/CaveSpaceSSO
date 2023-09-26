using System.Text.RegularExpressions;
using SSO.BL;
using SSO.Services.Interfaces;

namespace SSO.Services.Implementations;

public class UserValidator : IUserValidator
{
    //PasswordRegex
    private const int RequiredLenght = 8;
    private const string RequiredLettersPattern = @"[A-Z]";
    private const string RequiredSymbolsPattern = @"[!@#$%^&*()]";
    private const string RequiredDigitsPattern = @"\d";
    
    //EmailRegex
    private const string RequiredEmailPattern = @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b";


    public Task<Result> Validate(IModel model)
    {
        // if (model == null)
        // {
        //     return Task.FromResult(Result.Failed(
        //         new Error
        //         {
        //             Code = "PasswordIsRequired"
        //         }));
        // }
        // if (model.Password == null)
        // {
        //     return Task.FromResult(Result.Failed(
        //         new Error
        //         {
        //             Code = "PasswordIsRequired"
        //         }));
        // }
        //
        // if (model.Email == null)
        // {
        //     return Task.FromResult(Result.Failed(
        //         new Error
        //         {
        //             Code = "EmailIsNull"
        //         }
        //     ));
        // }

        List<IError> errors = new List<IError>();

        if (model.Password.Length < RequiredLenght)
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordTooShort",
                    Message = "The password must contain at least 8 characters"
                }
            );
        }

        if (!Regex.IsMatch(model.Password, RequiredLettersPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordMissingUppercase",
                    Message = "The password must contain at least one capital letter"
                }
            );
        }

        if (!Regex.IsMatch(model.Password, RequiredSymbolsPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordMissingSpecialCharacter",
                    Message = "The password must contain at least one special character"
                }
            );
        }

        if (!Regex.IsMatch(model.Password, RequiredDigitsPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "PasswordMissingDigit",
                    Message = "The password must contain at least one digit"
                }
            );
        }
        
        if (!Regex.IsMatch(model.Email, RequiredEmailPattern))
        {
            errors.Add(
                new Error
                {
                    Code = "InvalidEmailFormat",
                    Message = "The email format is not valid"
                }
            );
        }

        return Task.FromResult(errors.Count == 0
            ? Result.Success()
            : Result.Failed(errors.ToArray()));
    }
}