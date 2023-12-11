namespace SSO.Exceptions;

public class NameIsTooLongException : BehaviorException
{
    public NameIsTooLongException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.NameIsTooLongCode,
        ErrorConstants.NameIsTooLongMessage)
    {
    }
}