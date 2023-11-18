namespace SSO.Controllers.ResponseModels;

public record LoginResponse(string AccessToken) : IResponse;