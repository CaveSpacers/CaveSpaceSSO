namespace SSO.Exceptions;

public class TokenIsExpiredException : BehaviorException
{
    public TokenIsExpiredException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.TokenIsExpiredCode,
        ErrorConstants.TokenIsExpiredMessage)
    {
    }
}