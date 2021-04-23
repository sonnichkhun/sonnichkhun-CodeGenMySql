import Card from 'antd/lib/card';
import Descriptions from 'antd/lib/descriptions';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Spin from 'antd/lib/spin';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { wardRepository } from 'views/WardView/WardRepository';
import { WardDetail } from '../WardView';
import './WardMaster.scss';

const { Item: FormItem } = Form;

function WardMaster() {
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
    setLoadList,
  ] = crudService.useMaster<Ward, WardFilter>(
    Ward,
    WardFilter,
    wardRepository.count,
    wardRepository.list,
    wardRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<Ward>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    wardRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(wardRepository.export, filter);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Ward>(
    wardRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    wardRepository.bulkDelete,
    setLoading,
    handleSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const handleGoDetail = React.useCallback(
    (ward: Ward) => {
      setCurrentItem(ward);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );
  const columns: ColumnProps<Ward>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Ward>(pagination),
        },
        {
          title: translate('wards.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(nameof(list[0].code), sorter),
        },
        {
          title: translate('wards.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(nameof(list[0].name), sorter),
        },

        {
          title: translate('wards.priority'),
          key: nameof(list[0].priority),
          dataIndex: nameof(list[0].priority),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(
            nameof(list[0].priority),
            sorter,
          ),
        },

        {
          title: translate('wards.district'),
          key: nameof(list[0].district),
          dataIndex: nameof(list[0].district),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(
            nameof(list[0].district),
            sorter,
          ),
          render(district: District) {
            return district?.name;
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, ward: Ward) {
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
                  onClick={() => handleGoDetail(ward)}
                >
                  <i className="fa fa-edit" />
                </button>
                <button
                  className="btn btn-sm btn-link text-danger"
                  onClick={handleDelete(ward)}
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
  const handleCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);
  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  return (
    <div className="page master-page">
      <Card title={translate('wards.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('wards.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('wards.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('wards.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('wards.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('wards.priority')}
                  labelAlign="left"
                >
                  <AdvancedNumberFilter
                    filterType={nameof(filter.priority.equal)}
                    filter={filter.priority}
                    onChange={handleFilter(nameof(filter.priority))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('wards.placeholder.priority')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('wards.district')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.districtId}
                    filterType={nameof(filter.districtId.equal)}
                    value={filter.districtId.equal}
                    onChange={handleFilter(nameof(filter.districtId))}
                    modelFilter={districtFilter}
                    setModelFilter={setDistrictFilter}
                    getList={wardRepository.singleListDistrict}
                    placeholder={translate('districts.placeholder.district')}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
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
                    onClick={handleCreate}
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
          code={previewModel.code}
        >
          <Spin spinning={previewLoading}>
            <Descriptions column={4}>
              <Descriptions.Item label={translate('wards.code')}>
                {previewModel?.code}
              </Descriptions.Item>

              <Descriptions.Item label={translate('wards.name')}>
                {previewModel?.name}
              </Descriptions.Item>

              <Descriptions.Item label={translate('wards.priority')}>
                {previewModel?.priority}
              </Descriptions.Item>
              <Descriptions.Item label={translate('wards.district')}>
                {previewModel?.district && previewModel.district.name}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </MasterPreview>
      </Card>
      {visible === true && (
        <WardDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListWard={wardRepository.list}
          setListWard={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default WardMaster;
