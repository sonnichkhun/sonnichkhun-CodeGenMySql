using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_field
    {
        public per_field()
        {
            per_permissioncontent = new HashSet<per_permissioncontent>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long FieldTypeId { get; set; }
        public long MenuId { get; set; }
        public bool IsDeleted { get; set; }

        public virtual per_fieldtype FieldType { get; set; }
        public virtual per_menu Menu { get; set; }
        public virtual ICollection<per_permissioncontent> per_permissioncontent { get; set; }
    }
}
