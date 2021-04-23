using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_fieldtype
    {
        public per_fieldtype()
        {
            per_field = new HashSet<per_field>();
            per_permissionoperator = new HashSet<per_permissionoperator>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public virtual ICollection<per_field> per_field { get; set; }
        public virtual ICollection<per_permissionoperator> per_permissionoperator { get; set; }
    }
}
