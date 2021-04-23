using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class enum_notificationstatus
    {
        public enum_notificationstatus()
        {
            dbo_notification = new HashSet<dbo_notification>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public virtual ICollection<dbo_notification> dbo_notification { get; set; }
    }
}
