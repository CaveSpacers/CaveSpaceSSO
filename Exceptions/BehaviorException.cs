namespace SSO.Exceptions;

public abstract class BehaviorException: Exception
{
    public int Status { get; }
    public string Code { get; }
    public string Message { get; }

    protected BehaviorException(int status, string code, string message)
    {
        Status = status;
        Code = code;
        Message = message;
    }
}