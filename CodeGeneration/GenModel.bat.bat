dotnet ef dbcontext scaffold  "data source=127.0.0.1;initial catalog=core;persist security info=True;user id=root;password=123@123a;" Pomelo.EntityFrameworkCore.MySql -c DataContext --use-database-names -o Models -f
pause