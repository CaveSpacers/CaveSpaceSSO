namespace SSO.Exceptions;

public class PasswordMissingUppercaseException : BehaviorException
{
    public PasswordMissingUppercaseException() : base(ErrorConstants.BadRequestStatus,
        ErrorConstants.PasswordMissingUppercaseCode, ErrorConstants.PasswordMissingUppercaseMessage)
    {
    }
}