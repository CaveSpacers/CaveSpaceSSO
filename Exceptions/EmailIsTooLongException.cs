namespace SSO.Exceptions;

public class EmailIsTooLongException : BehaviorException
{
    public EmailIsTooLongException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.EmailIsTooLongCode,
        ErrorConstants.EmailIsTooLongMessage)
    {
    }
}