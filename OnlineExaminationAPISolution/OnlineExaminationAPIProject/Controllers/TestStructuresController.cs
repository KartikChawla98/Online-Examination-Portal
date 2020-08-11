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

        [HttpGet]
        public List<TestStructure> GetTestStructures()
        {
            return db.TestStructures.Where(ts => ts.IsCurrent == true).ToList();
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
            //Add admin data
            testStructure.SetProperties(AdminId: 1);
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
        [HttpPost]
        [ResponseType(typeof(TestStructure))]
        public IHttpActionResult AddTestStructure(TestStructure testStructure)
        {
            //Add admin data
            testStructure.SetProperties(AdminId: 1);
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
            testStructure.SetProperties(AdminId: 1, IsCurrent: false);
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
    }
}