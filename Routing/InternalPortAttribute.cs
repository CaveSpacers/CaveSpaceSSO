namespace SSO.Routing;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class InternalPortAttribute: PortActionConstraintAttribute
{
    public InternalPortAttribute() : base(RegistrationExtensions.InternalPort)
    {
    }
    
}