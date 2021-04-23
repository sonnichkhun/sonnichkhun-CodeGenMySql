import React from 'react';
import { Route, Switch } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';
import { Card } from 'reactstrap';
import { SupplierFilter } from 'models/SupplierFilter';
import { productRepository } from 'views/ProductView/ProductRepository';
import nameof from 'ts-nameof.macro';
import { ProductFilter } from 'models/ProductFilter';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';

function ATestSelectFilterView(props: RouteConfigComponentProps) {
  const [filter, setFilter] = React.useState<ProductFilter>(
    new ProductFilter(),
  );
  const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
    new SupplierFilter(),
  );

  const handleFilter = React.useCallback(
    field => {
      return (f: string) => setFilter({ ...filter, [field]: f });
    },
    [filter],
  );

  React.useEffect(() => {
    // console.log(`product filter: ${JSON.stringify(filter)}`);
  }, [filter]);

  React.useEffect(() => {
    // console.log(`supplierFilter: ${JSON.stringify(supplierFilter)}`);
  }, [supplierFilter]);

  return (
    <Switch>
      <Route path={props.route.path}>
        <Card>
          <h1>Test</h1>
          <SelectAutoComplete
            onChange={handleFilter(nameof(filter.supplierId))}
            getList={productRepository.singleListSupplier}
            modelFilter={supplierFilter}
            setModelFilter={setSupplierFilter}
            searchField={nameof(supplierFilter.name)}
          ></SelectAutoComplete>
        </Card>
      </Route>
    </Switch>
  );
}
export default ATestSelectFilterView;
