using OnlineExaminationAPIProject.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Mail;
using System.Net.Mime;
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
        [ResponseType(typeof(int))]
        public IHttpActionResult RegisterUser([FromUri] bool Register, User user)
        {
            if (db.Users.Count(u => u.Email == user.Email) > 0)
                return Conflict();
            db.Users.Add(user);
            try
            {
                db.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    System.Diagnostics.Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        System.Diagnostics.Debug.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
            catch (DbUpdateException)
            {
                if (db.Users.Count(u => u.Id == user.Id) > 0)
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user.Id);
        }
        [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult ChangePassword([FromUri]string Email, [FromBody]string password)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine(Email);
                System.Diagnostics.Debug.WriteLine(password);
                User user = db.Users.Where(u => u.Email == Email).FirstOrDefault();
                user.Password = password;
                db.SaveChanges();
            }
            catch
            {
                return BadRequest();
            }
            return Ok();
        }
        [HttpPost]
        [ResponseType(typeof(Accessor))]
        public IHttpActionResult ValidateLogin(Accessor accessor)
        {
            try
            {
                Accessor result = new Accessor();
                result.Type = accessor.Type;
                if (accessor.Type == "User")
                {
                    User user = db.Users.Where(u => u.Email == accessor.Email).FirstOrDefault();
                    if (user == null)
                        return Ok(result);
                    result.Email = accessor.Email;
                    if (user.Password == accessor.Password)
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
                    var sb = new StringBuilder();
                    foreach (byte b in admin.Password)
                    {
                        sb.Append(b.ToString("x2"));
                    }
                    if (sb.ToString() == accessor.Password)
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
        [HttpGet]
        [ResponseType(typeof(int))]
        public IHttpActionResult ResetPasswordEmail([FromUri]string Email)
        {
            if (db.Users.Count(u => u.Email == Email) == 0)
                return NotFound();
            Random rng = new Random();
            int identifier = rng.Next(0, int.MaxValue);
            LinkedResource WizardImg = new LinkedResource(System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/Wizard.jpg"));
            WizardImg.ContentId = Guid.NewGuid().ToString();
            string body = @"
<html>
<head>
    <meta http-equiv='Content-Type; content='text/html; charset = UTF - 8'/>
            <title> Forgot Password </title>
               <style>
                   body {
                    background-color: #FFFFFF;
                    padding: 0;
                    margin: 0;
            }
    </style>
</head>
<body style = 'background-color: #FFFFFF; padding: 0; margin: 0;'>
     <table border = '0' cellpadding = '0' cellspacing = '10' height = '100%' bgcolor = '#FFFFFF' width = '100%' style = 'max-width: 650px;' id = 'bodyTable'>
                        <tr>
                            <td align = 'center' valign = 'top'>
                                   <table border = '0' cellpadding = '0' cellspacing = '0' width = '100%' id = 'emailContainer' style = 'font-family:Arial; color: #333333;'>
                                                  <!--Title-->
                                                  <tr>
                                                      <td align = 'left' valign = 'top' colspan = '2' style = 'border-bottom: 1px solid #CCCCCC; padding: 20px 0 10px 0;'>
                                                                 <span style = 'font-size: 18px; font-weight: normal;'> FORGOT PASSWORD </span>
                                                                  </td>
                                                              </tr>
                                                              <!--Messages-->
                                                              <tr>
                                                                  <td align = 'left' valign = 'top' colspan = '2' style = 'padding-top: 10px;'>
                                                                             <span style = 'font-size: 12px; line-height: 1.5; color: #333333;'>
                                                                                  We have sent you this email in response to your request to reset your password on Cunning Wizards.
                                                                                  <br/><br/>
                                                                                  To reset your password, please follow the link:
                                <a href = 'http://localhost:4200/reset?Identifier=" + identifier + @"'>http://localhost:4200/reset?Identifier=" + identifier + @"</a>
                                 <br/><br/>
                                 We recommend that you keep your password secure and not share it with anyone.If you feel your password has been compromised, you can change it by logging in and going to the dashboard.
                                <br/><br/>
                                If you need help, or you have any other questions, feel free to email CunningWizards@gmail.com, or call 9582225801 for our customer service.
                                <br/><br/>
                            </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html> ";

            string FromMail = "cunningwizards@gmail.com";
            string emailTo = Email;
            string subject = "Cunning Wizards: Password Reset";
            //string body = string.Empty;
            //using (StreamReader reader = new StreamReader(System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/ForgotPassword.html")))
            //{
            //    body = reader.ReadToEnd();
            //}
            MailMessage mail = new MailMessage();
            mail.IsBodyHtml = true;
            SmtpClient client = new SmtpClient("smtp.gmail.com");
            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            NetworkCredential cred = new System.Net.NetworkCredential(FromMail, "cunningwizard101");
            client.Credentials = cred;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;
            mail.From = new MailAddress(FromMail);
            mail.To.Add(emailTo);
            mail.Subject = subject;
            mail.Body = body;
            mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
            try
            {
                client.Send(mail);
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e);
            }
            return Ok(identifier);
        }
    }
}
