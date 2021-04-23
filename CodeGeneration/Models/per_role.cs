using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_role
    {
        public per_role()
        {
            mdm_appuserrolemapping = new HashSet<mdm_appuserrolemapping>();
            per_permission = new HashSet<per_permission>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public long StatusId { get; set; }
        public bool Used { get; set; }

        public virtual enum_status Status { get; set; }
        public virtual ICollection<mdm_appuserrolemapping> mdm_appuserrolemapping { get; set; }
        public virtual ICollection<per_permission> per_permission { get; set; }
    }
}
