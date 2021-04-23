using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace CodeGeneration.App.Model
{
    public partial class Builder
    {
        private void SetReactPrimitve(Property property, PropertyInfo propertyInfo)
        {
            if (propertyInfo.Name == "Id")
                property.IsPK = true;
            else if (propertyInfo.Name.EndsWith("Id"))
                property.IsFK = true;

            if (propertyInfo.Name.EndsWith("Id"))
            {
                property.IsPrimitive = true;
                property.IsId = true;
                property.Type = "number";
                property.FilterType = "IdFilter";
                property.IsFilter = true;
            }
            else
            {
                if (propertyInfo.PropertyType.FullName == typeof(Guid).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "string";
                    property.FilterType = "GuidFilter";
                    property.IsNumber = true;
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(Guid?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "string";
                    property.FilterType = "GuidFilter";
                    property.IsNumber = true;
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(int).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = property.IsId ? "IdFilter" : "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(int?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = property.IsId ? "IdFilter" : "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(decimal).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(decimal?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(double).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(double?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = "NumberFilter";
                    property.IsFilter = true;
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
                    property.Type = "Moment";
                    property.IsDate = true;
                    property.FilterType = "DateFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(DateTime?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "Moment";
                    property.IsDate = true;
                    property.FilterType = "DateFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(long).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = property.IsId ? "IdFilter" : "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(long?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "number";
                    property.IsNumber = true;
                    property.FilterType = property.IsId ? "IdFilter" : "NumberFilter";
                    property.IsFilter = true;
                }
                if (propertyInfo.PropertyType.FullName == typeof(bool).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "boolean";
                }
                if (propertyInfo.PropertyType.FullName == typeof(bool?).FullName)
                {
                    property.IsPrimitive = true;
                    property.Type = "boolean";
                }
                if (property.Pascal == "CreatedAt" || property.Pascal == "UpdatedAt" || property.Pascal == "DeletedAt")
                {
                    property.IsPrimitive = false;
                    property.IsFilter = false;
                }
            }
        }

        public void BuildReact(List<Type> types)
        {
            RootFolder = "./React";
            Class.Language = Language.React;
            Property.Language = Language.React;
            List<Class> Classes = types.Select(t => Build(t)).ToList();
            Delete("./React");
            Directory.CreateDirectory("./React");
            if (!Directory.Exists($"{RootFolder}/src/models"))
                Directory.CreateDirectory($"{RootFolder}/src/models");
            if (!Directory.Exists($"{RootFolder}/src/views"))
                Directory.CreateDirectory($"{RootFolder}/src/views");
            if (!Directory.Exists($"{RootFolder}/src/config"))
                Directory.CreateDirectory($"{RootFolder}/src/config");

            WriteList(Classes, "./App/React/api_constant.hbs", $"{RootFolder}/src/config/api-consts.ts");
            WriteList(Classes, "./App/React/menu.hbs", $"{RootFolder}/src/config/menu.ts");
            WriteList(Classes, "./App/React/route_constant.hbs", $"{RootFolder}/src/config/route-consts.ts");
            WriteList(Classes, "./App/React/route.hbs", $"{RootFolder}/src/config/routes.tsx");
            foreach (var Class in Classes)
            {
                Write(null, Class, "./App/React/entity.hbs", $"{RootFolder}/src/models/{Class.Pascal}.ts");
                Write(null, Class, "./App/React/filter.hbs", $"{RootFolder}/src/models/{Class.Pascal}Filter.ts");
            }

            foreach (var Class in Classes)
            {
                if (Class.IsEnum || Class.IsMapping)
                    continue;
                if (!Class.IsTree)
                {
                    if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}View"))
                        Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}View");
                    if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Master"))
                        Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Master");
                    if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail"))
                        Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail");

                    Write(null, Class, "./App/React/view_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}View.scss");
                    Write(null, Class, "./App/React/view_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}View.test.tsx");
                    Write(null, Class, "./App/React/view_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}View.tsx");

                    Write(null, Class, "./App/React/master_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Master/{Class.Pascal}Master.scss");
                    Write(null, Class, "./App/React/master_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Master/{Class.Pascal}Master.test.tsx");
                    Write(null, Class, "./App/React/master_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Master/{Class.Pascal}Master.tsx");

                    Write(null, Class, "./App/React/detail_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Class.Pascal}Detail.scss");
                    Write(null, Class, "./App/React/detail_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Class.Pascal}Detail.test.tsx");
                    Write(null, Class, "./App/React/detail_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Class.Pascal}Detail.tsx");

                    Write(null, Class, "./App/React/repository.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Repository.ts");

                    foreach (var Property in Class.Properties)
                    {
                        if (Property.IsList)
                        {
                            if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Class.Pascal}Table"))
                                Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Table");
                            if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Class.Pascal}Modal") && Property.IsMapping)
                                Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Modal");

                            Write(Class, Property.Class, "./App/React/table_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Table/{Property.Class.Pascal}Table.scss");
                            Write(Class, Property.Class, "./App/React/table_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Table/{Property.Class.Pascal}Table.test.tsx");
                            if (!Property.IsMapping)
                                Write(Class, Property.Class, "./App/React/table_content_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Table/{Property.Class.Pascal}Table.tsx");
                            if (Property.IsMapping)
                            {
                                Write(Class, Property.Class, Property.MappingClass, "./App/React/table_content_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Table/{Property.Class.Pascal}Table.tsx");
                                Write(Class, Property.Class, Property.MappingClass, "./App/React/table_popup_mapping_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}View/{Class.Pascal}Detail/{Property.Class.Pascal}Modal/{Property.Class.Pascal}Modal.tsx");
                            }
                        }
                    }
                }
                else
                {
                    if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}TreeView"))
                        Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}TreeView");
                    if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeMaster"))
                        Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeMaster");
                    if (!Directory.Exists($"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeDetail"))
                        Directory.CreateDirectory($"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeDetail");

                    Write(null, Class, "./App/React/view_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}View.scss");
                    Write(null, Class, "./App/React/view_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeView.test.tsx");
                    Write(null, Class, "./App/React/view_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeView.tsx");

                    Write(null, Class, "./App/React/master_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeMaster/{Class.Pascal}Master.scss");
                    Write(null, Class, "./App/React/master_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeMaster/{Class.Pascal}TreeMaster.test.tsx");
                    Write(null, Class, "./App/React/master_tree_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeMaster/{Class.Pascal}TreeMaster.tsx");

                    Write(null, Class, "./App/React/detail_css.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeDetail/{Class.Pascal}Detail.scss");
                    Write(null, Class, "./App/React/detail_test.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeDetail/{Class.Pascal}TreeDetail.test.tsx");
                    Write(null, Class, "./App/React/detail_tree_view.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}TreeDetail/{Class.Pascal}TreeDetail.tsx");

                    Write(null, Class, "./App/React/repository.hbs", $"{RootFolder}/src/views/{Class.Pascal}TreeView/{Class.Pascal}Repository.ts");
                }
            }
        }
    }
}
