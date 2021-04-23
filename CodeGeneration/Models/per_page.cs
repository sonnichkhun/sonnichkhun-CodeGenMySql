using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_page
    {
        public per_page()
        {
            per_actionpagemapping = new HashSet<per_actionpagemapping>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public bool IsDeleted { get; set; }

        public virtual ICollection<per_actionpagemapping> per_actionpagemapping { get; set; }
    }
}
