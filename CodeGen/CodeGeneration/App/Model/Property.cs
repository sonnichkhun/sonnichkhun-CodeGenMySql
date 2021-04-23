using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeGeneration.App.Model
{
    public class Property : IEquatable<Property>
    {
        public static Language Language { get; set; }
        public string Pascal { get; set; }
        public string Camel { get; set; }
        public string Kebab { get; set; }
        public string Snake { get; set; }
        public string Lower { get; set; }
        public string Upper { get; set; }
        public string Plural { get; set; }
        public string Singular { get; set; }
        public string Filter { get; set; }
        public string FilterType { get; set; }
        public string Type { get; set; }
        public bool IsPrimitive { get; set; }
        public bool IsReference { get; set; }
        public bool IsList { get; set; }
        public bool IsMapping { get; set; }
        public bool IsPK { get; set; }
        public bool IsFK { get; set; }
        public bool IsNumber { get; set; }
        public bool IsString { get; set; }
        public bool IsDate { get; set; }
        public bool IsInt { get; set; }
        public bool IsLong { get; set; }
        public bool IsDecimal { get; set; }
        public bool IsDouble { get; set; }
        public bool IsGuid { get; set; }
        public bool IsBool { get; set; }
        public bool IsFilter { get; set; }
        public bool IsId { get; set; }
        public bool IsNullable { get; set; }
        public Class Class { get; set; }
        public Class MappingClass { get; set; }

        public Property() { }
        public Property(string name)
        {
            SetName(name);
        }

        public void SetName(string name)
        {
            Camel = name.Camel();
            Kebab = name.Kebab();
            Pascal = name.Pascal();
            Snake = name.Snake();
            FilterType = name.FilterType();
            Lower = name.Lower();
            Upper = name.Upper();
            Singular = Language == Language.CSharp ? name.Singular() : name.Singular().Camel();
            Plural = Language == Language.CSharp ? name.Plural() : name.Plural().Camel();
            Filter = name.EndsWith("Id") && name.Length > 2 ? name.Substring(0, name.Length - 2) : name;
        }

        public bool Equals(Property other)
        {
            if (other == null) return false;
            return this.Pascal == other.Pascal;
        }

        public override int GetHashCode()
        {
            return Pascal.GetHashCode();
        }
    }
}
