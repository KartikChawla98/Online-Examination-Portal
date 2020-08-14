using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Configuration;
using System.Web.Http;
using System.Web;
using System.Web.Http.Description;
using OnlineExaminationAPIProject.Models;
using System.Web.Http.Cors;

namespace OnlineExaminationAPIProject.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class FilesController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();

        [HttpGet]
        public List<QuestionFile> GetQuestionFiles()
        {
            return db.QuestionFiles.Where(file => file.IsCurrent == true).ToList();
        }

        [HttpPost]
        [ResponseType(typeof(QuestionFile))]
        public IHttpActionResult AddFile()
        {
            HttpPostedFile CSV;
            try
            {
                CSV = HttpContext.Current.Request.Files[0];
            }
            catch
            {
                return BadRequest("No file found");
            }
            QuestionFile file = new QuestionFile();
            //Add admin data
            file.SetProperties(AdminId: 1, FileName: CSV.FileName);
            db.QuestionFiles.Add(file);
            db.SaveChanges();
            bool headersRow = true;
            CSVQuestion temp;
            using (CSVReader reader = new CSVReader(CSV.InputStream))
            {
                CSVQuestion row = new CSVQuestion();
                while (reader.ReadRow(row))
                {
                    if (headersRow)
                    {
                        headersRow = false;
                        continue;
                    }
                    temp = new CSVQuestion();
                    temp.AddRange(row);
                    Question question = new Question();
                    if (question.SetProperties(file.Id, temp))
                    {
                        db.Questions.Add(question);
                        db.SaveChanges();
                    }
                }
            }
            return CreatedAtRoute("DefaultApi", new { id = file.Id }, file);
        }

        [HttpDelete]
        [ResponseType(typeof(QuestionFile))]
        public IHttpActionResult DeleteFile(int id)
        {
            QuestionFile file = db.QuestionFiles.Find(id);
            if (file == null || !file.IsCurrent)
            {
                return NotFound();
            }
            //Add admin data
            file.SetProperties(AdminId: 1, IsCurrent: false);
            db.SaveChanges();
            return Ok(file);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}