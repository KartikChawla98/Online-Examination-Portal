//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OnlineExaminationAPIProject.Models
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public partial class TestQuestion
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public int TestId { get; set; }
        public int QuestionId { get; set; }
        [DataMember]
        public Nullable<int> UserAnswer { get; set; }
        [DataMember]
        public virtual Question Question { get; set; }
        public virtual Test Test { get; set; }

        public void SetProperties(int TestId, int QuestionId)
        {
            this.TestId = TestId;
            this.QuestionId = QuestionId;
        }
    }
}
