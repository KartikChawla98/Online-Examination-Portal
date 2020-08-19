using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using OnlineExaminationAPIProject.Models;

//Admin data
//Model state (Level)
namespace OnlineExaminationAPIProject.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class TestStructuresController : ApiController
    {

        //Admin - All Test Structures
        [HttpGet]
        public List<TestStructure> GetAllTestStructures()
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                //If Admin
                return db.TestStructures.Where(ts => ts.IsCurrent == true).ToList();
            }
        }
        //User - Test Options
        [HttpGet]
        public List<TestStructure> GetTestOptions(int UserId)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                List<TestStructure> testOptions = db.TestStructures.Where(ts => ts.IsCurrent == true).ToList();
                List<Test> userTests = db.Tests.Where(t => t.UserId == UserId && t.TestStructure.IsCurrent == true &&
                                                     t.Result == true).ToList();
                foreach (Test test in userTests)
                    testOptions.Remove(test.TestStructure);
                var testGroup = testOptions.GroupBy(t => t.Technology);
                foreach (var groupItem in testGroup)
                {
                    foreach (TestStructure structure in groupItem)
                    {
                        testOptions.Remove(testOptions.Find(t => t.Technology == structure.Technology && t.Level > structure.Level));
                    }
                }
                return testOptions;
            }
        }

        [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateTestStructure(int AdminId, TestStructure testStructure)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                TestStructure oldData = db.TestStructures/*.AsNoTracking()*/.Where(ts => ts.Id == testStructure.Id).FirstOrDefault();
                if (oldData == null || !oldData.IsCurrent)
                {
                    return NotFound();
                }
                oldData.SetProperties(AdminId: AdminId, IsCurrent: false/*, SetNumberOfQuestions: false*/);
                db.SaveChanges();
                testStructure.Id = 0;
                if (testStructure.SetProperties(AdminId: AdminId))
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
                return Ok(testStructure);
                }
                return BadRequest();
            }  
        }
        [HttpPost]
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult AddTestStructure(int AdminId, TestStructure testStructure)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                if (TestStructureExists(testStructure.Technology, testStructure.Level))
                {
                    return Ok(new TestStructure());
                }
                if (testStructure.SetProperties(AdminId: AdminId))
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
        }
        [HttpDelete]
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult DeleteTestStructure(int AdminId, int TestStructureId)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                TestStructure testStructure = db.TestStructures.Find(TestStructureId);
                if (testStructure == null || !testStructure.IsCurrent)
                {
                    return NotFound();
                }
                testStructure.SetProperties(AdminId: AdminId, IsCurrent: false/*, SetNumberOfQuestions: false*/);
                db.SaveChanges();
                return Ok(testStructure);
            }
        }

        private bool TestStructureExists(int id)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                return db.TestStructures.Count(t => t.Id == id) > 0;
            } 
        }
        private bool TestStructureExists(string Technology, int Level)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                return db.TestStructures.Count(t => t.Technology == Technology && t.Level == Level && t.IsCurrent == true) > 0;
            }   
        }
    }
}