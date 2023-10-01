namespace SSO.Services;

public record Error
{
    public string Code { get; init; }
    public string? Message { get; set; }
}