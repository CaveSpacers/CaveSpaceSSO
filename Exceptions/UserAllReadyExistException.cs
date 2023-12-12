namespace SSO.Exceptions;

public class UserAllReadyExistException : BehaviorException
{
    public UserAllReadyExistException() :
        base(
            ErrorConstants.ConflictStatus, ErrorConstants.UserAlreadyExistsCode,
            ErrorConstants.UserAlreadyExistsMessage)
    {
    }
}