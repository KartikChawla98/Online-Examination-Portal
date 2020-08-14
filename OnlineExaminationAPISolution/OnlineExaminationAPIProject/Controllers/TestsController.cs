﻿using System;
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

namespace OnlineExaminationAPIProject.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
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

        [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult EndTest(int id, List<TestQuestion> testQuestions)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!TestExists(id))
                return NotFound();
            Test test = db.Tests.Find(id);
            int passingScore = test.TestStructure.PassingScore;
            int totalScore = 0;
            foreach (TestQuestion testQuestion in testQuestions)
            {
                TestQuestion dbTestQuestion = db.TestQuestions.Find(testQuestion.Id);
                dbTestQuestion.UserAnswer = testQuestion.UserAnswer;
                db.SaveChanges();
                if (dbTestQuestion.Question.CorrectOption == dbTestQuestion.UserAnswer)
                    totalScore++;
            }
            test.Score = totalScore;
            test.Result = totalScore >= passingScore ? true : false;
            test.EndTime = System.DateTime.Now < test.EndTime ? System.DateTime.Now : test.EndTime;
            db.SaveChanges();
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
            if (questions == null)
            {
                db.Tests.Remove(test);
                return BadRequest();
            }    
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
            return db.Tests.Count(t => t.Id == id && t.EndTime >= System.DateTime.Now) > 0;
        }
    }
}