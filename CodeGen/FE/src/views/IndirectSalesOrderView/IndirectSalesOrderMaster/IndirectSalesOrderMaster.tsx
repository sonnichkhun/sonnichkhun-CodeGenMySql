import React from 'react';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import { Col, Row } from 'antd/lib/grid';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { tableService } from 'services';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INDIRECT_SALES_ORDER_ROUTE } from 'config/route-consts';
import './IndirectSalesOrderMaster.scss';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { EditPriceStatusFilter } from 'models/EditPriceStatusFilter';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { RequestStateStatus } from 'models/RequestStateStatus';
import { formatDate } from 'core/helpers/date-time';
import { formatNumber } from 'helpers/number-format';
import IndirectSalesOrderPreview from './IndirectSalesOrderPreview';

const { Item: FormItem } = Form;

function IndirectSalesOrderMaster() {
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
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<IndirectSalesOrder, IndirectSalesOrderFilter>(
    IndirectSalesOrder,
    IndirectSalesOrderFilter,
    indirectSalesOrderRepository.count,
    indirectSalesOrderRepository.list,
    indirectSalesOrderRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    INDIRECT_SALES_ORDER_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<
    IndirectSalesOrder
  >();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    indirectSalesOrderRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(
    indirectSalesOrderRepository.export,
    filter,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // const [indirectSalesOrderStatusList] = crudService.useEnumList<IndirectSalesOrderStatus>(indirectSalesOrderRepository.filterListIndirectSalesOrderStatus);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [buyerStoreFilter, setBuyerStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [saleEmployeeFilter, setSaleEmployeeFilter] = React.useState<
    AppUserFilter
  >(new AppUserFilter());

  const [sellerStoreFilter, setSellerStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [statusFilter, setStatusFilter] = React.useState<
    RequestStateStatusFilter
  >(new RequestStateStatusFilter());
  const [editPriceStatusFilter, setEditPriceStatusFilter] = React.useState<
    EditPriceStatusFilter
  >(new EditPriceStatusFilter());

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<IndirectSalesOrder>(
    indirectSalesOrderRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    indirectSalesOrderRepository.bulkDelete,
    setLoading,
    handleSearch,
  );

  const columns: ColumnProps<IndirectSalesOrder>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<IndirectSalesOrder>(pagination),
        },
        {
          title: translate('indirectSalesOrders.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].code),
            sorter,
          ),
        },
        {
          title: translate('indirectSalesOrders.buyerStore'),
          key: nameof(list[0].buyerStore),
          dataIndex: nameof(list[0].buyerStore),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].buyerStore),
            sorter,
          ),
          render(buyerStore: Store) {
            return buyerStore?.name;
          },
        },
        {
          title: translate('indirectSalesOrders.sellerStore'),
          key: nameof(list[0].sellerStore),
          dataIndex: nameof(list[0].sellerStore),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].sellerStore),
            sorter,
          ),
          render(sellerStore: Store) {
            return sellerStore?.name;
          },
        },
        {
          title: translate('indirectSalesOrders.saleEmployee'),
          key: nameof(list[0].saleEmployee),
          dataIndex: nameof(list[0].saleEmployee),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].saleEmployee),
            sorter,
          ),
          render(saleEmployee: AppUser) {
            return saleEmployee?.displayName;
          },
        },
        {
          title: translate('indirectSalesOrders.orderDate'),
          key: nameof(list[0].orderDate),
          dataIndex: nameof(list[0].orderDate),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].orderDate),
            sorter,
          ),
          render(...[orderDate]) {
            return formatDate(orderDate);
          },
        },
        {
          title: translate('indirectSalesOrders.total'),
          key: nameof(list[0].total),
          dataIndex: nameof(list[0].total),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].total),
            sorter,
          ),
          return(...[total]) {
            return formatNumber(total);
          },
        },
        {
          title: translate('indirectSalesOrders.isEditedPrice'),
          key: nameof(list[0].isEditedPrice),
          dataIndex: nameof(list[0].isEditedPrice),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].isEditedPrice),
            sorter,
          ),
          align: 'center',
          render(...[isEditedPrice]) {
            return (
              <div className={isEditedPrice === true ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.indirectSalesOrderStatus'),
          key: nameof(list[0].requestState),
          dataIndex: nameof(list[0].requestState),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].requestState),
            sorter,
          ),
          render(requestState: RequestStateStatus) {
            return (
              <>
                {requestState.id && requestState.id === 1 && (
                  <span className="new-state ml-4">
                    {requestState?.name}
                  </span>
                )}
                {requestState.id && requestState.id === 2 && (
                  <span className="pending-state ml-4">
                    {requestState?.name}
                  </span>
                )}
                {requestState.id && requestState.id === 3 && (
                  <span className="approved-state ml-4">
                    {requestState?.name}
                  </span>
                )}
                {requestState.id && requestState.id === 4 && (
                  <span className="rejected-state ml-4">
                    {requestState?.name}
                  </span>
                )}
              </>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, indirectSalesOrder: IndirectSalesOrder) {
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
                {/* Chỉ trạng thái Khởi tạo thì được phép xóa đơn hàng */}
                <button
                  className="btn btn-sm btn-link text-danger"
                  onClick={handleDelete(indirectSalesOrder)}
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
      <Card
        title={translate('indirectSalesOrders.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.startWith)}
                    filter={filter.phoneNumber}
                    onChange={handleFilter(nameof(filter.phoneNumber))}
                    className="w-100"
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.code',
                    )}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.buyerStore')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.buyerStoreId}
                    filterType={nameof(filter.buyerStoreId.equal)}
                    value={filter.buyerStoreId.equal}
                    onChange={handleFilter(nameof(filter.buyerStoreId))}
                    getList={indirectSalesOrderRepository.filterListStore}
                    modelFilter={buyerStoreFilter}
                    setModelFilter={setBuyerStoreFilter}
                    searchField={nameof(buyerStoreFilter.name)}
                    searchType={nameof(buyerStoreFilter.name.contain)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.sellerStore')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.sellerStoreId}
                    filterType={nameof(filter.sellerStoreId.equal)}
                    value={filter.sellerStoreId.equal}
                    onChange={handleFilter(nameof(filter.sellerStoreId))}
                    getList={indirectSalesOrderRepository.filterListStore}
                    modelFilter={sellerStoreFilter}
                    setModelFilter={setSellerStoreFilter}
                    searchField={nameof(sellerStoreFilter.name)}
                    searchType={nameof(sellerStoreFilter.name.contain)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.saleEmployee')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.saleEmployeeId}
                    filterType={nameof(filter.saleEmployeeId.equal)}
                    value={filter.saleEmployeeId.equal}
                    onChange={handleFilter(nameof(filter.saleEmployeeId))}
                    getList={indirectSalesOrderRepository.filterListAppUser}
                    modelFilter={saleEmployeeFilter}
                    setModelFilter={setSaleEmployeeFilter}
                    searchField={nameof(saleEmployeeFilter.displayName)}
                    searchType={nameof(saleEmployeeFilter.displayName.contain)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate(
                    'indirectSalesOrders.indirectSalesOrderStatus',
                  )}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.indirectSalesOrderStatusId}
                    filterType={nameof(filter.indirectSalesOrderStatusId.equal)}
                    value={filter.indirectSalesOrderStatusId.equal}
                    onChange={handleFilter(
                      nameof(filter.indirectSalesOrderStatusId),
                    )}
                    getList={
                      indirectSalesOrderRepository.singleListRequestState
                    }
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    searchType={nameof(statusFilter.name.contain)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.isEditedPrice')}
                >
                  <AdvancedIdFilter
                    filter={filter.editedPriceStatusId}
                    filterType={nameof(filter.editedPriceStatusId.equal)}
                    value={filter.editedPriceStatusId.equal}
                    onChange={handleFilter(nameof(filter.editedPriceStatusId))}
                    getList={
                      indirectSalesOrderRepository.singleListEditPriceStatus
                    }
                    modelFilter={editPriceStatusFilter}
                    setModelFilter={setEditPriceStatusFilter}
                    searchField={nameof(editPriceStatusFilter.name)}
                    searchType={nameof(editPriceStatusFilter.name.contain)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.orderDate')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={filter.orderDate}
                    filterType={nameof(filter.orderDate.greaterEqual)}
                    onChange={handleFilter(nameof(filter.orderDate))}
                    className="w-100"
                    placeholder={translate('indirectSalesOrders.placeholder.orderDate')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.total')}
                  labelAlign="left"
                >
                  <div className="d-flex">
                    <AdvancedNumberFilter
                      filterType={nameof(filter.total.range)}
                      filter={filter.total}
                      onChange={handleFilter(nameof(filter.total))}
                      className="w-100"
                    />
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleDefaultSearch}
            >
              {translate(generalLanguageKeys.actions.filter)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleReset}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#ee534d"
                  d="M47.434,46.7c0-.009,0-.018,0-.047,0-.008,0-.017-.007-.046,0-.007,0-.014-.011-.045l-.016-.044-.02-.042-.025-.043-5.088-7.61H55.313L50.49,46.039h1.086l4.956-7.413,0,0,.014-.023.009-.016.011-.024.008-.018.008-.023c0-.007,0-.013.007-.02s0-.014.005-.021,0-.016.006-.024,0-.013,0-.019,0-.018,0-.027,0-.012,0-.019,0-.019,0-.028,0,0,0-.005,0-.01,0-.015,0-.017,0-.025,0-.016,0-.024,0-.014,0-.021,0-.017-.005-.026l0-.018c0-.009-.005-.017-.008-.025a.341.341,0,0,0-.016-.041l-.009-.019-.01-.02-.012-.02-.011-.017-.014-.02-.013-.016-.015-.018-.016-.016L56.458,38l-.021-.018-.009-.008,0,0-.025-.017-.013-.009-.023-.012-.017-.009-.019-.008L56.3,37.9l-.014,0-.029-.008-.011,0-.033-.005h-.01l-.034,0H41.483l-.037,0a.422.422,0,0,0-.3.085.489.489,0,0,0-.1.656l5.5,8.23v6.562c0,.01,0,.02,0,.03s0,.012,0,.018,0,.017,0,.026l0,.022.005.021.007.026.006.017c0,.009.007.019.011.028l0,.005.009.018.005.011c.006.012.013.024.02.035l0,.006.02.029,0,.006a.457.457,0,0,0,.057.06l0,0a.447.447,0,0,0,.06.043l.01.006a.38.38,0,0,0,.048.023l.018.007a.447.447,0,0,0,.05.015l.014,0,.026,0,.014,0,.038,0h0a.434.434,0,0,0,.085-.009h.006l.035-.01.01,0,.031-.012.012-.005.007,0,1.175-.575V52.228l-.917.449V46.7Zm9.53.159-.615-.613-3.074,3.064L50.2,46.247l-.615.613,3.074,3.064-3.074,3.064.615.613,3.074-3.064L56.349,53.6l.615-.613L53.89,49.925Z"
                  transform="translate(-40.964 -37.883)"
                />
              </svg>
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
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
        <IndirectSalesOrderPreview
          indirectSalesOrder={previewModel}
          indirectSalesOrderContent={previewModel?.indirectSalesOrderContents}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default IndirectSalesOrderMaster;
