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
    public class TestStructuresController : ApiController
    {
        private db_OnlineExaminationEntities db = new db_OnlineExaminationEntities();

        [HttpGet]
        public List<TestStructure> GetTestStructures()
        {
            return db.TestStructures.ToList();
        }
        [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateTestStructure(TestStructure testStructure)
        {
            //Add admin data
            testStructure.SetProperties(1);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.Entry(testStructure).State = EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestStructureExists(testStructure.Technology, testStructure.Level))
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
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult AddTestStructure(TestStructure testStructure)
        {
            //Add admin data
            testStructure.SetProperties(1);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.TestStructures.Add(testStructure);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (TestStructureExists(testStructure.Technology, testStructure.Level))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            return CreatedAtRoute("DefaultApi", new { id = testStructure.Technology + ":" + testStructure.Level }, testStructure);
        }
        [HttpDelete]
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult DeleteTestStructure(string id)
        {
            string[] ids = id.Split(';');
            TestStructure testStructure = db.TestStructures.Find(ids[0], Convert.ToInt32(ids[1]));
            if (testStructure == null)
            {
                return NotFound();
            }
            db.TestStructures.Remove(testStructure);
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

        private bool TestStructureExists(string Technology, int Level)
        {
            return db.TestStructures.Count(t => t.Technology == Technology && t.Level == Level) > 0;
        }
    }
}