import Card from 'antd/lib/card';
import Descriptions from 'antd/lib/descriptions';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Spin from 'antd/lib/spin';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { formItemLayout } from 'config/ant-design/form';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { FIELD_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Field } from 'models/Field';
import { FieldFilter } from 'models/FieldFilter';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { fieldRepository } from 'views/FieldView/FieldRepository';
import './FieldMaster.scss';

const { Item: FormItem } = Form;

function FieldMaster() {
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
  ] = crudService.useMaster<Field, FieldFilter>(
    Field,
    FieldFilter,
    fieldRepository.count,
    fieldRepository.list,
    fieldRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    FIELD_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<Field>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    fieldRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(fieldRepository.export, filter);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Field>(
    fieldRepository.delete,
    setLoading,
    list,
    setList,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    fieldRepository.bulkDelete,
    setLoading,
  );

  const columns: ColumnProps<Field>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Field>(pagination),
        },

        {
          title: translate('fields.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Field>(nameof(list[0].name), sorter),
        },

        {
          title: translate('fields.type'),
          key: nameof(list[0].type),
          dataIndex: nameof(list[0].type),
          sorter: true,
          sortOrder: getOrderTypeForTable<Field>(nameof(list[0].type), sorter),
        },

        {
          title: translate('fields.isDeleted'),
          key: nameof(list[0].isDeleted),
          dataIndex: nameof(list[0].isDeleted),
          sorter: true,
          sortOrder: getOrderTypeForTable<Field>(
            nameof(list[0].isDeleted),
            sorter,
          ),
        },

        {
          title: translate('fields.menu'),
          key: nameof(list[0].menu),
          dataIndex: nameof(list[0].menu),
          sorter: true,
          sortOrder: getOrderTypeForTable<Field>(nameof(list[0].menu), sorter),
          render(menu: Menu) {
            return menu?.name;
          },
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, field: Field) {
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
                  onClick={handleDelete(field)}
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
      <Card title={translate('fields.master.title')}>
        <Card
          className="head-borderless mb-4"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('fields.name')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.startWith)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('fields.type')}>
                  <AdvancedStringFilter
                    filterType={nameof(filter.type.startWith)}
                    filter={filter.type}
                    onChange={handleFilter(nameof(filter.type))}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('fields.isDeleted')}
                ></FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem className="mb-0" label={translate('fields.menu')}>
                  <AdvancedIdFilter
                    filter={filter.menuId}
                    filterType={nameof(filter.menuId.equal)}
                    value={filter.menuId.equal}
                    onChange={handleFilter(nameof(filter.menuId))}
                    modelFilter={menuFilter}
                    setModelFilter={setMenuFilter}
                    getList={fieldRepository.singleListMenu}
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
              <Descriptions.Item label={translate('fields.id')}>
                {previewModel?.id}
              </Descriptions.Item>

              <Descriptions.Item label={translate('fields.name')}>
                {previewModel?.name}
              </Descriptions.Item>

              <Descriptions.Item label={translate('fields.type')}>
                {previewModel?.type}
              </Descriptions.Item>

              <Descriptions.Item label={translate('fields.isDeleted')}>
                {previewModel?.isDeleted}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </MasterPreview>
      </Card>
    </div>
  );
}

export default FieldMaster;