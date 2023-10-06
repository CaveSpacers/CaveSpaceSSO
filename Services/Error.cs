namespace SSO.Services;

public record Error
{
    public string Code { get; init; }
    public string Message { get; init; }

    public Error(string code)
    {
        Code = code;
    }
    
    public Error(string code, string message)
    {
        Code = code;
        Message = message;
    }
}