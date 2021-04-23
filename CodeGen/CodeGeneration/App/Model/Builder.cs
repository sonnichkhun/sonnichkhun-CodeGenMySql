using HandlebarsDotNet;
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
        public string Namespace;
        public string Module;
        public string RootFolder;
        public Class Build(Type type)
        {
            string typeName = type.Name.Standard();
            Class Class = new Class(typeName);
            Class.Properties = new List<Property>();
            var properties = type.GetProperties().ToList();
            foreach (var property in properties)
            {
                if (IgnoreProperty(property))
                    continue;
                string propertyName = property.Name;
                Property Property = new Property(propertyName);
                Class.Properties.Add(Property);
                SetPrimitve(Property, property);
                Property.IsPrimitive = false;
                Property.IsReference = false;
                Property.IsList = false;
                Property.IsMapping = false;
                if (string.IsNullOrEmpty(Property.Type))
                {
                    if (property.PropertyType.Name == typeof(ICollection<>).Name)
                    {
                        Type type1 = property.PropertyType.GetGenericArguments().FirstOrDefault();
                        if (type1.Name.Standard() == typeName)
                            continue;
                        string listTypeName = type1.Name.Standard();
                        Property.Type = listTypeName;
                        Property.Class = new Class(listTypeName);
                        if (Class.ChildTable.ContainsKey(Class.Pascal) &&
                            Class.ChildTable[Class.Pascal].Contains(listTypeName))
                            Property.IsList = true;
                        else
                            continue;
                        // la mapping
                        if (type1.Name.Standard().ToLower().EndsWith("mapping"))
                        {
                            // bảng chung vào biến class
                            Property.IsMapping = true;
                            var MappingClass = type1.GetProperties().Where(p =>
                             type1.Name.Standard().Contains(p.PropertyType.Name.Standard()) &&
                             p.PropertyType.Name.Standard() != type.Name.Standard() &&
                             p.PropertyType.FullName != typeof(long).FullName &&
                             p.PropertyType.FullName != typeof(long?).FullName).FirstOrDefault();
                            Property.MappingClass = new Class(MappingClass.Name.Standard());
                            var PropertyInMapping = MappingClass.PropertyType.GetProperties().ToList();
                            Property.MappingClass.Properties = new List<Property>();
                            foreach (var p in PropertyInMapping)
                            {
                                if (IgnoreProperty(p))
                                    continue;
                                string propertyOfReferenceName = p.Name;
                                Property propertyOfReference = new Property(propertyOfReferenceName);
                                Property.MappingClass.Properties.Add(propertyOfReference);
                                SetPrimitve(propertyOfReference, p);
                            }
                        }

                        var childrenInList = property.PropertyType.GetGenericArguments().FirstOrDefault().GetProperties().ToList();
                        Property.Class.Properties = new List<Property>();
                        // lay cac property cua list thuong
                        foreach (var child in childrenInList)
                        {
                            if (IgnoreProperty(child))
                                continue;
                            string property1Name = child.Name;
                            Property PropertyInList = new Property(property1Name);
                            Property.Class.Properties.Add(PropertyInList);
                            SetPrimitve(PropertyInList, child);
                            // lay reference trong list thuong
                            if (string.IsNullOrEmpty(PropertyInList.Type))
                            {
                                if (child.PropertyType.Name != typeof(ICollection<>).Name && child.PropertyType.Name != type.Name)
                                {
                                    PropertyInList.IsReference = true;
                                    PropertyInList.Type = child.PropertyType.Name.Standard();
                                    PropertyInList.Class = new Class(PropertyInList.Type);
                                    var PropertyInReference = child.PropertyType.GetProperties().ToList();
                                    PropertyInList.Class.Properties = new List<Property>();
                                    foreach (var p in PropertyInReference)
                                    {
                                        if (IgnoreProperty(p))
                                            continue;
                                        string propertyOfReferenceName = p.Name;
                                        Property propertyOfReference = new Property(propertyOfReferenceName);
                                        PropertyInList.Class.Properties.Add(propertyOfReference);
                                        SetPrimitve(propertyOfReference, p);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        Property.IsReference = true;
                        Property.Type = property.PropertyType.Name.Standard();
                        Property.Class = new Class(Property.Type);
                        var propertiesOfReference = property.PropertyType.GetProperties().ToList();
                        Property.Class.Properties = new List<Property>();
                        foreach (var p in propertiesOfReference)
                        {
                            if (IgnoreProperty(p))
                                continue;
                            string propertyOfReferenceName = p.Name;
                            Property propertyOfReference = new Property(propertyOfReferenceName);
                            Property.Class.Properties.Add(propertyOfReference);
                            SetPrimitve(propertyOfReference, p);
                        }
                    }
                }
                else
                {
                    SetPrimitve(Property, property);
                }
            }
            return Class;
        }
        public void SetPrimitve(Property property, PropertyInfo propertyInfo)
        {
            if (Class.Language == Language.CSharp)
                SetCSharpPrimitve(property, propertyInfo);
            if (Class.Language == Language.React)
                SetReactPrimitve(property, propertyInfo);
        }
        public bool IgnoreProperty(PropertyInfo propertyInfo)
        {
            if (propertyInfo.Name.ToLower() == "RowId".ToLower())
                return true;
            if (propertyInfo.Name.ToLower().Contains("Navigation".ToLower()))
                return true;
            return false;
        }

        public void CopyFolder(string sourceFolder, string destFolder)
        {
            if (!Directory.Exists(sourceFolder))
                return;
            if (!Directory.Exists(destFolder))
                Directory.CreateDirectory(destFolder);
            string[] files = Directory.GetFiles(sourceFolder);
            foreach (string file in files)
            {
                string name = Path.GetFileName(file);
                string dest = Path.Combine(destFolder, name);
                Console.WriteLine(dest);
                System.IO.File.Copy(file, dest, true);
            }
            string[] folders = Directory.GetDirectories(sourceFolder);
            foreach (string folder in folders)
            {
                string name = Path.GetFileName(folder);
                string dest = Path.Combine(destFolder, name);
                CopyFolder(folder, dest);
            }
        }

        public void Delete(string path)
        {
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }

        private void Write(Class Parent, Class Class, string templatePath, string resultPath)
        {
            string str = File.ReadAllText(templatePath);
            var data = new
            {
                Namespace = Namespace,
                Class = Class,
                Parent = Parent,
                Module = Module,
            };
            var template = Handlebars.Compile(str);
            var result = template(data);
            File.WriteAllText(resultPath, result);
        }

        private void Write(Class Parent, Class Class, Class MappingClass, string templatePath, string resultPath)
        {
            string str = File.ReadAllText(templatePath);
            var data = new
            {
                Namespace = Namespace,
                Class = Class,
                Parent = Parent,
                MappingClass = MappingClass,
                Module = Module,
            };
            var template = Handlebars.Compile(str);
            var result = template(data);
            File.WriteAllText(resultPath, result);
        }


        private void WriteList(List<Class> Classes, string templatePath, string resultPath)
        {
            string str = File.ReadAllText(templatePath);
            var data = new
            {
                Namespace = Namespace,
                Classes = Classes,
                Module = Module,
            };
            var template = Handlebars.Compile(str);
            var result = template(data);
            File.WriteAllText(resultPath, result);
        }
    }

    public enum Language
    {
        CSharp,
        React,
        Angular,
    }
}
