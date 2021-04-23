using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class enum_status
    {
        public enum_status()
        {
            dbo_mailtemplate = new HashSet<dbo_mailtemplate>();
            mdm_appuser = new HashSet<mdm_appuser>();
            mdm_nation = new HashSet<mdm_nation>();
            mdm_organization = new HashSet<mdm_organization>();
            mdm_phonetype = new HashSet<mdm_phonetype>();
            mdm_position = new HashSet<mdm_position>();
            mdm_profession = new HashSet<mdm_profession>();
            mdm_province = new HashSet<mdm_province>();
            mdm_taxtype = new HashSet<mdm_taxtype>();
            mdm_unitofmeasure = new HashSet<mdm_unitofmeasure>();
            mdm_unitofmeasuregrouping = new HashSet<mdm_unitofmeasuregrouping>();
            mdm_ward = new HashSet<mdm_ward>();
            per_permission = new HashSet<per_permission>();
            per_role = new HashSet<per_role>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public virtual ICollection<dbo_mailtemplate> dbo_mailtemplate { get; set; }
        public virtual ICollection<mdm_appuser> mdm_appuser { get; set; }
        public virtual ICollection<mdm_nation> mdm_nation { get; set; }
        public virtual ICollection<mdm_organization> mdm_organization { get; set; }
        public virtual ICollection<mdm_phonetype> mdm_phonetype { get; set; }
        public virtual ICollection<mdm_position> mdm_position { get; set; }
        public virtual ICollection<mdm_profession> mdm_profession { get; set; }
        public virtual ICollection<mdm_province> mdm_province { get; set; }
        public virtual ICollection<mdm_taxtype> mdm_taxtype { get; set; }
        public virtual ICollection<mdm_unitofmeasure> mdm_unitofmeasure { get; set; }
        public virtual ICollection<mdm_unitofmeasuregrouping> mdm_unitofmeasuregrouping { get; set; }
        public virtual ICollection<mdm_ward> mdm_ward { get; set; }
        public virtual ICollection<per_permission> per_permission { get; set; }
        public virtual ICollection<per_role> per_role { get; set; }
    }
}
