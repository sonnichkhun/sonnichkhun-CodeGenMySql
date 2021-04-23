import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, PaginationConfig, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteService } from 'views/ERouteView/ERouteMaster/ERouteService';
import { eRouteRepository } from 'views/ERouteView/ERouteRepository';
export interface ERouteContentStoreMappingModalIProps<T extends Model> extends ModalProps {

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[]) => () => void;

  currentItem?: any;

  total?: number;

  getList?: (storeFilter?: StoreFilter) => Promise<Store[]>;

  count?: (storeFilter?: StoreFilter) => Promise<number>;

  onClose?: () => void;
}

export default function ERouteContentStoreMappingModal <T extends Model>(
  props: ERouteContentStoreMappingModalIProps<T>,
) {
  const [translate] = useTranslation();
  const {
    toggle,
    isOpen,
    selectedList,
    setSelectedList,
    onSave,
    getList,
    count,
    onClose,
  } = props;

  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [listStore, setListStore] = React.useState<Store[]>([]);
  const [totalStore, setTotal] = React.useState<number>(0);
  const [organizationFilter, setOriganizationFilter] = React.useState<OrganizationFilter> (new OrganizationFilter());
  const [storeTypeFilter, setStoreTypeFiler] = React.useState<StoreTypeFilter> (new StoreTypeFilter());
  const [selectedStores, setSelectedStores] = React.useState<T[]>([]);

  const rowSelection: TableRowSelection<Store> = crudService.useContentModalList<
  T
  >(selectedStores, setSelectedStores);
  const [
    filterStore,
    setFilerStore,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = eRouteService.useStoreContentMaster(getList, count);

  React.useEffect(() => {
    setListStore(list);
    setTotal(totalStore);
    setLoading(false);
  }, [setLoading, list, totalStore]);


  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterStore,
    setFilerStore,
    total,
    handleSearch,
  );

  React.useEffect(() => {
    if(selectedList){
      if(selectedList.length > 0){
        const selected = selectedList.map((item: any) => item?.store);
        setSelectedStores([...selected]);
      } else {
        setSelectedStores([]);
      }
    }
  }, [selectedList, setSelectedList]);
  const handleChangeFilter = React.useCallback(() => {
    filterStore.skip = 0;
    Promise.all([getList(filterStore), count(filterStore)])
      .then(([listStore, totalStore]) => {
        setListStore(listStore);
        setTotal(totalStore);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filterStore, getList, count, handleSearch, setLoading]);

  const handleReset = React.useCallback(() => {
    const newFilter = new StoreFilter();
    setFilerStore(newFilter);
    setListStore(list);
    handleSearch();
  }, [setFilerStore, list, handleSearch, setListStore]);
  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);

  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 60,
        render: renderMasterIndex<Store>(pagination),
      },
      {
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        title: translate('eRouteContents.store.code'),
        render(...[, store]) {
          return store?.code;
        },
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        title: translate('eRouteContents.store.name'),
        ellipsis: true,
        render(...[, store]) {
          return store?.name;
        },
      },
      {
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        title: translate('eRouteContents.store.address'),
        ellipsis: true,
        render(...[, store]) {
          return store?.address;
        },
      },
      {
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        title: translate('eRouteContents.store.organization'),
        render(...[, store]) {
          return store?.organization?.name;
        },
      },
      {
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        title: translate('eRouteContents.store.storeType'),
        render(...[, store]) {
          return store?.storeType?.name;
        },
      },

    ];
  }, [list, pagination, translate]);
  return (
    <Modal
      size="xl"
      unmountOnClose={true}
      backdrop="static"
      toggle={toggle}
      isOpen={isOpen}
    >
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
        <Form>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('eRouteContents.store.code')}
                labelAlign="left"
              >
                <AdvancedStringFilter
                  filterType={nameof(filterStore.code.contain)}
                  filter={filterStore.code}
                  onChange={handleChangeFilter}
                  placeholder={translate('eRouteContents.store.placeholder.code')}
                  className="w-100"
                />
              </FormItem>
            </Col>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('eRouteContents.store.organization')}
                labelAlign="left"
              >
                <AdvancedIdFilter
                    filter={filterStore.organizationId}
                    filterType={nameof(filterStore.organizationId.equal)}
                    value={filterStore.organizationId.equal}
                    onChange={handleChangeFilter}
                    getList={eRouteRepository.singleListOrganization}
                    modelFilter={organizationFilter}
                    setModelFilter={setOriganizationFilter}
                    searchField={nameof(organizationFilter.name)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('eRouteContents.store.placeholder.organization')}
                  />
              </FormItem>
            </Col>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('eRouteContents.store.name')}
                labelAlign="left"
              >
                <AdvancedStringFilter
                  filterType={nameof(filterStore.name.contain)}
                  filter={filterStore.name}
                  onChange={handleChangeFilter}
                  placeholder={translate('eRouteContents.store.placeholder.name')}
                  className="w-100"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('eRouteContents.store.address')}
                labelAlign="left"
              >
                <AdvancedStringFilter
                  filterType={nameof(filterStore.address.contain)}
                  filter={filterStore.address}
                  onChange={handleChangeFilter}
                  placeholder={translate('eRouteContents.store.placeholder.address')}
                  className="w-100"
                />
              </FormItem>
            </Col>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('eRouteContents.store.storeType')}
                labelAlign="left"
              >
                <AdvancedIdFilter
                    filter={filterStore.storeTypeId}
                    filterType={nameof(filterStore.storeTypeId.equal)}
                    value={filterStore.storeTypeId.equal}
                    onChange={handleChangeFilter}
                    getList={eRouteRepository.singleListStoreType}
                    modelFilter={storeTypeFilter}
                    setModelFilter={setStoreTypeFiler}
                    searchField={nameof(setStoreTypeFiler.name)}
                    allowClear={true}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('eRouteContents.store.placeholder.storeType')}
                  />
              </FormItem>
            </Col>
          </Row>
        </Form>
         {/* button area */}
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
           tableLayout="fixed"
           bordered={true}
           columns={columns}
           dataSource={listStore}
           loading={loading}
           rowSelection={rowSelection}
           pagination={pagination}
           rowKey={nameof(listStore[0].id)}
           onChange={handleTableChange}
          />
           <div className=" d-flex justify-content-end">
          <button className="btn btn-sm btn-primary" onClick={onSave(selectedStores)}>
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary ml-2"
            onClick={() => onClose()}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>

      </ModalBody>
    </Modal>
  );
}
