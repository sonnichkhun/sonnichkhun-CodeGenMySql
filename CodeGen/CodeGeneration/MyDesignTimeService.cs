using Inflector;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Common
{
    public class MyDesignTimeService : IDesignTimeServices
    {
        public void ConfigureDesignTimeServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddHandlebarsScaffolding();
            serviceCollection.AddHandlebarsTransformers(
              entityNameTransformer: x => x + "",
              entityFileNameTransformer: x => x + "",
              constructorTransformer: x =>
              {
                  x.PropertyType += "";
                  return x;
              },
              navPropertyTransformer: x =>
              {
                  x.PropertyType += "";
                  return x;
              });
            serviceCollection.AddSingleton<IPluralizer, CustomPluralizer>();
        }
    }

    public class CustomPluralizer : IPluralizer
    {
        public static Inflector.Inflector inflector = new Inflector.Inflector(new CultureInfo("en"));
        public string Pluralize(string identifier)
        {
            return inflector.Pluralize(identifier) ?? identifier;
        }

        public string Singularize(string identifier)
        {
            return inflector.Singularize(identifier) ?? identifier;
        }
    }

}