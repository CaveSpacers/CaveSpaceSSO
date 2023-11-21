namespace SSO.Controllers.ResponseModels;

public record AccessResponseModel(string Login, string Name, string Role) : IResponse;