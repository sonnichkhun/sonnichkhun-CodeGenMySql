using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class enum_sex
    {
        public enum_sex()
        {
            mdm_appuser = new HashSet<mdm_appuser>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public virtual ICollection<mdm_appuser> mdm_appuser { get; set; }
    }
}
