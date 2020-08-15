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
            int id;
            HttpPostedFile CSV;
            try
            {
                id = Convert.ToInt32(HttpContext.Current.Request.Form.Get("id"));
                CSV = HttpContext.Current.Request.Files[0];
            }
            catch
            {
                return BadRequest("No file found");
            }
            QuestionFile file = new QuestionFile();
            file.SetProperties(AdminId: id, FileName: CSV.FileName);
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
        public IHttpActionResult DeleteFile(int AdminId, int FileId)
        {
            QuestionFile file = db.QuestionFiles.Find(FileId);
            if (file == null || !file.IsCurrent)
            {
                return NotFound();
            }
            file.SetProperties(AdminId: AdminId, IsCurrent: false);
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