namespace SSO.Services;

public struct Result
{
    public bool Succeeded { get; set; }

    private readonly List<IError> _errors = new List<IError>();

    public Result()
    {
        Succeeded = false;
    }

    public static Result Success()
    {
        return new Result
        {
            Succeeded = true
        };
    }

    public static Result Failed(params IError[]? errors)
    {
        var result = new Result { Succeeded = false };
        if (errors != null)
        {
            result._errors.AddRange(errors);
        }

        return result;
    }

    // public static IError[]? Errors()
    // {
    //     return _errors;
    // }
}