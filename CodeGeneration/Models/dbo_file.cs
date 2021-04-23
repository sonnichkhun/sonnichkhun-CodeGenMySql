using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class dbo_file
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public long? AppUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string RowId { get; set; }

        public virtual mdm_appuser AppUser { get; set; }
    }
}
