using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class mdm_appuserrolemapping
    {
        public long AppUserId { get; set; }
        public long RoleId { get; set; }

        public virtual mdm_appuser AppUser { get; set; }
        public virtual per_role Role { get; set; }
    }
}
