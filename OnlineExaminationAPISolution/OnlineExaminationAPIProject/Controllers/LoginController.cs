using OnlineExaminationAPIProject.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace OnlineExaminationAPIProject.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class LoginController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();

        [HttpPost]
        [ResponseType(typeof(Accessor))]
        public IHttpActionResult ValidateLogin(Accessor accessor)
        {
            try
            {
                Byte[] inputBytes = Encoding.UTF8.GetBytes(accessor.Password);
                SHA512 shaM = new SHA512Managed();
                Byte[] hashedBytes = shaM.ComputeHash(inputBytes);
                Accessor result = new Accessor();
                result.Type = accessor.Type;
                if (accessor.Type == "User")
                {
                    User user = db.Users.Where(u => u.Email == accessor.Email).FirstOrDefault();
                    if (user == null)
                        return Ok(result);
                    result.Email = accessor.Email;
                    if (Convert.ToBase64String(user.Password) == Convert.ToBase64String(hashedBytes))
                    {
                        result.Id = user.Id;
                        result.Name = user.FullName;
                        return Ok(result);
                    }
                    return Ok(result);
                }
                else if (accessor.Type == "Admin")
                {
                    Admin admin = db.Admins.Where(a => a.Email == accessor.Email).FirstOrDefault();
                    if (admin == null)
                        return Ok(result);
                    result.Email = accessor.Email;
                    if (Convert.ToBase64String(admin.Password) == Convert.ToBase64String(hashedBytes))
                    {
                        result.Id = admin.Id;
                        result.Name = admin.FullName;
                        return Ok(result);
                    }
                    return Ok(result);
                }
                return BadRequest("Invalid Accessor");
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e);
                return BadRequest();
            }
        }
    }
}
