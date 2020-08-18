using OnlineExaminationAPIProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace OnlineExaminationAPIProject.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class ReportsController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();

        [HttpGet]
        [ResponseType(typeof(List<Test>))]
        public IHttpActionResult GetUserReports(int UserId)
        {
            List<Test> tests = db.Tests.Where(t => t.UserId == UserId).ToList();
            if (tests == null)
            {
                return NotFound();
            }
            return Ok(tests);
        }
        //[HttpGet]
        //[ResponseType(typeof(Test))]
        //public IHttpActionResult GetSingleReport(int Adminid)
        //{
        //    using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
        //    {
        //        Test test = db.Tests.Find(id);
        //        if (test == null)
        //        {
        //            return NotFound();
        //        }
        //        return Ok(test);
        //    }
        //}
        [HttpGet]
        [ResponseType(typeof(List<Test>))]
        public IHttpActionResult GetAllReports()
        {
            return Ok(db.Tests.ToList());
        }
    }
}
