# CodeGenerator
 
- Tất cả các file code được sinh ra sẽ ignore khỏi git, tránh trường hợp đẩy một commit khổng lồ lên
- File cấu hình theo môi trường đặc biệt, ví dụ: `appsettings.Development.json` sẽ ignore khỏi git, chỉ giữ lại file chuẩn chung nhất
- Front-end sẽ được tích hợp vào dưới dạng submodule bằng lệnh:
    ```bash
    git submodule update --init
    ```
- Câu lệnh sinh model từ database:
    ```bash
    dotnet ef dbcontext scaffold  "data source=HostName;initial catalog=DatabaseName;persist security info=True;user id=SA;password=Password; MultipleActiveResultSets=True;" Microsoft.EntityFrameworkCore.SqlServer -c DataContext  -o Models -f --no-build --use-database-names --json
    ```
- Tạo ra file build mới dựa trên file sample: Thay đổi câu lệnh trong đoạn connection string cho phù hợp