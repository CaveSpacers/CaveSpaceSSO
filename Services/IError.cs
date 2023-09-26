namespace SSO.Services;

public interface IError
{
    public string? Code { get; set; }
    public string? Message { get; set; }
}