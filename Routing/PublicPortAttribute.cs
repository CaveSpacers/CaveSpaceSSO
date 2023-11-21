namespace SSO.Routing;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class PublicPortAttribute : PortActionConstraintAttribute
{
    public PublicPortAttribute() : base(RegistrationExtensions.PublicPort)
    {
    }
}