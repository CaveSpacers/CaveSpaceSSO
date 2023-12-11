namespace SSO.Exceptions;

public class PasswordTooShortException : BehaviorException
{
    public PasswordTooShortException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.PasswordTooShortCode,
        ErrorConstants.PasswordTooShortMessage)
    {
    }
}