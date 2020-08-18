using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineExaminationAPIProject.Models
{
    public class CSVQuestion : List<String>
    {
        public string LineText { get; set; }
        public CSVQuestion() { }
    }
}