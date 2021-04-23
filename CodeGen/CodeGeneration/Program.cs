using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using CodeGeneration.App.Model;
using HandlebarsDotNet;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;

namespace CodeGeneration
{
    public class Program
    {
        public static string Namespace = "BASE";
        public static string Module = "base";

        public static void Main(string[] args)
        {
            if (args.Count() >= 1)
                Namespace = args[0];
            if (args.Count() >= 2)
                Module = args[1];
            var inflector = new Inflector.Inflector(new CultureInfo("en"));
            Handlebars.RegisterHelper("ifCond", (writer, options, context, arguments) =>
            {
                string value1 = arguments[0].ToString();
                string condition = arguments[1].ToString();
                string value2 = arguments[2].ToString();
                switch (condition)
                {
                    case "=":
                    case "==":
                        if (value1 == value2)
                            options.Template(writer, (object)context);
                        else
                            options.Inverse(writer, (object)context);
                        break;
                    case "!=":
                        if (value1 != value2)
                            options.Template(writer, (object)context);
                        else
                            options.Inverse(writer, (object)context);
                        break;
                    case ">":
                        if (string.Compare(value1, value2) > 0)
                            options.Template(writer, (object)context);
                        else
                            options.Inverse(writer, (object)context);
                        break;
                    case ">=":
                        if (string.Compare(value1, value2) >= 0)
                            options.Template(writer, (object)context);
                        else
                            options.Inverse(writer, (object)context);
                        break;
                    case "<":
                        if (string.Compare(value1, value2) < 0)
                            options.Template(writer, (object)context);
                        else
                            options.Inverse(writer, (object)context);
                        break;
                    case "<=":
                        if (string.Compare(value1, value2) <= 0)
                            options.Template(writer, (object)context);
                        else
                            options.Inverse(writer, (object)context);
                        break;
                }
            });

            Handlebars.RegisterHelper("concat", (writer, options, context, arguments) =>
            {
                string str = string.Join("", arguments);
                writer.Write(str);
            });

            Handlebars.RegisterHelper("pluralize", (writer, context, arguments) =>
            {
                writer.Write(inflector.Pluralize(arguments[0].ToString()));
            });

            (new Program()).Build();
        }

        public void Build()
        { 
            List<Type> types = typeof(Program)
                .Assembly.GetTypes()
                .Where(p =>
                p.FullName.Contains("CodeGeneration.Models.")
                && !p.FullName.Contains("CodeGeneration.Models.DataContext")
                ).ToList();
            //.Where(t => t.Name.EndsWith("") && !t.IsAbstract).ToList();

            if (File.Exists($"./Configs/{Module}/Enum.json"))
            {
                string json = File.ReadAllText($"./Configs/{Module}/Enum.json");
                List<string> enums = JsonConvert.DeserializeObject<List<string>>(json);
                Class.Enumerations = enums;
            }
            if (File.Exists($"./Configs/{Module}/ChildTable.json"))
            {
                string json = File.ReadAllText($"./Configs/{Module}/ChildTable.json");
                Dictionary<string, List<string>> childTable = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json);
                Class.ChildTable = childTable;
            }
            Builder builder = new Builder();
            builder.Namespace = Namespace;
            builder.Module = Module;
            builder.Delete("./CSharp");
            builder.Delete("./React");
            Thread.Sleep(1000);

            //Directory.CreateDirectory("../AppReact");
            //builder.CopyFolder("../FE", "../AppReact");
            //builder.BuildReact(types);
            //builder.CopyFolder("./React", "../AppReact");

            Directory.CreateDirectory("../AppCSharp");
            Directory.CreateDirectory("../AppCSharp/Models");
            string[] files = Directory.GetFiles("./Models");
            foreach (var file in files)
            {
                string content = File.ReadAllText(file);
                content = content.Replace("CodeGeneration", Namespace);
                FileInfo fileInfo = new FileInfo(file);
                File.WriteAllText("../AppCSharp/Models/" + fileInfo.Name, content);
            }
            builder.BuildCS(types);
            builder.CopyFolder("./CSharp", "../AppCSharp");
        }
    }
}
