using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
namespace CodeGeneration.App.Model
{
    public static class StringHelper
    {
        public static Inflector.Inflector inflector = new Inflector.Inflector(new CultureInfo("en"));
        public static string Standard(this string name)
        {
            return name.Replace(" ", " ");
        }
        public static string Camel(this string name)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(Char.ToLower(name[0]));
            builder.Append(name.Substring(1, name.Length - 1));
            return builder.ToString();
        }
        public static string Kebab(this string name)
        {
            List<string> split = Regex.Split(name, @"(?<!^)(?=[A-Z])").Select(s => s.ToLower().Trim()).ToList();
            string result = string.Join("-", split);
            return result;
        }
        public static string Snake(this string name)
        {
            List<string> split = Regex.Split(name, @"(?<!^)(?=[A-Z])").Select(s => s.ToLower().Trim()).ToList();
            string result = string.Join("_", split);
            return result;
        }

        public static string Lower(this string name)
        {
            return name.Snake().ToLower();
        }
        public static string Upper(this string name)
        {
            return name.Snake().ToUpper();
        }

        public static string Plural(this string name)
        {
            return inflector.Pluralize(name);
        }

        public static string Singular(this string name)
        {
            string temp = inflector.Singularize(name);
            if (temp == null) return name;
            return temp;
        }
        public static string Pascal(this string name)
        {
            return name;
        }

        public static string FilterType(this string name)
        {
            if (name == null)
                return null;
            if (name.EndsWith("Id") && name.Length > 2)
                return name.Substring(0, name.Length - 2);
            return name;
        }

       
    }
}
