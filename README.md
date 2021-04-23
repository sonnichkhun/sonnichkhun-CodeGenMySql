Created By SONHX5-FIS-TSD
Hướng dẫn sử dụng phần generation Code :
B1 : Mở CodeGeneration -> Mở file GenModel.bat -> Sửa connectionstring (setup để nguyên) -> Crtl + S
B2 : Chạy file GenModel.bat
B3 : Copy file Models vào thư mục : CodeGen -> CodeGeneration -> Copy vào bên trong thư mục CodeGeneration
B4 : Chạy CodeGeneration.sln -> Sửa file DataContext (MySQL -> MySql) + remove hết những dòng có chứa "entity.HasIndex"
B5 : Bấm F5
B6 : Code sẽ được generate ở file AppCSharp bên ngoài 
B7 : Copy code thôi -> Done



<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net5.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="5.0.5">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="MySql.Data.EntityFrameworkCore" Version="8.0.20" />
    <PackageReference Include="MySql.EntityFrameworkCore" Version="5.0.0+m8.0.23" />
    <PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="5.0.0-alpha.2" />
    <PackageReference Include="Pomelo.EntityFrameworkCore.MySql.NetTopologySuite" Version="5.0.0-alpha.2" />
  </ItemGroup>

</Project>
