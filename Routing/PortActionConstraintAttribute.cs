using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace SSO.Routing;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class PortActionConstraintAttribute : ActionMethodSelectorAttribute
{
    public PortActionConstraintAttribute(int port)
    {
        Port = port;
    }

    public int Port { get; }

    public override bool IsValidForRequest(RouteContext routeContext, ActionDescriptor action)
    {
        int port = routeContext.HttpContext.Connection.LocalPort;
        return Port == port;
    }
}