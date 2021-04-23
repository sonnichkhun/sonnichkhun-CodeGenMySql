using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeGeneration.App.Model
{
    public class Class : IEquatable<Class>
    {
        public static Language Language { get; set; }
        public static List<string> Enumerations = new List<string>();
        public static Dictionary<string, List<string>> ChildTable = new Dictionary<string, List<string>>();
        public string Pascal { get; set; }
        public string Camel { get; set; }
        public string Kebab { get; set; }
        public string Snake { get; set; }
        public string Lower { get; set; }
        public string Upper { get; set; }
        public string Plural { get; set; }
        public string Singular { get; set; }
        public string RefId
        {
            get
            {
                return Pascal + "Id";
            }
        }
        public bool IsEnum
        {
            get
            {
                return Enumerations.Any(e => e.Equals(Pascal));
            }
        }
        public bool IsMapping
        {
            get
            {
                return Pascal.ToLower().Contains("mapping");
            }
        }
        public bool ContainsPK
        {
            get
            {
                return Properties.Any(p => p.IsPK);
            }
        }
        public bool ContainsFlag
        {
            get
            {
                if (Properties == null)
                    return false;
                return Properties.Any(p => p.Pascal == "CreatedAt" || p.Pascal == "UpdatedAt" || p.Pascal == "DeletedAt");
            }
        }

        public bool ConstainsList
        {
            get
            {
                return Properties.Any(p => p.IsList);
            }
        }

        public bool ContainsIdFilter
        {
            get
            {
                return Properties.Any(p => p.IsFilter && p.IsId);
            }
        }

        public bool ContainsStringFilter
        {
            get
            {
                return Properties.Any(p => p.IsFilter && p.IsString);
            }
        }

        public bool ContainsNumberFilter
        {
            get
            {
                return Properties.Any(p => p.IsFilter && p.IsNumber);
            }
        }

        public bool ContainsDateFilter
        {
            get
            {
                return Properties.Any(p => p.IsFilter && p.IsDate);
            }
        }

        public bool IsTable
        {
            get
            {
                if (Pascal.EndsWith("Mapping") || Pascal.EndsWith("Content"))
                    return true;
                return false;
            }
        }
        public bool IsTree
        {
            get
            {
                if (Properties == null)
                    return false;
                return Properties.Any(p => p.Pascal == "ParentId");
            }
        }
        public List<Class> References
        {
            get
            {
                List<Class> _reference = new List<Class>();
                foreach (var Property in Properties)
                {
                    if (Property.IsReference)
                        _reference.Add(Property.Class);
                    if (Property.IsList)
                    {
                        _reference.Add(Property.Class);
                        var children = Property.Class.Properties;
                        foreach (var child in children)
                        {
                            if (child.IsReference)
                                _reference.Add(child.Class);
                        }
                    }
                }
                _reference = _reference.Distinct().ToList();
                return _reference;
            }
        }
        public List<Property> Properties { get; set; }

        public Class() { }
        public Class(string name)
        {
            Camel = name.Camel();
            Kebab = name.Kebab();
            Pascal = name.Pascal();
            Snake = name.Snake();
            Plural = Language == Language.CSharp ? name.Plural() : name.Plural().Camel();
            Singular = Language == Language.CSharp ? name.Singular() : name.Singular().Camel();
            Lower = name.Lower();
            Upper = name.Upper();
        }

        public bool Equals(Class other)
        {
            if (other == null)
                return false;
            if (this.Pascal == other.Pascal)
                return true;
            return false;
        }
        public override int GetHashCode()
        {
            return Pascal.GetHashCode();
        }
    }
}
