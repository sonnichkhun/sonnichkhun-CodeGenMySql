import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { E_ROUTE_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import { getOrderTypeForTable, renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteFilter } from 'models/ERouteFilter';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { RequestState } from 'models/RequestState';
import { Status } from 'models/Status';
import { StoreFilter } from 'models/StoreFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteRepository } from '../ERouteRepository';
import './ERouteMaster.scss';
import PreviewERoute from './PreviewERoute';

const { Item: FormItem } = Form;

function ERouteMaster() {
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
  ] = crudService.useMaster<ERoute, ERouteFilter>(
    ERoute,
    ERouteFilter,
    eRouteRepository.count,
    eRouteRepository.list,
    eRouteRepository.get,
    );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(E_ROUTE_ROUTE);
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(filter, setFilter, total, handleSearch);
  const [rowSelection, hasSelected] = tableService.useRowSelection<ERoute>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    eRouteRepository.import,
    setLoading,
  );

  /**
   * If export
   */

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------


  const [eRouteTypeList] = crudService.useEnumList<Status>(eRouteRepository.singleListErouteType);


  // Reference  -------------------------------------------------------------------------------------------------------------------------------------


    const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<ERouteTypeFilter>(new ERouteTypeFilter());

  //  const [requestStateFilter, setRequestStateFilter] = React.useState<RequestStateFilter>(new RequestStateFilter());

  const [saleEmployeeFilter, setSaleEmployeeFilter] = React.useState<AppUserFilter>(new AppUserFilter());

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(new StoreFilter());
   // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<ERoute>(
    eRouteRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    eRouteRepository.bulkDelete,
    setLoading,
    handleSearch,
  );

  const columns: ColumnProps<ERoute>[] = React.useMemo(
    () => {
      return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ERoute>(pagination),
      },
      {
        title: translate('eRoutes.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].code),
          sorter,
        ),
      },
      {
        title: translate('eRoutes.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].name),
          sorter,
        ),
      },
      {
        title: translate('eRoutes.saleEmployee'),
        key: nameof(list[0].saleEmployee),
        dataIndex: nameof(list[0].saleEmployee),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].saleEmployee),
          sorter,
        ),
        render(saleEmployee: AppUser) {
          return saleEmployee?.displayName;
        },
      },

      {
        title: translate('eRoutes.startDate'),
        key: nameof(list[0].startDate),
        dataIndex: nameof(list[0].startDate),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].startDate),
          sorter,
        ),
        render(...[, route]){
          const dateTime = `${formatDate(route?.startDate)} - ${formatDate(route?.endDate)}`;
          return dateTime;
        },
      },
      {
        title: translate('eRoutes.eRouteType'),
        key: nameof(list[0].eRouteType),
        dataIndex: nameof(list[0].eRouteType),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].eRouteType),
          sorter,
        ),
        render(eRouteType: ERouteType) {
          return eRouteType?.name;
        },
      },
      {
        title: translate('eRoutes.requestState'),
        key: nameof(list[0].requestState),
        dataIndex: nameof(list[0].requestState),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].requestState),
          sorter,
        ),
        render(requestState: RequestState) {
          return (
            <>
            {requestState.id === 1 &&(<span className="new-state w-100">{requestState?.name}</span>)}
            {requestState.id === 2 &&(<span className="pending-state">{requestState?.name}</span>)}
            {requestState.id === 3 &&(<span className="approved-state">{requestState?.name}</span>)}
            {requestState.id === 4 &&(<span className="rejected-state">{requestState?.name}</span>)}
            </>
          );
        },
      },
      {
        title: translate('eRoutes.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        align: 'center',
        sortOrder: getOrderTypeForTable<ERoute>(
          nameof(list[0].status),
          sorter,
        ),
        render(status: Status) {
          return (
            <div className={status.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, eRoute: ERoute) {
          return (
            <div className="d-flex justify-content-center">
              {
                (eRoute?.requestStateId  === 1) && (
                  <button className="btn btn-sm btn-link text-danger"
                  // onClick={handleApprove}
                >
                  <i className="fa fa-exchange"></i>
                </button>
                )
              }
               {
                (eRoute?.requestStateId  === 4) && (
                  <button
                  className="btn btn-sm btn-link text-danger"
                  // onClick={handleApprove}
                >
                  <i className="fa fa-exchange"></i>
                </button>
                )
              }
              {
                eRoute.requestStateId === 3 && (
                  <button className="btn btn-sm btn-link text-danger"
                // onClick={handleEditApproved}
                >
                <i className="fa fa-pencil"/>
                </button>
                )
              }
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={handleOpenPreview(id)}
              >
                <i className="fa fa-eye" />
              </button>
              {
                eRoute.requestStateId === 1 && (
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleGoDetail(id)}
                  >
                    <i className="fa fa-edit" />
                  </button>
                )
              }
              {
                eRoute.requestStateId === 1 &&(
                <button
                className="btn btn-sm btn-link text-danger"
                  onClick={handleDelete(eRoute)}
                >
                  <i className="fa fa-trash" />
                </button>
                )}

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
      translate],
  );
  return (
    <div className="page master-page">
      <Card title={translate('eRoutes.master.title')} className="header-title">
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.code')}
                  labelAlign="left"
                >
                    <AdvancedStringFilter
                      filterType={nameof(filter.code.contain)}
                      filter={filter.code }
                      onChange={handleFilter(nameof(filter.code))}
                      className="w-100"
                    />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.name')}
                  labelAlign="left"
                >
                    <AdvancedStringFilter
                      filterType={nameof(filter.name.contain)}
                      filter={filter.name }
                      onChange={handleFilter(nameof(filter.name))}
                      className="w-100"
                    />


                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.saleEmployee')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.saleEmployeeId}
                    filterType={nameof(filter.saleEmployeeId.equal)}
                    value={filter.saleEmployeeId.equal}
                    onChange={handleFilter(nameof(filter.saleEmployeeId))}
                    modelFilter={ saleEmployeeFilter }
                    setModelFilter={ setSaleEmployeeFilter }
                    getList={ eRouteRepository.filterListAppUser }
                    searchField={nameof(saleEmployeeFilter.displayName)}
                    searchType={nameof(saleEmployeeFilter.displayName.contain)}
                    placeholder={translate('eRoutes.placeholder.saleEmployee')}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.store')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.storeId}
                    filterType={nameof(filter.storeId.equal)}
                    value={filter.storeId.equal}
                    onChange={handleFilter(nameof(filter.storeId))}
                    modelFilter={ storeFilter }
                    setModelFilter={ setStoreFilter }
                    getList={ eRouteRepository.filterListStore }
                    searchField={nameof(storeFilter.name)}
                    searchType={nameof(storeFilter.name.contain)}
                    placeholder={translate('eRoutes.placeholder.store')}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}

                  />
                </FormItem>
              </Col>
              </Row>
              <Row>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.startDate')}
                  labelAlign="left"
                >
                  <div className="d-flex justify-content-start mt-1">
                    <AdvancedDateFilter
                      filterType={nameof(filter.startDate.equal)}
                      filter={ filter.startDate }
                      onChange={handleFilter(nameof(filter.startDate))}
                      className="w-100 mr-1"
                    />
                    <AdvancedDateFilter
                      filterType={nameof(filter.endDate.equal)}
                      filter={ filter.endDate }
                      onChange={handleFilter(nameof(filter.endDate))}
                      className="w-100 ml-1"
                    />
                     </div>
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('eRoutes.eRouteType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.eRouteTypeId}
                    filterType={nameof(filter.eRouteTypeId.equal)}
                    value={filter.eRouteTypeId.equal}
                    onChange={handleFilter(nameof(filter.eRouteTypeId))}
                    getList={eRouteRepository.singleListErouteType}
                    modelFilter={eRouteTypeFilter}
                    setModelFilter={setERouteTypeFilter}
                    searchField={nameof(eRouteTypeFilter.name)}
                    searchType={nameof(eRouteTypeFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    list={eRouteTypeList}
                  />
                </FormItem>
              </Col>

            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleSearch}
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
                  {/* <label
                    className="btn btn-sm btn-outline-primary mr-2 mb-0"
                    htmlFor="master-import"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19.085"
                      height="12.893"
                      viewBox="0 0 19.085 12.893"
                    >
                      <path
                        fill="#ee534d"
                        className="a"
                        d="M535.168,262.972a7.2,7.2,0,0,0-.208-1.031c-.045-.165-.1-.326-.151-.488-.026-.076-.053-.153-.081-.227-.014-.039-.03-.076-.044-.112a.585.585,0,0,0-.024-.06c0-.007-.007-.014-.012-.027a5.973,5.973,0,0,0-.471-.876,4.3,4.3,0,0,0-.59-.727c-.11-.114-.227-.22-.348-.323-.03-.027-.06-.05-.092-.075l-.014-.011c-.005-.005-.015-.012-.028-.021-.073-.055-.151-.106-.226-.156a3.7,3.7,0,0,0-.417-.234,3.93,3.93,0,0,0-.467-.2,5.3,5.3,0,0,0-1.048-.295l-.02,0-.083-.01c-.073-.007-.145-.009-.217-.013-.136-.006-.263-.018-.4-.035a.417.417,0,0,1-.407-.412v-1.281c-.637.482-1.269.952-1.9,1.427-.664.5-1.329,1-1.99,1.507l3.9,2.895c-.012-.471-.021-.942-.032-1.412a.41.41,0,0,1,.3-.4,4.4,4.4,0,0,1,.983-.092,3.732,3.732,0,0,1,1.023.183,5.044,5.044,0,0,1,1.708,1.025,8.236,8.236,0,0,1,1.294,1.483c.02.028.042.057.06.086C535.174,263.031,535.172,263,535.168,262.972Z"
                        transform="translate(-516.091 -255.372)"
                      />
                      <path
                        fill="#ee534d"
                        className="a"
                        d="M77.237,220.837a1.374,1.374,0,0,1-1.373,1.356H67.611a1.377,1.377,0,0,1-1.377-1.376v-8.252a1.377,1.377,0,0,1,1.377-1.376h8.252a1.349,1.349,0,0,1,1.055.528c.329-.249.662-.5.994-.749a1.605,1.605,0,0,0-1.34-.723H66.9a1.613,1.613,0,0,0-1.613,1.611v9.67a1.613,1.613,0,0,0,1.613,1.611h9.669a1.61,1.61,0,0,0,1.609-1.588v-3.891l-.944-.7v3.88Z"
                        transform="translate(-65.29 -210.244)"
                      />
                      <path
                        fill="#ee534d"
                        className="a"
                        d="M254.106,395.7l-.838,1.242-.839-1.242h-1.646l1.646,2.485-1.646,2.485h1.646l.839-1.243.838,1.243h1.647l-1.647-2.485s1.646-2.472,1.661-2.485Z"
                        transform="translate(-246.821 -391.735)"
                      />
                    </svg>
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19.125"
                      height="13.247"
                      viewBox="0 0 19.125 13.247"
                    >
                      <path
                        className="a"
                        fill="#ee534d"
                        d="M84.416,206.816c-.679-.519-1.362-1.032-2.045-1.547-.647-.488-1.3-.971-1.951-1.467v1.315a.429.429,0,0,1-.418.424c-.141.016-.272.029-.412.035-.074,0-.147.007-.223.014l-.085.01-.022,0a5.54,5.54,0,0,0-1.077.3,4.176,4.176,0,0,0-.479.205,3.927,3.927,0,0,0-.428.24c-.078.052-.157.1-.232.162a.26.26,0,0,0-.028.022l-.015.011c-.032.026-.063.05-.095.078-.123.1-.244.214-.358.331a4.448,4.448,0,0,0-.605.747,6.186,6.186,0,0,0-.486.9c0,.012-.009.02-.011.027a.606.606,0,0,0-.025.061c-.016.037-.031.075-.046.114-.028.077-.057.155-.083.234-.057.165-.11.331-.156.5a7.615,7.615,0,0,0-.214,1.06c0,.031-.005.061-.007.09.019-.029.04-.059.062-.089a8.52,8.52,0,0,1,1.329-1.523,5.209,5.209,0,0,1,1.755-1.053,3.846,3.846,0,0,1,1.052-.187,4.582,4.582,0,0,1,1.01.094.421.421,0,0,1,.312.409c-.012.485-.022.968-.033,1.452Q82.411,208.3,84.416,206.816Zm-6.851,1.991v4.674a1.412,1.412,0,0,1-1.411,1.393H67.675a1.415,1.415,0,0,1-1.415-1.414v-8.479a1.415,1.415,0,0,1,1.415-1.414h8.479a1.411,1.411,0,0,1,1.411,1.393v.621c.123-.052.245-.1.4-.161.186-.07.377-.129.567-.191v-1a1.654,1.654,0,0,0-1.653-1.632H66.948a1.658,1.658,0,0,0-1.657,1.656v9.935a1.658,1.658,0,0,0,1.657,1.656h9.934a1.655,1.655,0,0,0,1.653-1.632v-5.682a6.03,6.03,0,0,0-.754.19C77.708,208.744,77.638,208.779,77.565,208.807Zm-4.789-2.139-.862,1.276-.861-1.276H69.362l1.692,2.553-1.692,2.553h1.692l.861-1.277.862,1.277h1.691l-.326-.492-.675-.983c0-.007-.69-1.078-.69-1.078l1.691-2.553Z"
                        transform="translate(-65.291 -202.597)"
                      />
                    </svg>
                    {translate(generalLanguageKeys.actions.export)}
                  </button> */}
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
        <PreviewERoute
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose= {handleClosePreview}
          previewLoading={previewLoading}
          />
      </Card>
      </div>
  );
}

export default ERouteMaster;