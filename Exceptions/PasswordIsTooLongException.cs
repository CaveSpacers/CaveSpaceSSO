namespace SSO.Exceptions;

public class PasswordIsTooLongException : BehaviorException
{
    public PasswordIsTooLongException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.PasswordIsTooLongCode,
        ErrorConstants.PasswordIsTooLongMessage)
    {
    }
}