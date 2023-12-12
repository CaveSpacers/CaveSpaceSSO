namespace SSO.Exceptions;

public class PasswordMissingDigitException : BehaviorException
{
    public PasswordMissingDigitException() : base(ErrorConstants.BadRequestStatus,
        ErrorConstants.PasswordMissingDigitCode, ErrorConstants.PasswordMissingDigitMessage)
    {
    }
}