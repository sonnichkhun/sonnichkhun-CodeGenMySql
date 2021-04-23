using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_action
    {
        public per_action()
        {
            per_actionpagemapping = new HashSet<per_actionpagemapping>();
            per_permissionactionmapping = new HashSet<per_permissionactionmapping>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long MenuId { get; set; }
        public bool IsDeleted { get; set; }

        public virtual per_menu Menu { get; set; }
        public virtual ICollection<per_actionpagemapping> per_actionpagemapping { get; set; }
        public virtual ICollection<per_permissionactionmapping> per_permissionactionmapping { get; set; }
    }
}
