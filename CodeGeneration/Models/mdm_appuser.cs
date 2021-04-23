using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class mdm_appuser
    {
        public mdm_appuser()
        {
            dbo_file = new HashSet<dbo_file>();
            mdm_appuserrolemapping = new HashSet<mdm_appuserrolemapping>();
        }

        public long Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public long SexId { get; set; }
        public DateTime? Birthday { get; set; }
        public string Avatar { get; set; }
        public string Department { get; set; }
        public long OrganizationId { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Latitude { get; set; }
        public long StatusId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string RowId { get; set; }
        public bool Used { get; set; }

        public virtual mdm_organization Organization { get; set; }
        public virtual enum_sex Sex { get; set; }
        public virtual enum_status Status { get; set; }
        public virtual ICollection<dbo_file> dbo_file { get; set; }
        public virtual ICollection<mdm_appuserrolemapping> mdm_appuserrolemapping { get; set; }
    }
}
