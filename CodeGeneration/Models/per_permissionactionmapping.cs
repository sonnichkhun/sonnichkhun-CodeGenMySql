using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_permissionactionmapping
    {
        public long ActionId { get; set; }
        public long PermissionId { get; set; }

        public virtual per_action Action { get; set; }
        public virtual per_permission Permission { get; set; }
    }
}
