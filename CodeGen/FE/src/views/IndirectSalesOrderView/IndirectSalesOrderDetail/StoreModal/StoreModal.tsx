import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection, RowSelectionType } from 'antd/lib/table';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { tableService } from 'services';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import nameof from 'ts-nameof.macro';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { Form, Row, Col } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { indirectSalesOrderService } from 'views/IndirectSalesOrderView/IndirectSalesOrderService';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreType } from 'models/StoreType';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  selectedList?: T[];

  setSelectedList?: Dispatch<SetStateAction<T[]>>;

  list?: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  onSave?: (selectedList: T[]) => void;

  currentItem?: any;

  total?: number;

  getList?: (storetFilter?: StoreFilter) => Promise<Store[]>;

  count?: (storeFilter?: StoreFilter) => Promise<number>;

  onClose?: (currentItem) => void;
}

function StoreModal<T extends Model>(
  props: ContentModalProps<T>,
) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    getList,
    count,
    onClose,
  } = props;

  const [listStore, setListStore] = React.useState<Store[]>([]);

  const [totalStore, setTotal] = React.useState<number>(0);

  const [
    filterStore,
    setFilterStore,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = indirectSalesOrderService.useStoreContentMaster(getList, count);


  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterStore,
    setFilterStore,
    total,
    handleSearch,
  );
  React.useEffect(() => {
    setListStore(list);
    setTotal(totalStore);
    setLoading(false);

  }, [
    setListStore,
    setTotal,
    list,
    setLoading,
    totalStore,
  ]);

  const rowSelectionType: RowSelectionType = 'radio';

  const rowSelection: TableRowSelection<Store> = {
    type: rowSelectionType,
    selectedRowKeys: selectedList?.map((t: T) => t.id),
    onSelect: (record: T, selected: boolean) => {
      if (selected) {
        const selectedItem = [record];
        setSelectedList(selectedItem);
      }
    },
  };

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
  }, [
    getList,
    filterStore,
    count,
    setListStore,
    setTotal,
    handleSearch,
    setLoading,
  ]);

  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  },
    [handleChangeFilter]);

  const handleReset = React.useCallback(() => {
    const newFilter = new StoreFilter();
    setFilterStore(newFilter);
    setListStore(list);
    handleSearch();
  }, [
    list,
    setFilterStore,
    setListStore,
    handleSearch,
  ]);

  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 180,
        render: renderMasterIndex<Store>(pagination),
      },
      {
        title: translate('stores.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
      },
      {
        title: translate('stores.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
      },
      {
        title: translate('stores.address'),
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
      },
      {
        title: translate('stores.telephone'),
        key: nameof(list[0].telephone),
        dataIndex: nameof(list[0].telephone),
      },
      {
        title: translate('stores.storeGrouping'),
        key: nameof(list[0].storeGrouping),
        dataIndex: nameof(list[0].storeGrouping),
        render(storeGrouping: StoreGrouping) {
          return storeGrouping?.name;
        },
      },
      {
        title: translate('stores.storeType'),
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        render(storeType: StoreType) {
          return storeType?.name;
        },
      },

    ];
  }, [list, pagination, translate]);




  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.code.contain)}
                    filter={filterStore.code}
                    onChange={handleChangeFilter}
                    placeholder={translate('stores.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.name.contain)}
                    filter={filterStore.name}
                    onChange={handleChangeFilter}
                    placeholder={translate('stores.placeholder.name')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3">
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
                  d="M47.434,46.7c0-.009,0-.018,0-.047,0-.008,0-.017-.007-.046,0-.007,0-.014-.011-.045l-.016-.044-.02-.042-.025-.043-5.088-7.61H55.313L50.49,46.039h1.086l4.956-7.413,0,0,.014-.023.009-.016.011-.024.008-.018.008-.023c0-.007,0-.013.007-.02s0-.014.005-.021,0-.016.006-.024,0-.013,0-.019,0-.018,0-.027,0-.012,0-.019,0-.019,0-.028,0,0,0-.005,0-.01,0-.015,0-.017,0-.025,0-.016,0-.024,0-.014,0-.021,0-.017-.005-.026l0-.018c0-.009-.005-.017-.008-.025a.341.341,0,0,0-.016-.041l-.009-.019-.01-.02-.012-.02-.011-.017-.014-.02-.013-.016-.015-.018-.016-.016L56.458,38l-.021-.018-.009-.008,0,0-.025-.017-.013-.009-.023-.012-.017-.009-.019-.008L56.3,37.9l-.014,0-.029-.008-.011,0-.033-.005h-.01l-.034,0H41.483l-.037,0a.422.422,0,0,0-.3.085.489.489,0,0,0-.1.656l5.5,6.23v6.562c0,.01,0,.02,0,.03s0,.012,0,.018,0,.017,0,.026l0,.022.005.021.007.026.006.017c0,.009.007.019.011.028l0,.005.009.018.005.011c.006.012.013.024.02.035l0,.006.02.029,0,.006a.457.457,0,0,0,.057.06l0,0a.447.447,0,0,0,.06.043l.01.006a.38.38,0,0,0,.048.023l.018.007a.447.447,0,0,0,.05.015l.014,0,.026,0,.014,0,.038,0h0a.434.434,0,0,0,.085-.009h.006l.035-.01.01,0,.031-.012.012-.005.007,0,1.175-.575V52.228l-.917.449V46.7Zm9.53.159-.615-.613-3.074,3.064L50.2,46.247l-.615.613,3.074,3.064-3.074,3.064.615.613,3.074-3.064L56.349,53.6l.615-.613L53.89,49.925Z"
                  transform="translate(-40.964 -37.883)"
                />
              </svg>
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>

        <Table
          key={listStore[0]?.id}
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
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onSave(selectedList)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary ml-2"
            onClick={() => onClose(currentItem)}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default StoreModal;
