namespace SSO.Exceptions;

public static class ErrorConstants
{
    public const int ConflictStatus = 409;
    public const int BadRequestStatus = 400;
    
    public const string UserAlreadyExistsCode = "UserAlreadyExist";
    public const string UserAlreadyExistsMessage = "The user with current email already exist";
    
    public const string InvalidCredentialsCode = "InvalidCredentials";
    public const string InvalidCredentialsMessage = "Invalid email or password";
    
    public const string TokenIsExpiredCode = "TokenIsExpired";
    public const string TokenIsExpiredMessage = "Token is expired";
    
    public const string PasswordTooShortCode = "PasswordTooShort";
    public const string PasswordTooShortMessage = "The Password must contain at least 8 characters";

    public const string PasswordMissingUppercaseCode = "PasswordMissingUppercase";
    public const string PasswordMissingUppercaseMessage = "The Password must contain at least one capital letter";

    public const string PasswordMissingSpecialCharacterCode = "PasswordMissingSpecialCharacter";
    public const string PasswordMissingSpecialCharacterMessage = "The Password must contain at least one special character";
    
    public const string PasswordMissingDigitCode = "PasswordMissingDigit";
    public const string PasswordMissingDigitMessage = "The Password must contain at least one digit";

    public const string InvalidEmailFormatCode = "InvalidEmailFormat";
    public const string InvalidEmailFormatMessage = "The Email format is not valid";
    
    public const string InvalidRoleCode = "InvalidRole";
    public const string InvalidRoleMessage = "The Role is not valid";
    
    public const string NameIsTooLongCode = "NameIsTooLong";
    public const string NameIsTooLongMessage = "The Name is longer than 50 characters";
    
    public const string PasswordIsTooLongCode = "PasswordIsTooLong";
    public const string PasswordIsTooLongMessage = "The Password is longer than 50 characters";
    
    public const string EmailIsTooLongCode = "EmailIsTooLong";
    public const string EmailIsTooLongMessage = "The Email is longer than 50 characters";
}