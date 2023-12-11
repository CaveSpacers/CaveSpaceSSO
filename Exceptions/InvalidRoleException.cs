namespace SSO.Exceptions;

public class InvalidRoleException : BehaviorException
{
    public InvalidRoleException() : base(ErrorConstants.BadRequestStatus, ErrorConstants.InvalidRoleCode,
        ErrorConstants.InvalidRoleMessage)
    {
    }
}