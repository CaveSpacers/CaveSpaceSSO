namespace SSO.Services;

public struct Result
{
    public bool Succeeded { get; set; }

    private readonly List<Error> _errors = new();

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

    public static Result Failed(params Error[]? errors)
    {
        var result = new Result { Succeeded = false };
        if (errors != null)
        {
            result._errors.AddRange(errors);
        }

        return result;
    }

    public IEnumerable<Error> Errors()
    {
        return _errors.ToArray();
    }
}