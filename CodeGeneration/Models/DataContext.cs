using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CodeGeneration.Models
{
    public partial class DataContext : DbContext
    {
        public DataContext()
        {
        }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<dbo_file> dbo_file { get; set; }
        public virtual DbSet<dbo_mailtemplate> dbo_mailtemplate { get; set; }
        public virtual DbSet<dbo_notification> dbo_notification { get; set; }
        public virtual DbSet<enum_currency> enum_currency { get; set; }
        public virtual DbSet<enum_emailstatus> enum_emailstatus { get; set; }
        public virtual DbSet<enum_emailtype> enum_emailtype { get; set; }
        public virtual DbSet<enum_filetype> enum_filetype { get; set; }
        public virtual DbSet<enum_notificationstatus> enum_notificationstatus { get; set; }
        public virtual DbSet<enum_paymentstatus> enum_paymentstatus { get; set; }
        public virtual DbSet<enum_sex> enum_sex { get; set; }
        public virtual DbSet<enum_status> enum_status { get; set; }
        public virtual DbSet<mdm_appuser> mdm_appuser { get; set; }
        public virtual DbSet<mdm_appuserrolemapping> mdm_appuserrolemapping { get; set; }
        public virtual DbSet<mdm_district> mdm_district { get; set; }
        public virtual DbSet<mdm_image> mdm_image { get; set; }
        public virtual DbSet<mdm_nation> mdm_nation { get; set; }
        public virtual DbSet<mdm_organization> mdm_organization { get; set; }
        public virtual DbSet<mdm_phonetype> mdm_phonetype { get; set; }
        public virtual DbSet<mdm_position> mdm_position { get; set; }
        public virtual DbSet<mdm_profession> mdm_profession { get; set; }
        public virtual DbSet<mdm_province> mdm_province { get; set; }
        public virtual DbSet<mdm_taxtype> mdm_taxtype { get; set; }
        public virtual DbSet<mdm_unitofmeasure> mdm_unitofmeasure { get; set; }
        public virtual DbSet<mdm_unitofmeasuregrouping> mdm_unitofmeasuregrouping { get; set; }
        public virtual DbSet<mdm_unitofmeasuregroupingcontent> mdm_unitofmeasuregroupingcontent { get; set; }
        public virtual DbSet<mdm_ward> mdm_ward { get; set; }
        public virtual DbSet<per_action> per_action { get; set; }
        public virtual DbSet<per_actionpagemapping> per_actionpagemapping { get; set; }
        public virtual DbSet<per_field> per_field { get; set; }
        public virtual DbSet<per_fieldtype> per_fieldtype { get; set; }
        public virtual DbSet<per_menu> per_menu { get; set; }
        public virtual DbSet<per_page> per_page { get; set; }
        public virtual DbSet<per_permission> per_permission { get; set; }
        public virtual DbSet<per_permissionactionmapping> per_permissionactionmapping { get; set; }
        public virtual DbSet<per_permissioncontent> per_permissioncontent { get; set; }
        public virtual DbSet<per_permissionoperator> per_permissionoperator { get; set; }
        public virtual DbSet<per_role> per_role { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("data source=127.0.0.1;initial catalog=core;persist security info=True;user id=root;password=123@123a", x => x.ServerVersion("8.0.23-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<dbo_file>(entity =>
            {
                entity.HasIndex(e => e.AppUserId)
                    .HasName("FK_File_AppUser");

                entity.Property(e => e.Id)
                    .HasComment("Id")
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasComment("Ngày tạo");

                entity.Property(e => e.DeletedAt).HasComment("Ngày xoá");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(4000)")
                    .HasComment("Tên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.UpdatedAt).HasComment("Ngày cập nhật");

                entity.Property(e => e.Url)
                    .IsRequired()
                    .HasColumnType("varchar(4000)")
                    .HasComment("Đường dẫn Url")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.AppUser)
                    .WithMany(p => p.dbo_file)
                    .HasForeignKey(d => d.AppUserId)
                    .HasConstraintName("FK_File_AppUser");
            });

            modelBuilder.Entity<dbo_mailtemplate>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_MailTemplate_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Content)
                    .HasColumnType("varchar(4000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .HasColumnType("varchar(1000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.dbo_mailtemplate)
                    .HasForeignKey(d => d.StatusId)
                    .HasConstraintName("FK_MailTemplate_Status");
            });

            modelBuilder.Entity<dbo_notification>(entity =>
            {
                entity.HasIndex(e => e.NotificationStatusId)
                    .HasName("FK_Notification_NotificationStatus");

                entity.HasIndex(e => e.OrganizationId)
                    .HasName("FK_Notification_Organization");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Content)
                    .HasColumnType("varchar(4000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.NotificationStatus)
                    .WithMany(p => p.dbo_notification)
                    .HasForeignKey(d => d.NotificationStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Notification_NotificationStatus");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.dbo_notification)
                    .HasForeignKey(d => d.OrganizationId)
                    .HasConstraintName("FK_Notification_Organization");
            });

            modelBuilder.Entity<enum_currency>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(200)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_emailstatus>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_emailtype>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_filetype>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasComment("Id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasComment("Tên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasComment("Tên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_notificationstatus>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_paymentstatus>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_sex>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<enum_status>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<mdm_appuser>(entity =>
            {
                entity.HasIndex(e => e.OrganizationId)
                    .HasName("FK_AppUser_Organization");

                entity.HasIndex(e => e.SexId)
                    .HasName("FK_AppUser_Sex");

                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_AppUser_UserStatus");

                entity.Property(e => e.Id)
                    .HasComment("Id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Address)
                    .HasColumnType("varchar(500)")
                    .HasComment("Địa chỉ nhà")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Avatar)
                    .HasColumnType("varchar(4000)")
                    .HasComment("Ảnh đại diện")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.CreatedAt).HasComment("Ngày tạo");

                entity.Property(e => e.DeletedAt).HasComment("Ngày xoá");

                entity.Property(e => e.Department)
                    .HasColumnType("varchar(500)")
                    .HasComment("Phòng ban")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.DisplayName)
                    .HasColumnType("varchar(500)")
                    .HasComment("Tên hiển thị")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Email)
                    .HasColumnType("varchar(500)")
                    .HasComment("Địa chỉ email")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Latitude).HasColumnType("decimal(18,4)");

                entity.Property(e => e.Longitude).HasColumnType("decimal(18,4)");

                entity.Property(e => e.OrganizationId).HasComment("Đơn vị công tác");

                entity.Property(e => e.Phone)
                    .HasColumnType("varchar(500)")
                    .HasComment("Số điện thoại liên hệ")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasComment("Trường để đồng bộ")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.StatusId).HasComment("Trạng thái");

                entity.Property(e => e.UpdatedAt).HasComment("Ngày cập nhật");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasComment("Tên đăng nhập")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.mdm_appuser)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUser_Organization");

                entity.HasOne(d => d.Sex)
                    .WithMany(p => p.mdm_appuser)
                    .HasForeignKey(d => d.SexId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUser_Sex");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_appuser)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUser_UserStatus");
            });

            modelBuilder.Entity<mdm_appuserrolemapping>(entity =>
            {
                entity.HasKey(e => new { e.AppUserId, e.RoleId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.HasIndex(e => e.RoleId)
                    .HasName("FK_AppUserRoleMapping_Role");

                entity.Property(e => e.AppUserId).HasComment("Id nhân viên");

                entity.Property(e => e.RoleId).HasComment("Id nhóm quyền");

                entity.HasOne(d => d.AppUser)
                    .WithMany(p => p.mdm_appuserrolemapping)
                    .HasForeignKey(d => d.AppUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUserRoleMapping_AppUser");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.mdm_appuserrolemapping)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUserRoleMapping_Role");
            });

            modelBuilder.Entity<mdm_district>(entity =>
            {
                entity.HasIndex(e => e.ProvinceId)
                    .HasName("ProvinceId_idx");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.Property(e => e.Used).HasColumnType("bit(1)");

                entity.HasOne(d => d.Province)
                    .WithMany(p => p.mdm_district)
                    .HasForeignKey(d => d.ProvinceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProvinceId");
            });

            modelBuilder.Entity<mdm_image>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasComment("Id")
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasComment("Ngày tạo");

                entity.Property(e => e.DeletedAt).HasComment("Ngày xoá");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(4000)")
                    .HasComment("Tên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.ThumbnailUrl)
                    .HasColumnType("varchar(4000)")
                    .HasComment("Đường dẫn Url")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.UpdatedAt).HasComment("Ngày cập nhật");

                entity.Property(e => e.Url)
                    .IsRequired()
                    .HasColumnType("varchar(4000)")
                    .HasComment("Đường dẫn Url")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<mdm_nation>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Nation_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasComment("Mã quận huyện")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.CreatedAt).HasComment("Ngày tạo");

                entity.Property(e => e.DeletedAt).HasComment("Ngày xoá");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(200)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.StatusId).HasComment("Trạng thái hoạt động");

                entity.Property(e => e.UpdatedAt).HasComment("Ngày cập nhật");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_nation)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Nation_Status");
            });

            modelBuilder.Entity<mdm_organization>(entity =>
            {
                entity.HasIndex(e => e.ParentId)
                    .HasName("FK_Organization_Organization");

                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Organization_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Address)
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Email)
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Path)
                    .IsRequired()
                    .HasColumnType("varchar(400)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Phone)
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.InverseParent)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("FK_Organization_Organization");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_organization)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Organization_Status");
            });

            modelBuilder.Entity<mdm_phonetype>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_PhoneType_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_phonetype)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PhoneType_Status");
            });

            modelBuilder.Entity<mdm_position>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Position_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_position)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Position_Status");
            });

            modelBuilder.Entity<mdm_profession>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Profession_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_profession)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Profession_Status");
            });

            modelBuilder.Entity<mdm_province>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Province_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_province)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Province_Status");
            });

            modelBuilder.Entity<mdm_taxtype>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_TaxType_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Percentage).HasColumnType("decimal(18,4)");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_taxtype)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TaxType_Status");
            });

            modelBuilder.Entity<mdm_unitofmeasure>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_UnitOfMeasure_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Description)
                    .HasColumnType("varchar(3000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_unitofmeasure)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UnitOfMeasure_Status");
            });

            modelBuilder.Entity<mdm_unitofmeasuregrouping>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_UnitOfMeasureGrouping_Status");

                entity.HasIndex(e => e.UnitOfMeasureId)
                    .HasName("FK_UnitOfMeasureGrouping_UnitOfMeasure");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Description)
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_unitofmeasuregrouping)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UnitOfMeasureGrouping_Status");

                entity.HasOne(d => d.UnitOfMeasure)
                    .WithMany(p => p.mdm_unitofmeasuregrouping)
                    .HasForeignKey(d => d.UnitOfMeasureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UnitOfMeasureGrouping_UnitOfMeasure");
            });

            modelBuilder.Entity<mdm_unitofmeasuregroupingcontent>(entity =>
            {
                entity.HasIndex(e => e.UnitOfMeasureGroupingId)
                    .HasName("FK_UnitOfMeasureGroupingContent_UnitOfMeasureGrouping");

                entity.HasIndex(e => e.UnitOfMeasureId)
                    .HasName("FK_UnitOfMeasureGroupingContent_UnitOfMeasure");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.UnitOfMeasureGrouping)
                    .WithMany(p => p.mdm_unitofmeasuregroupingcontent)
                    .HasForeignKey(d => d.UnitOfMeasureGroupingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UnitOfMeasureGroupingContent_UnitOfMeasureGrouping");

                entity.HasOne(d => d.UnitOfMeasure)
                    .WithMany(p => p.mdm_unitofmeasuregroupingcontent)
                    .HasForeignKey(d => d.UnitOfMeasureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UnitOfMeasureGroupingContent_UnitOfMeasure");
            });

            modelBuilder.Entity<mdm_ward>(entity =>
            {
                entity.HasIndex(e => e.DistrictId)
                    .HasName("FK_Ward_District");

                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Ward_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RowId)
                    .IsRequired()
                    .HasColumnType("varchar(64)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.District)
                    .WithMany(p => p.mdm_ward)
                    .HasForeignKey(d => d.DistrictId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Ward_District");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.mdm_ward)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Ward_Status");
            });

            modelBuilder.Entity<per_action>(entity =>
            {
                entity.HasIndex(e => e.MenuId)
                    .HasName("FK_Action_Menu");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Menu)
                    .WithMany(p => p.per_action)
                    .HasForeignKey(d => d.MenuId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Action_Menu");
            });

            modelBuilder.Entity<per_actionpagemapping>(entity =>
            {
                entity.HasKey(e => new { e.ActionId, e.PageId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.HasIndex(e => e.PageId)
                    .HasName("FK_ActionPageMapping_Page");

                entity.HasOne(d => d.Action)
                    .WithMany(p => p.per_actionpagemapping)
                    .HasForeignKey(d => d.ActionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ActionPageMapping_Action");

                entity.HasOne(d => d.Page)
                    .WithMany(p => p.per_actionpagemapping)
                    .HasForeignKey(d => d.PageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ActionPageMapping_Page");
            });

            modelBuilder.Entity<per_field>(entity =>
            {
                entity.HasIndex(e => e.FieldTypeId)
                    .HasName("FK_Field_FieldType");

                entity.HasIndex(e => e.MenuId)
                    .HasName("FK_PermissionField_Menu");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.FieldType)
                    .WithMany(p => p.per_field)
                    .HasForeignKey(d => d.FieldTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Field_FieldType");

                entity.HasOne(d => d.Menu)
                    .WithMany(p => p.per_field)
                    .HasForeignKey(d => d.MenuId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PermissionField_Menu");
            });

            modelBuilder.Entity<per_fieldtype>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<per_menu>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(3000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Path)
                    .HasColumnType("varchar(3000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<per_page>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Path)
                    .IsRequired()
                    .HasColumnType("varchar(400)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<per_permission>(entity =>
            {
                entity.HasIndex(e => e.MenuId)
                    .HasName("FK_Permission_Menu");

                entity.HasIndex(e => e.RoleId)
                    .HasName("FK_Permission_Role");

                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Permission_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Menu)
                    .WithMany(p => p.per_permission)
                    .HasForeignKey(d => d.MenuId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Permission_Menu");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.per_permission)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Permission_Role");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.per_permission)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Permission_Status");
            });

            modelBuilder.Entity<per_permissionactionmapping>(entity =>
            {
                entity.HasKey(e => new { e.ActionId, e.PermissionId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.HasIndex(e => e.PermissionId)
                    .HasName("FK_ActionPermissionMapping_Permission");

                entity.HasOne(d => d.Action)
                    .WithMany(p => p.per_permissionactionmapping)
                    .HasForeignKey(d => d.ActionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ActionPermissionMapping_Action");

                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.per_permissionactionmapping)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ActionPermissionMapping_Permission");
            });

            modelBuilder.Entity<per_permissioncontent>(entity =>
            {
                entity.HasIndex(e => e.FieldId)
                    .HasName("FK_PermissionContent_Field");

                entity.HasIndex(e => e.PermissionId)
                    .HasName("FK_PermissionContent_Permission");

                entity.HasIndex(e => e.PermissionOperatorId)
                    .HasName("FK_PermissionContent_PermissionOperator");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Value)
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Field)
                    .WithMany(p => p.per_permissioncontent)
                    .HasForeignKey(d => d.FieldId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PermissionContent_Field");

                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.per_permissioncontent)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PermissionContent_Permission");

                entity.HasOne(d => d.PermissionOperator)
                    .WithMany(p => p.per_permissioncontent)
                    .HasForeignKey(d => d.PermissionOperatorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PermissionContent_PermissionOperator");
            });

            modelBuilder.Entity<per_permissionoperator>(entity =>
            {
                entity.HasIndex(e => e.FieldTypeId)
                    .HasName("FK_PermissionOperator_FieldType");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.FieldType)
                    .WithMany(p => p.per_permissionoperator)
                    .HasForeignKey(d => d.FieldTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PermissionOperator_FieldType");
            });

            modelBuilder.Entity<per_role>(entity =>
            {
                entity.HasIndex(e => e.StatusId)
                    .HasName("FK_Role_Status");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Name)
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.per_role)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Role_Status");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
