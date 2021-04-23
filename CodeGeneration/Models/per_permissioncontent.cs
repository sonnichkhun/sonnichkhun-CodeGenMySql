using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class per_permissioncontent
    {
        public long Id { get; set; }
        public long PermissionId { get; set; }
        public long FieldId { get; set; }
        public long PermissionOperatorId { get; set; }
        public string Value { get; set; }

        public virtual per_field Field { get; set; }
        public virtual per_permission Permission { get; set; }
        public virtual per_permissionoperator PermissionOperator { get; set; }
    }
}
