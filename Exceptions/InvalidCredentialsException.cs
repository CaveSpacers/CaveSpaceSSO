namespace SSO.Exceptions;

public class InvalidCredentialsException : BehaviorException
{
    public InvalidCredentialsException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.InvalidCredentialsCode,
        ErrorConstants.InvalidCredentialsMessage)
    {
    }
}