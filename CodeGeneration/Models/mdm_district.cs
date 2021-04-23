using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class mdm_district
    {
        public mdm_district()
        {
            mdm_ward = new HashSet<mdm_ward>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public long? Priority { get; set; }
        public long ProvinceId { get; set; }
        public long StatusId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string RowId { get; set; }
        public ulong Used { get; set; }

        public virtual mdm_province Province { get; set; }
        public virtual ICollection<mdm_ward> mdm_ward { get; set; }
    }
}
