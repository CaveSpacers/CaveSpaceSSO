// using System.Text.RegularExpressions;
// using Microsoft.AspNetCore.Identity;
// using SSO.Models;
//
// namespace SSO.Controllers;
//
// public class CustomUserValidator : IUserValidator<User>
// {
//     private const string RequiredEmailPattern = @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b";
//
//     public Task<IdentityResult> ValidateAsync(UserManager<User> manager, User user)
//     {
//         if (user.Email == null)
//         {
//             return Task.FromResult(IdentityResult.Failed(
//                 new IdentityError
//                 {
//                     Code = "EmailIsNull"
//                 }
//             ));
//         }
//
//         if (user.UserName)
//         {
//             return Task.FromResult(IdentityResult.Failed(
//                 new IdentityError
//                 {
//                     Code = "NameIsNull"
//                 }
//             ));
//         }
//
//         List<IdentityError> errors = new List<IdentityError>();
//
//         if (!Regex.IsMatch(user.Email, RequiredEmailPattern))
//         {
//             errors.Add(
//                 new IdentityError
//                 {
//                     Code = "InvalidEmailFormat",
//                     Description = "The email format is not valid"
//                 }
//             );
//         }
//
//         return Task.FromResult(errors.Count == 0 ? IdentityResult.Success : IdentityResult.Failed(errors.ToArray()));
//     }
// }