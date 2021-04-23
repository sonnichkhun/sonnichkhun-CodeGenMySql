using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_menu
    {
        public per_menu()
        {
            per_action = new HashSet<per_action>();
            per_field = new HashSet<per_field>();
            per_permission = new HashSet<per_permission>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public bool IsDeleted { get; set; }

        public virtual ICollection<per_action> per_action { get; set; }
        public virtual ICollection<per_field> per_field { get; set; }
        public virtual ICollection<per_permission> per_permission { get; set; }
    }
}
