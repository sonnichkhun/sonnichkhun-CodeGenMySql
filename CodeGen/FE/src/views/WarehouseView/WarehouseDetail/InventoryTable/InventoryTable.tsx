import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { IdFilter } from 'core/filters';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Inventory } from 'models/Inventory';
import { Item } from 'models/Item';
import { ProductFilter } from 'models/ProductFilter';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Warehouse } from 'models/Warehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import nameof from 'ts-nameof.macro';
import { warehouseRepository } from 'views/WarehouseView/WarehouseRepository';
import { warehouseService } from '../../WarehouseService';
import InventoryHistoryModal from '../InventoryHistoryModal/InventoryHistoryModal';

const { Item: FormItem } = Form;

function InventoryTable(props: ContentTableProps<Warehouse, Inventory>) {
  const [translate] = useTranslation();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);

  const { model, setModel } = props;

  // UOM filter
  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [productFilter, setProductFilter] = React.useState<ProductFilter>(
    new ProductFilter(),
  );
  const [
    inventories,
    setInventories,
    dataSource,
    pagination,
    handleTableChange,
  ] = warehouseService.useInventoryLocalTable(
    model,
    setModel,
    nameof(model.inventories),
    productFilter,
    setProductFilter,
  );

  const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
    Inventory
  >(inventories, setInventories);

  const handleViewHistory = React.useCallback(
    (inventory: Inventory) => {
      setVisible(true);
      setCurrentItem(inventory);
    },
    [setVisible, setCurrentItem],
  );

  const handleClose = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      productFilter[field].contain = ev.target.value;
      setProductFilter({
        ...productFilter,
      });
    },
    [productFilter],
  );

  const handleIdFilter = React.useCallback(
    (field: string) => (filter: IdFilter) => {
      productFilter[field] = filter;
      setProductFilter({
        ...productFilter,
      });
    },
    [productFilter],
  );

  const columns: ColumnProps<Inventory>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.columns.index)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Inventory>(pagination),
      },

      {
        title: () => (
          <>
            <div>{translate('warehouses.item.code')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(productFilter.code))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].itemCode),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('warehouses.item.name')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(productFilter.name))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].itemName),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
      },
      {
        title: () => (
          <div className="table-title-header ml-3">
            {translate('warehouses.saleStock')}
          </div>
        ),
        key: nameof(dataSource[0].inventories.saleStock),
        dataIndex: nameof(dataSource[0].inventories.saleStock),
        render(saleStock: number, inventory: Inventory, index: number) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Inventory>(
                inventory.errors,
                nameof(inventory.saleStock),
              )}
              help={inventory.errors?.saleStock}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(saleStock)}
                defaultValue={inventory.saleStock}
                onChange={handleChangeListSimpleField(nameof(saleStock), index)}
              />
            </FormItem>
          );
        },
      },
      {
        title: () => (
          <div className="table-title-header ml-3">
            {translate('warehouses.accountingStock')}
          </div>
        ),
        key: nameof(dataSource[0].accountingStock),
        dataIndex: nameof(dataSource[0].accountingStock),
        render(accountingStock: number, inventory: Inventory, index: number) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Inventory>(
                inventory.errors,
                nameof(inventory.accountingStock),
              )}
              help={inventory.errors?.accountingStock}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(accountingStock)}
                defaultValue={inventory.accountingStock}
                onChange={handleChangeListSimpleField(
                  nameof(accountingStock),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        // title: translate('warehouses.item.unitOfMeasure'),
        title: () => (
          <>
            <div className="mb-2">{translate('warehouses.item.unitOfMeasure')}</div>
            <AdvancedIdFilter
              className="w-100"
              filter={productFilter.unitOfMeasureId}
              filterType={nameof(productFilter.unitOfMeasureId.equal)}
              value={productFilter.unitOfMeasureId.equal}
              onChange={handleIdFilter(nameof(productFilter.unitOfMeasureId))}
              getList={warehouseRepository.singleListUnitOfMeasure}
              modelFilter={unitOfMeasureFilter}
              setModelFilter={setUnitOfMeasureFilter}
              searchField={nameof(unitOfMeasureFilter.name)}
              allowClear={true}
              placeholder={translate('warehouses.placeholder.unitOfMeasure')}
            />
          </>
        ),
        key: nameof(dataSource[0].item),
        width: 250,
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.product?.unitOfMeasure?.name;
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.actions.label)}
          </div>
        ),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [Inventory, Inventory, number]) {
          return (
            <>
              <button
                className="btn btn-link mr-2"
                onClick={() => handleViewHistory(params[1])}
              >
                <i className="fa fa-history text-danger" aria-hidden="true" />
              </button>
            </>
          );
        },
      },
    ],
    [
      pagination,
      dataSource,
      translate,
      handleValueFilter,
      productFilter.code,
      productFilter.name,
      productFilter.unitOfMeasureId,
      handleChangeListSimpleField,
      handleIdFilter,
      unitOfMeasureFilter,
      handleViewHistory,
    ],
  );

  return (
    <>
      <Table
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        className="local-table"
      />
      {visible && (
        <InventoryHistoryModal
          title={translate('warehouses.master.inventoryHistory')}
          isOpen={visible}
          currentItem={currentItem}
          getList={warehouseRepository.listHistory}
          count={warehouseRepository.countHistory}
          handleClose={handleClose}
        />
      )}
    </>
  );
}
export default InventoryTable;
