using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_permission
    {
        public per_permission()
        {
            per_permissionactionmapping = new HashSet<per_permissionactionmapping>();
            per_permissioncontent = new HashSet<per_permissioncontent>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public long RoleId { get; set; }
        public long MenuId { get; set; }
        public long StatusId { get; set; }

        public virtual per_menu Menu { get; set; }
        public virtual per_role Role { get; set; }
        public virtual enum_status Status { get; set; }
        public virtual ICollection<per_permissionactionmapping> per_permissionactionmapping { get; set; }
        public virtual ICollection<per_permissioncontent> per_permissioncontent { get; set; }
    }
}
