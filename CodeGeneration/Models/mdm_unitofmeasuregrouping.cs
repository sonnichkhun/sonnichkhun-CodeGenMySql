using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class mdm_unitofmeasuregrouping
    {
        public mdm_unitofmeasuregrouping()
        {
            mdm_unitofmeasuregroupingcontent = new HashSet<mdm_unitofmeasuregroupingcontent>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long UnitOfMeasureId { get; set; }
        public long StatusId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool Used { get; set; }
        public string RowId { get; set; }

        public virtual enum_status Status { get; set; }
        public virtual mdm_unitofmeasure UnitOfMeasure { get; set; }
        public virtual ICollection<mdm_unitofmeasuregroupingcontent> mdm_unitofmeasuregroupingcontent { get; set; }
    }
}
