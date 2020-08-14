using OnlineExaminationAPIProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;

namespace OnlineExaminationAPIProject.Controllers
{
    public class SampleController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();
        [HttpGet]
        public void GetAllTestStructures()
        {
            Byte[] inputBytes = Encoding.UTF8.GetBytes("123456");
            SHA512 shaM = new SHA512Managed();
            Byte[] hashedBytes = shaM.ComputeHash(inputBytes);
            System.Diagnostics.Debug.WriteLine(Convert.ToBase64String(hashedBytes));
            System.Diagnostics.Debug.WriteLine(Convert.ToBase64String(db.Admins.Where(a => a.Id == 1).FirstOrDefault().Password));
            //If Admin
            //System.Diagnostics.Debug.WriteLine();
            //If User
        }
    }
}
