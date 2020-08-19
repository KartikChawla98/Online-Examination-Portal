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
            for (int i = 0; i < tests.Count; i++)
            {
                Test test = tests[i];
                if (test.Score == null)
                {
                    int passingScore = test.TestStructure.PassingScore;
                    int totalScore = 0;
                    foreach (TestQuestion testQuestion in test.TestQuestions)
                    {
                        if (testQuestion.Question.CorrectOption == testQuestion.UserAnswer)
                            totalScore++;
                    }
                    test.Score = totalScore;
                    test.Result = totalScore >= passingScore ? true : false;
                    test.EndTime = System.DateTime.Now < test.EndTime ? System.DateTime.Now : test.EndTime;
                    db.SaveChanges();
                }
            }
            return Ok(tests); 
        }
        [HttpGet]
        [ResponseType(typeof(Test))]
        public IHttpActionResult GetSingleReport(int TestId)
        {
            Test test = db.Tests.Find(TestId);
            if (test.Score == null)
            {
                int passingScore = test.TestStructure.PassingScore;
                int totalScore = 0;
                foreach (TestQuestion testQuestion in test.TestQuestions)
                {
                    if (testQuestion.Question.CorrectOption == testQuestion.UserAnswer)
                        totalScore++;
                }
                test.Score = totalScore;
                test.Result = totalScore >= passingScore ? true : false;
                test.EndTime = System.DateTime.Now < test.EndTime ? System.DateTime.Now : test.EndTime;
                db.SaveChanges();
            }
            return Ok(test);
        }
        [HttpGet]
        [ResponseType(typeof(List<Test>))]
        public IHttpActionResult GetAllReports()
        {
            List<Test> tests = db.Tests.ToList();
            for (int i = 0; i < tests.Count; i++)
            {
                Test test = tests[i];
                if (test.Score == null)
                {
                    int passingScore = test.TestStructure.PassingScore;
                    int totalScore = 0;
                    foreach (TestQuestion testQuestion in test.TestQuestions)
                    {
                        if (testQuestion.Question.CorrectOption == testQuestion.UserAnswer)
                            totalScore++;
                    }
                    test.Score = totalScore;
                    test.Result = totalScore >= passingScore ? true : false;
                    test.EndTime = System.DateTime.Now < test.EndTime ? System.DateTime.Now : test.EndTime;
                    db.SaveChanges();
                }
            }
            return Ok(db.Tests.ToList());
        }
    }
}
