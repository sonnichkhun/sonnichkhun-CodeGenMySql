import Card from 'antd/lib/card';
import Descriptions from 'antd/lib/descriptions';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Spin from 'antd/lib/spin';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { SUPPLIER_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Status } from 'models/Status';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { supplierRepository } from 'views/SupplierView/SupplierRepository';
import { StatusFilter } from 'models/StatusFilter';
import { formatDateTime } from 'core/helpers/date-time';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';

const { Item: FormItem } = Form;

function SupplierMaster() {
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
  ] = crudService.useMaster<Supplier, SupplierFilter>(
    Supplier,
    SupplierFilter,
    supplierRepository.count,
    supplierRepository.list,
    supplierRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    SUPPLIER_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<Supplier>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    supplierRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(
    supplierRepository.export,
    filter,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Supplier>(
    supplierRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    supplierRepository.bulkDelete,
    setLoading,
    handleSearch,
  );

  const columns: ColumnProps<Supplier>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Supplier>(pagination),
        },
        {
          title: translate('suppliers.code'),
          key: nameof(list[0].code),
          width: 100,
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].code),
            sorter,
          ),
        },
        {
          title: translate('suppliers.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].name),
            sorter,
          ),
          ellipsis: true,
        },
        {
          title: translate('suppliers.taxCode'),
          key: nameof(list[0].taxCode),
          dataIndex: nameof(list[0].taxCode),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].taxCode),
            sorter,
          ),
        },
        {
          title: translate('suppliers.phone'),
          key: nameof(list[0].phone),
          width: 110,
          dataIndex: nameof(list[0].phone),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].phone),
            sorter,
          ),
        },

        {
          title: translate('suppliers.address'),
          key: nameof(list[0].address),
          dataIndex: nameof(list[0].address),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].address),
            sorter,
          ),
          ellipsis: true,
        },

        {
          title: translate('suppliers.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].status),
            sorter,
          ),
          align: 'center',
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },

        {
          title: translate('suppliers.updatedTime'),
          key: nameof(list[0].updatedTime),
          dataIndex: nameof(list[0].updatedTime),
          sorter: true,
          sortOrder: getOrderTypeForTable<Supplier>(
            nameof(list[0].updatedTime),
            sorter,
          ),
          render(...[updatedTime]) {
            return formatDateTime(updatedTime);
          },
          ellipsis: true,
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, supplier: Supplier) {
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
                  onClick={handleDelete(supplier)}
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
      <Card title={translate('suppliers.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('suppliers.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('suppliers.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('suppliers.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('suppliers.placeholder.name')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('suppliers.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.email.contain)}
                    filter={filter.email}
                    onChange={handleFilter(nameof(filter.email))}
                    className="w-100"
                    placeholder={translate('suppliers.placeholder.email')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('suppliers.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.phone.contain)}
                    filter={filter.phone}
                    onChange={handleFilter(nameof(filter.phone))}
                    className="w-100"
                    placeholder={translate('suppliers.placeholder.phone')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('suppliers.address')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.address.contain)}
                    filter={filter.address}
                    onChange={handleFilter(nameof(filter.address))}
                    className="w-100"
                    placeholder={translate('suppliers.placeholder.address')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('suppliers.status')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.statusId}
                    filterType={nameof(filter.statusId.equal)}
                    value={filter.statusId.equal}
                    onChange={handleFilter(nameof(filter.statusId))}
                    getList={supplierRepository.singleListStatus}
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('suppliers.placeholder.status')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleDefaultSearch}
            >
              <i className="fa mr-2 fa-search" />
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
        <MasterPreview
          isOpen={previewVisible}
          onClose={handleClosePreview}
          size="xl"
          title={previewModel.name}
        >
          <Spin spinning={previewLoading}>
            <Descriptions column={4}>
              <Descriptions.Item label={translate('suppliers.id')}>
                {previewModel?.id}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.code')}>
                {previewModel?.code}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.name')}>
                <Tooltip placement="bottomLeft" title={previewModel?.name}>
                  {limitWord(previewModel?.name, 30)}
                </Tooltip>
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.taxCode')}>
                {previewModel?.taxCode}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.phone')}>
                {previewModel?.phone}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.email')}>
                {previewModel?.email}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.address')}>
                <Tooltip placement="bottomLeft" title={previewModel?.address}>
                  {limitWord(previewModel?.address, 30)}
                </Tooltip>
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.ownerName')}>
                {previewModel?.ownerName}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.description')}>
                {previewModel?.description}
              </Descriptions.Item>

              <Descriptions.Item label={translate('suppliers.status')}>
                {previewModel?.status?.name}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </MasterPreview>
      </Card>
    </div>
  );
}

export default SupplierMaster;
