using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class mdm_organization
    {
        public mdm_organization()
        {
            InverseParent = new HashSet<mdm_organization>();
            dbo_notification = new HashSet<dbo_notification>();
            mdm_appuser = new HashSet<mdm_appuser>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public long? ParentId { get; set; }
        public string Path { get; set; }
        public long Level { get; set; }
        public long StatusId { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string RowId { get; set; }
        public bool Used { get; set; }

        public virtual mdm_organization Parent { get; set; }
        public virtual enum_status Status { get; set; }
        public virtual ICollection<mdm_organization> InverseParent { get; set; }
        public virtual ICollection<dbo_notification> dbo_notification { get; set; }
        public virtual ICollection<mdm_appuser> mdm_appuser { get; set; }
    }
}
