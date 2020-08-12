using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using OnlineExaminationAPIProject.Models;

//Admin data
//Model state (Level)
namespace OnlineExaminationAPIProject.Controllers
{
    public class TestStructuresController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();

        //Admin
        [HttpGet]
        public List<TestStructure> GetAllTestStructures()
        {
            //If Admin
            return db.TestStructures.Where(ts => ts.IsCurrent == true).ToList();
            //If User
        }
        //User
        [HttpGet]
        public List<TestStructure> GetTestOptions(int id)
        {
            List<TestStructure> testOptions = db.TestStructures.Where(ts => ts.IsCurrent == true).ToList();
            List<Test> userTests = db.Tests.Where(t => t.UserId == id && t.TestStructure.IsCurrent == true &&
                                                 t.Result == true).ToList();
            foreach (Test test in userTests)
               testOptions.Remove(test.TestStructure);
            return testOptions;
        }

        [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateTestStructure(TestStructure testStructure)
        {
            TestStructure oldData = db.TestStructures.Find(testStructure.Id);
            if (oldData == null || !oldData.IsCurrent)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //Add admin data
            if (testStructure.SetProperties(AdminId: 1))
            {
                db.Entry(testStructure).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TestStructureExists(testStructure.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok(testStructure);
            }
            return BadRequest();
        }
        [HttpPost]
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult AddTestStructure(TestStructure testStructure)
        {
            if (TestStructureExists(testStructure.Technology, testStructure.Level))
            {
                return Conflict();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //Add admin data
            if (testStructure.SetProperties(AdminId: 1))
            {
                db.TestStructures.Add(testStructure);
                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateException)
                {
                    if (TestStructureExists(testStructure.Id))
                    {
                        return Conflict();
                    }
                    else
                    {
                        throw;
                    }
                }
                return CreatedAtRoute("DefaultApi", new { id = testStructure.Id }, testStructure);
            }
            return BadRequest();
        }
        [HttpDelete]
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult DeleteTestStructure(int id)
        {
            TestStructure testStructure = db.TestStructures.Find(id);                              
            if (testStructure == null || !testStructure.IsCurrent)
            {
                return NotFound();
            }
            //Add admin data
            testStructure.SetProperties(AdminId: 1, IsCurrent: false, SetNumberOfQuestions: false);
            db.SaveChanges();
            return Ok(testStructure);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TestStructureExists(int id)
        {
            return db.TestStructures.Count(t => t.Id == id) > 0;
        }
        private bool TestStructureExists(string Technology, int Level)
        {
            return db.TestStructures.Count(t => t.Technology == Technology && t.Level == Level && t.IsCurrent == true) > 0;
        }
    }
}