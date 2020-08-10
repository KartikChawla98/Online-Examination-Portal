using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using OnlineExaminationAPIProject.Models;
using System.Threading;
using System.Data.Entity;
using System.IO;

namespace OnlineExaminationAPIProject.Controllers
{
    public class FileController : ApiController
    {
        [HttpGet]
        public List<QuestionFile> GetFiles()
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                return db.QuestionFiles.Where(file => file.IsCurrent == true).ToList();
            }
        }
        [HttpPost]
        public void AddFile()
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                HttpPostedFile CSV = HttpContext.Current.Request.Files[0];
                QuestionFile file = new QuestionFile();
                //Add admin data
                file.SetProperties(1, CSV.FileName);
                db.QuestionFiles.Add(file);
                db.SaveChanges();
                int count = 0;
                CSVQuestion temp;
                using (CSVReader reader = new CSVReader(CSV.InputStream))
                {
                    CSVQuestion row = new CSVQuestion();
                    while (reader.ReadRow(row))
                    {
                        count++;
                        if (count == 1)
                            continue;
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
            }     
        }
        [HttpDelete]
        public void DeleteFile(int id)
        {
            using (db_OnlineExaminationEntities db = new db_OnlineExaminationEntities())
            {
                QuestionFile file = db.QuestionFiles.Find(id);
                if (file.IsCurrent)
                {
                    file.IsCurrent = false;
                    file.DeleteDate = System.DateTime.Now;
                    db.SaveChanges();
                }
            }   
        }
    }
}
