using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CodeGeneration.App.Model
{
    public partial class Builder
    {
        private void SetCSharpPrimitve(Property property, PropertyInfo propertyInfo)
        {
            property.IsNullable = false;
            if (propertyInfo.Name == "Id")
                property.IsPK = true;
            else if (propertyInfo.Name.EndsWith("Id"))
                property.IsFK = true;

            if (propertyInfo.Name.EndsWith("Id"))
            {
                property.IsPrimitive = true;
                property.IsId = true;
                property.FilterType = "IdFilter";
                property.IsFilter = true;
                if (propertyInfo.PropertyType.FullName == typeof(long).FullName)
                    property.Type = "long";
                if (propertyInfo.PropertyType.FullName == typeof(long?).FullName)
                {
                    property.Type = "long?";
                    property.IsNullable = true;
                }
            }
            else
            {
                if (propertyInfo.PropertyType.FullName == typeof(Guid).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "Guid";
                    property.FilterType = "GuidFilter";
                    property.IsNumber = true;
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(Guid?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "Guid?";
                    property.FilterType = "GuidFilter";
                    property.IsNumber = true;
                    property.IsFilter = true;
                    property.IsNullable = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(int).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "int";
                    property.IsLong = true;
                    property.IsNumber = true;
                    property.FilterType = "IntFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(int?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "int?";
                    property.IsLong = true;
                    property.IsNumber = true;
                    property.FilterType = "IntFilter";
                    property.IsFilter = true;
                    property.IsNullable = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(decimal).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "decimal";
                    property.IsDecimal = true;
                    property.IsNumber = true;
                    property.FilterType = "DecimalFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(decimal?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "decimal?";
                    property.IsDecimal = true;
                    property.IsNumber = true;
                    property.FilterType = "DecimalFilter";
                    property.IsFilter = true;
                    property.IsNullable = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(double).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "double";
                    property.IsDecimal = true;
                    property.IsNumber = true;
                    property.FilterType = "DoubleFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(double?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "double?";
                    property.IsDecimal = true;
                    property.IsNumber = true;
                    property.FilterType = "DoubleFilter";
                    property.IsFilter = true;
                    property.IsNullable = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(string).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "string";
                    property.IsString = true;
                    property.FilterType = "StringFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(DateTime).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "DateTime";
                    property.IsDate = true;
                    property.FilterType = "DateFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(DateTime?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "DateTime?";
                    property.IsDate = true;
                    property.FilterType = "DateFilter";
                    property.IsFilter = true;
                    property.IsNullable = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(long).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "long";
                    property.IsLong = true;
                    property.IsNumber = true;
                    property.FilterType = property.IsId ? "IdFilter" : "LongFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(long?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "long?";
                    property.IsLong = true;
                    property.IsNumber = true;
                    property.FilterType = property.IsId ? "IdFilter" : "LongFilter";
                    property.IsFilter = true;
                    property.IsNullable = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(bool).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "bool";
                }
                if (propertyInfo.PropertyType.FullName == typeof(bool?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "bool?";
                    property.IsNullable = true;
                }
                if (property.Pascal == "CreatedAt" || property.Pascal == "UpdatedAt" || property.Pascal == "DeletedAt")
                {
                    property.IsPrimitive = false;
                    property.IsFilter = false;
                }
            }
        }

        public void BuildCS(List<Type> types)
        {
            RootFolder = "./CSharp";
            Class.Language = Language.CSharp;
            Property.Language = Language.CSharp;
            List<Class> Classes = types.Select(t => Build(t)).ToList();
            Directory.CreateDirectory($"{RootFolder}/");
            Directory.CreateDirectory($"{RootFolder}/Common");
            Directory.CreateDirectory($"{RootFolder}/consul");
            Directory.CreateDirectory($"{RootFolder}/Entities");
            Directory.CreateDirectory($"{RootFolder}/Repositories");
            Directory.CreateDirectory($"{RootFolder}/Services");
            Directory.CreateDirectory($"{RootFolder}/Rpc");
            Directory.CreateDirectory($"{RootFolder}/Helpers");
            Directory.CreateDirectory($"{RootFolder}/Resources/vi");
            Directory.CreateDirectory($"{RootFolder}/Resources/en");

            Write(null, null, "./App/Csharp/Common/appsettings.hbs", $"{RootFolder}/appsettings.json");
            Write(null, null, "./App/Csharp/Common/commandcli.hbs", $"{RootFolder}/Common/command-cli.txt");
            Write(null, null, "./App/Csharp/Common/Common.hbs", $"{RootFolder}/Common/Common.cs");
            Write(null, null, "./App/Csharp/Common/CurrentContext.hbs", $"{RootFolder}/Common/CurrentContext.cs");
            Write(null, null, "./App/Csharp/Common/DataDTO.hbs", $"{RootFolder}/Common/DataDTO.cs");
            Write(null, null, "./App/Csharp/Common/DataEntity.hbs", $"{RootFolder}/Common/DataEntity.cs");
            Write(null, null, "./App/Csharp/Common/DataFile.hbs", $"{RootFolder}/Common/DataFile.cs");
            Write(null, null, "./App/Csharp/Common/ErrorHandlingMiddleware.hbs", $"{RootFolder}/Common/ErrorHandlingMiddleware.cs");
            Write(null, null, "./App/Csharp/Common/ExcelExtension.hbs", $"{RootFolder}/Common/ExcelExtension.cs");
            Write(null, null, "./App/Csharp/Common/FilterEntity.hbs", $"{RootFolder}/Common/FilterEntity.cs");
            Write(null, null, "./App/Csharp/Common/FilterPermissionDefinition.hbs", $"{RootFolder}/Common/FilterPermissionDefinition.cs");
            Write(null, null, "./App/Csharp/Common/FilterType.hbs", $"{RootFolder}/Common/FilterType.cs");
            Write(null, null, "./App/Csharp/Common/MyDesignTimeService.hbs", $"{RootFolder}/Common/MyDesignTimeService.cs");
            Write(null, null, "./App/Csharp/Common/Startup.hbs", $"{RootFolder}/Startup.cs");
            Write(null, null, "./App/Csharp/Common/Program.hbs", $"{RootFolder}/Program.cs");
            Write(null, null, "./App/Csharp/Common/project.hbs", $"{RootFolder}/App.csproj");

            Write(null, null, "./App/Csharp/Common/app.json.hbs", $"{RootFolder}/consul/app.json");
            Write(null, null, "./App/Csharp/Common/client.json.hbs", $"{RootFolder}/consul/client.json");
            Write(null, null, "./App/Csharp/Common/docker-compose.yml.hbs", $"{RootFolder}/docker-compose.yml");
            Write(null, null, "./App/Csharp/Common/docker-entrypoint.sh.hbs", $"{RootFolder}/docker-entrypoint.sh.json");
            Write(null, null, "./App/Csharp/Common/Dockerfile.hbs", $"{RootFolder}/Dockerfile");

            Directory.CreateDirectory($"{RootFolder}/Properties");
            Write(null, null, "./App/Csharp/Common/launchSettings.hbs", $"{RootFolder}/Properties/launchSettings.json");

            foreach (var Class in Classes)
            {
                Write(null, Class, "./App/Csharp/entity.hbs", $"{RootFolder}/Entities/{Class.Pascal}.cs");
            }
            Write(null, null, "./App/Csharp/base_service.hbs", $"{RootFolder}/Services/BaseService.cs");
            Write(null, null, "./App/Csharp/logging.hbs", $"{RootFolder}/Helpers/Logging.cs");
            Write(null, null, "./App/Csharp/staticparams.hbs", $"{RootFolder}/Helpers/StaticParams.cs");
            WriteList(Classes, "./App/Csharp/uow.hbs", $"{RootFolder}/Repositories/UOW.cs");

            foreach (var Class in Classes)
            {
                if (Class.IsMapping || !Class.ContainsPK)
                    continue;
                Write(null, Class, "./App/Csharp/repository.hbs", $"{RootFolder}/Repositories/{Class.Pascal}Repository.cs");
                if (!Directory.Exists($"{RootFolder}/Services/M{Class.Pascal}Service"))
                    Directory.CreateDirectory($"{RootFolder}/Services/M{Class.Pascal}");
                Write(null, Class, "./App/Csharp/service.hbs", $"{RootFolder}/Services/M{Class.Pascal}/{Class.Pascal}Service.cs");
                Write(null, Class, "./App/Csharp/validator.hbs", $"{RootFolder}/Services/M{Class.Pascal}/{Class.Pascal}Validator.cs");
                Write(null, Class, "./App/Csharp/translator.json.hbs", $"{RootFolder}/Resources/en/{Class.Pascal}Validator.json");
                Write(null, Class, "./App/Csharp/translator.json.hbs", $"{RootFolder}/Resources/vi/{Class.Pascal}Validator.json");
            }

            Write(null, null, "./App/Csharp/rpc_controller.hbs", $"{RootFolder}/Rpc/RpcController.cs");

            foreach (var Class in Classes)
            {
                if (Class.IsMapping || !Class.ContainsPK)
                    continue;

                if (!Directory.Exists($"{RootFolder}/Rpc/{Class.Kebab}"))
                    Directory.CreateDirectory($"{RootFolder}/Rpc/{Class.Kebab}");

                Write(Class, Class, "./App/Csharp/route.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}Route.cs");
                Write(Class, Class, "./App/Csharp/controller.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}Controller.cs");
                Write(Class, Class, "./App/Csharp/controller_list.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}Controller_List.cs");
                Write(Class, Class, "./App/Csharp/maindto.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}_{Class.Pascal}DTO.cs");
                foreach (var Property in Class.Properties)
                {
                    if (Property.IsReference && Property.Class.Pascal != Class.Pascal)
                    {
                        Write(Class, Property.Class, "./App/Csharp/referencedto.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}_{Property.Class.Pascal}DTO.cs");
                    }
                    if (Property.IsList && Property.Class.Pascal != Class.Pascal)
                    {
                        Write(Class, Property.Class, "./App/Csharp/listdto.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}_{Property.Class.Pascal}DTO.cs");
                        var children = Property.Class.Properties;
                        foreach (var child in children)
                        {
                            if (child.IsReference && child.Class.Pascal != Class.Pascal && child.Class.Pascal != Property.Class.Pascal)
                            {
                                Write(Class, child.Class, "./App/Csharp/referencedto.hbs", $"{RootFolder}/Rpc/{Class.Kebab}/{Class.Pascal}_{child.Class.Pascal}DTO.cs");
                            }
                        }
                    }
                }
            }
        }
    }
}