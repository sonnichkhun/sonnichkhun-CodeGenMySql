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
import { TAX_TYPE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Status } from 'models/Status';
import { TaxType } from 'models/TaxType';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { taxTypeRepository } from 'views/TaxTypeView/TaxTypeRepository';
import './TaxTypeMaster.scss';

const { Item: FormItem } = Form;

function TaxTypeMaster() {
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
  ] = crudService.useMaster<TaxType, TaxTypeFilter>(
    TaxType,
    TaxTypeFilter,
    taxTypeRepository.count,
    taxTypeRepository.list,
    taxTypeRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    TAX_TYPE_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<TaxType>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    taxTypeRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(
    taxTypeRepository.export,
    filter,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    taxTypeRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<TaxType>(
    taxTypeRepository.delete,
    setLoading,
    list,
    setList,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    taxTypeRepository.bulkDelete,
    setLoading,
  );

  const columns: ColumnProps<TaxType>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<TaxType>(pagination),
        },

        {
          title: translate('taxTypes.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<TaxType>(
            nameof(list[0].code),
            sorter,
          ),
        },

        {
          title: translate('taxTypes.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<TaxType>(
            nameof(list[0].name),
            sorter,
          ),
        },

        {
          title: translate('taxTypes.percentage'),
          key: nameof(list[0].percentage),
          dataIndex: nameof(list[0].percentage),
          sorter: true,
          sortOrder: getOrderTypeForTable<TaxType>(
            nameof(list[0].percentage),
            sorter,
          ),
        },

        {
          title: translate('taxTypes.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<TaxType>(
            nameof(list[0].status),
            sorter,
          ),
          render(status: Status) {
            return status?.name;
          },
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, taxType: TaxType) {
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
                  onClick={handleDelete(taxType)}
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
      <Card title={translate('taxTypes.master.title')}>
        <Card
          className="head-borderless mb-4"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('taxTypes.code')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.startWith)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('taxTypes.name')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.startWith)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('taxTypes.percentage')}
                >
                  <AdvancedNumberFilter
                    filterType={nameof(filter.percentage.equal)}
                    filter={filter.percentage}
                    onChange={handleFilter(nameof(filter.percentage))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('taxTypes.status')}>
                  <AdvancedIdFilter
                    filter={filter.statusId}
                    filterType={nameof(filter.statusId.equal)}
                    value={filter.statusId.equal}
                    onChange={handleFilter(nameof(filter.statusId))}
                    list={statusList}
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
              <Descriptions.Item label={translate('taxTypes.id')}>
                {previewModel?.id}
              </Descriptions.Item>

              <Descriptions.Item label={translate('taxTypes.code')}>
                {previewModel?.code}
              </Descriptions.Item>

              <Descriptions.Item label={translate('taxTypes.name')}>
                {previewModel?.name}
              </Descriptions.Item>

              <Descriptions.Item label={translate('taxTypes.percentage')}>
                {previewModel?.percentage}
              </Descriptions.Item>

              <Descriptions.Item label={translate('taxTypes.status')}>
                {previewModel?.status?.name}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </MasterPreview>
      </Card>
    </div>
  );
}

export default TaxTypeMaster;
