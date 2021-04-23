using System;
using System.Collections.Generic;

namespace CodeGeneration.Models
{
    public partial class dbo_notification
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long? OrganizationId { get; set; }
        public long NotificationStatusId { get; set; }

        public virtual enum_notificationstatus NotificationStatus { get; set; }
        public virtual mdm_organization Organization { get; set; }
    }
}
