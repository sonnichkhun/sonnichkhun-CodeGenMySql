using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_actionpagemapping
    {
        public long ActionId { get; set; }
        public long PageId { get; set; }

        public virtual per_action Action { get; set; }
        public virtual per_page Page { get; set; }
    }
}
