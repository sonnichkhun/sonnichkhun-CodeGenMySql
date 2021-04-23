using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class mdm_unitofmeasuregroupingcontent
    {
        public long Id { get; set; }
        public long UnitOfMeasureGroupingId { get; set; }
        public long UnitOfMeasureId { get; set; }
        public long? Factor { get; set; }
        public string RowId { get; set; }

        public virtual mdm_unitofmeasure UnitOfMeasure { get; set; }
        public virtual mdm_unitofmeasuregrouping UnitOfMeasureGrouping { get; set; }
    }
}
