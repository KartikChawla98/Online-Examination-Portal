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

namespace OnlineExaminationAPIProject.Controllers
{
    public class TestsController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();

        // GET: api/Tests
        public IQueryable<Test> GetTests()
        {
            return db.Tests;
        }

        // GET: api/Tests/5
        [ResponseType(typeof(Test))]
        public IHttpActionResult GetTest(int id)
        {
            Test test = db.Tests.Find(id);
            if (test == null)
            {
                return NotFound();
            }

            return Ok(test);
        }

        // PUT: api/Tests/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTest(int id, Test test)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != test.Id)
            {
                return BadRequest();
            }

            db.Entry(test).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }
        [HttpPost]
        [ResponseType(typeof(List<TestQuestion>))]
        public IHttpActionResult AddTest(int id)
        {
            Test test = new Test();
            //Add user data
            test.SetProperties(UserId: 1, TestStructureId: id);
            db.Tests.Add(test);
            db.SaveChanges();
            TestStructure testStructure = db.TestStructures.Find(id);
            Random rng = new Random();
            List<Question> questions = db.Questions.Where(q => q.Technology == testStructure.Technology &&
                                                         q.Level == testStructure.Level &&
                                                         q.QuestionFile.IsCurrent == true).ToList();
            for (int i = 0; i < testStructure.NumberOfQuestions; i++)
            {
                TestQuestion testQuestion = new TestQuestion();
                testQuestion.SetProperties(TestId: test.Id, QuestionId: questions[rng.Next(0, questions.Count)].Id);
                db.TestQuestions.Add(testQuestion);
                db.SaveChanges();
            }
            test.StartTime = System.DateTime.Now;
            test.EndTime = test.StartTime.Value.AddMinutes(testStructure.MaxMinutes);
            db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = test.Id }, db.TestQuestions.Where(tq => tq.TestId == test.Id).ToList());
        }

        // DELETE: api/Tests/5
        [ResponseType(typeof(Test))]
        public IHttpActionResult DeleteTest(int id)
        {
            Test test = db.Tests.Find(id);
            if (test == null)
            {
                return NotFound();
            }

            db.Tests.Remove(test);
            db.SaveChanges();

            return Ok(test);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TestExists(int id)
        {
            return db.Tests.Count(e => e.Id == id) > 0;
        }
    }
}