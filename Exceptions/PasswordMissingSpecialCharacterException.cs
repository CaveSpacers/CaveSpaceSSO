namespace SSO.Exceptions;

public class PasswordMissingSpecialCharacterException : BehaviorException
{
    public PasswordMissingSpecialCharacterException() : base(ErrorConstants.BadRequestStatus,
        ErrorConstants.PasswordMissingSpecialCharacterCode, ErrorConstants.PasswordMissingSpecialCharacterMessage)
    {
    }
}