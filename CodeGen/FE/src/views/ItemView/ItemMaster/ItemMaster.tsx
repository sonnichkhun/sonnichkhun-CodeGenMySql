import Card from 'antd/lib/card';
import Descriptions from 'antd/lib/descriptions';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Spin from 'antd/lib/spin';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { formItemLayout } from 'config/ant-design/form';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { ITEM_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { itemRepository } from 'views/ItemView/ItemRepository';
import './ItemMaster.scss';

const { Item: FormItem } = Form;

function ItemMaster() {
  const [translate] = useTranslation();

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
  ] = crudService.useMaster<Item, ItemFilter>(
    Item,
    ItemFilter,
    itemRepository.count,
    itemRepository.list,
    itemRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    ITEM_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<Item>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    itemRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(itemRepository.export, filter);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [productFilter, setProductFilter] = React.useState<ProductFilter>(
    new ProductFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Item>(
    itemRepository.delete,
    setLoading,
    list,
    setList,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    itemRepository.bulkDelete,
    setLoading,
  );

  const columns: ColumnProps<Item>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Item>(pagination),
        },

        {
          title: translate('items.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Item>(nameof(list[0].code), sorter),
        },

        {
          title: translate('items.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Item>(nameof(list[0].name), sorter),
        },

        {
          title: translate('items.scanCode'),
          key: nameof(list[0].scanCode),
          dataIndex: nameof(list[0].scanCode),
          sorter: true,
          sortOrder: getOrderTypeForTable<Item>(
            nameof(list[0].scanCode),
            sorter,
          ),
        },

        {
          title: translate('items.salePrice'),
          key: nameof(list[0].salePrice),
          dataIndex: nameof(list[0].salePrice),
          sorter: true,
          sortOrder: getOrderTypeForTable<Item>(
            nameof(list[0].salePrice),
            sorter,
          ),
        },

        {
          title: translate('items.retailPrice'),
          key: nameof(list[0].retailPrice),
          dataIndex: nameof(list[0].retailPrice),
          sorter: true,
          sortOrder: getOrderTypeForTable<Item>(
            nameof(list[0].retailPrice),
            sorter,
          ),
        },

        {
          title: translate('items.product'),
          key: nameof(list[0].product),
          dataIndex: nameof(list[0].product),
          sorter: true,
          sortOrder: getOrderTypeForTable<Item>(
            nameof(list[0].product),
            sorter,
          ),
          render(product: Product) {
            return product?.name;
          },
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, item: Item) {
            return (
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-sm btn-link text-warning"
                  onClick={handleOpenPreview(id)}
                >
                  <i className="fa fa-eye" />
                </button>
                <button
                  className="btn btn-sm btn-link"
                  onClick={handleGoDetail(id)}
                >
                  <i className="fa fa-edit" />
                </button>
                <button
                  className="btn btn-sm btn-link text-danger"
                  onClick={handleDelete(item)}
                >
                  <i className="fa fa-trash" />
                </button>
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleGoDetail,
      handleOpenPreview,
      list,
      pagination,
      sorter,
      translate,
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('items.master.title')}>
        <Card
          className="head-borderless mb-4"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('items.code')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.startWith)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('items.name')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.startWith)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('items.scanCode')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.scanCode.startWith)}
                    filter={filter.scanCode}
                    onChange={handleFilter(nameof(filter.scanCode))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('items.salePrice')}>
                  <AdvancedNumberFilter
                    filterType={nameof(filter.salePrice.equal)}
                    filter={filter.salePrice}
                    onChange={handleFilter(nameof(filter.salePrice))}
                    placeholder={translate('items.placeholder.salePrice')}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.retailPrice')}
                >
                  <AdvancedNumberFilter
                    filterType={nameof(filter.retailPrice.equal)}
                    filter={filter.retailPrice}
                    onChange={handleFilter(nameof(filter.retailPrice))}
                    placeholder={translate('items.placeholder.retailPrice')}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('items.product')}>
                  <AdvancedIdFilter
                    filter={filter.productId}
                    filterType={nameof(filter.productId.equal)}
                    value={filter.productId.equal}
                    onChange={handleFilter(nameof(filter.productId))}
                    modelFilter={productFilter}
                    setModelFilter={setProductFilter}
                    getList={itemRepository.singleListProduct}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleSearch}
            >
              {translate(generalLanguageKeys.actions.filter)}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary text-dark"
              onClick={handleReset}
            >
              <i className="fa mr-2 fa-times" />
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </Card>
        <Table
          dataSource={list}
          columns={columns}
          bordered
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleGoCreate}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate(generalLanguageKeys.actions.create)}
                  </button>
                  <button
                    className="btn btn-sm btn-danger mr-2"
                    disabled={!hasSelected}
                    onClick={handleBulkDelete}
                  >
                    <i className="fa mr-2 fa-trash" />
                    {translate(generalLanguageKeys.actions.delete)}
                  </button>
                  <label
                    className="btn btn-sm btn-outline-primary mr-2 mb-0"
                    htmlFor="master-import"
                  >
                    <i className="fa mr-2 fa-upload" />
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="fa mr-2 fa-download" />
                    {translate(generalLanguageKeys.actions.export)}
                  </button>
                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
        <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
        />
        <MasterPreview
          isOpen={previewVisible}
          onClose={handleClosePreview}
          size="xl"
        >
          <Spin spinning={previewLoading}>
            <Descriptions title={previewModel.name} bordered>
              <Descriptions.Item label={translate('items.id')}>
                {previewModel?.id}
              </Descriptions.Item>

              <Descriptions.Item label={translate('items.code')}>
                {previewModel?.code}
              </Descriptions.Item>

              <Descriptions.Item label={translate('items.name')}>
                {previewModel?.name}
              </Descriptions.Item>

              <Descriptions.Item label={translate('items.scanCode')}>
                {previewModel?.scanCode}
              </Descriptions.Item>

              <Descriptions.Item label={translate('items.salePrice')}>
                {previewModel?.salePrice}
              </Descriptions.Item>

              <Descriptions.Item label={translate('items.retailPrice')}>
                {previewModel?.retailPrice}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </MasterPreview>
      </Card>
    </div>
  );
}

export default ItemMaster;
