import { Checkbox, Popconfirm, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { ERoute } from 'models/ERoute';
import { ERouteContent } from 'models/ERouteContent';
import { ERouteContentFilter } from 'models/ERouteContentFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteRepository } from 'views/ERouteView/ERouteRepository';
import ERouteContentStoreMappingModal from './ERouteContentStoreMappingModal';
import './ERouteContentTable.scss';

export interface ERouteContentTableProps {
  eRoute: ERoute;
  setERoute: Dispatch<SetStateAction<ERoute>>;
}
function ERouteContentTable(props: ERouteContentTableProps) {
  const { eRoute, setERoute } = props;
  const [translate] = useTranslation();

  const [
    eRouteContents,
    setERouteContents,
    ,
    ,
  ] = crudService.useContentTable<ERoute, ERouteContent>(
    eRoute,
    setERoute,
    nameof(eRoute.eRouteContents),
  );

  const [eRouteContentFilter, setRouteContentFilter] = React.useState<
    ERouteContentFilter
  >(new ERouteContentFilter());

  const [selectedContents, setSelectedContents] = React.useState<
  ERouteContent[]
>([]);

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    eRouteContents,
    eRouteContentFilter,
    setRouteContentFilter,
  );

  const rowSelection: TableRowSelection<ERouteContent> = crudService.useContentModalList<
  ERouteContent
>(selectedContents, setSelectedContents);

  const [
    loadingStore,
    visibleStore,
    setVisibleStore,
    listStore,
    totalStore,
  ] = crudService.useContentModal(
    eRouteRepository.listStore,
    eRouteRepository.countStore,
    StoreFilter,
  );

  const handleGoCreate = React.useCallback(
    () => {
      setVisibleStore(true);
    },
    [setVisibleStore],
  );
  const handleCloseStore = React.useCallback(
    () => {
      setVisibleStore(false);
    },
    [setVisibleStore],
  );

  const handleDeleteItem = React.useCallback(
    index => {
      if (index > -1) {
        eRouteContents.splice(index, 1);
      }
      setERouteContents([...eRouteContents]);
    },
    [eRouteContents, setERouteContents],
  );
  const handleSaveStoreModal = React.useCallback(
    (selectedStores: Store []) => {
      return () => {
        if(eRouteContents) {
          if(eRouteContents.length > 0){
            const contentStoreIds = eRouteContents.map((item: ERouteContent) => item.storeId);
            if(selectedStores && selectedStores.length > 0) {
              const usedStoreIds = selectedStores.map((item: Store) => item.id);
              // add new content by new stores
              selectedStores.forEach((i: Store) => {
                if(!contentStoreIds.includes(i.id)){
                  const content = new ERouteContent();
                  content.store = i;
                  content.storeId = i?.id;
                  eRouteContents.push(content);
                }
              });
              // remove content by removed stores
              const newContents = eRouteContents.filter(content => usedStoreIds.includes(content.storeId));
              setERouteContents([...newContents]);
            }
          }else {
            if(selectedStores && selectedStores.length > 0) {
              selectedStores.forEach((i: Store) => {
                  const content = new ERouteContent();
                  content.store = i;
                  content.storeId = i?.id;
                  eRouteContents.push(content);
              });
              setERouteContents([...eRouteContents]);
            }
          }
        }
        setVisibleStore(false);
      };
    },
    [eRouteContents, setERouteContents, setVisibleStore],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
              content: translate(generalLanguageKeys.delete.content),
              okType: 'danger',
              onOk() {
                if(selectedContents && selectedContents.length > 0){
                  const selectedStoreIds = selectedContents.map((content: ERouteContent) => content.storeId);
                  // const remainContents = eRouteContents.filter((content: ERouteContent) => selectedContents.includes(content));
                  const remainContents = eRouteContents.filter((content: ERouteContent) => {
                    if(selectedStoreIds.includes(content.storeId)){
                      return false;
                    }
                    return true;
                  });
                  setERouteContents([...remainContents]);
                  setSelectedContents([]);
                }
              },
    });
  }, [eRouteContents, selectedContents, setERouteContents, translate]);

  const handleChangeCheckbox = React.useCallback(
    (field, index) => {
      return (ev: CheckboxChangeEvent) => {
        // find content which need modify
        const content = eRouteContents[index];
        // modify value of content field
        content[field] = ev.target?.checked;
        // setList
        setERouteContents([...eRouteContents]);
      };
    },
    [eRouteContents, setERouteContents],
  );

  const [
    handleChangeListSimpleField,
  ] = crudService.useListChangeHandlers<ERouteContent>(
    eRouteContents,
    setERouteContents,
  );

  const columns: ColumnProps<Store>[] = React.useMemo(
    () => {
      return [
        {
          title: '',
          children: [
            {
              title: translate(generalLanguageKeys.columns.index),
              key: nameof(generalLanguageKeys.index),
              width: generalColumnWidths.index,
              render: renderMasterIndex<ERouteContent>(pagination),
            },
            {
              title: translate('eRouteContents.store.code'),
              key: nameof(dataSource[0].store.code),
              dataIndex: nameof(dataSource[0].store),
              width: 150,
              ellipsis: true,
              render(store: Store) {
                return store?.code;
              },
            },
            {
              title: translate('eRouteContents.store.name'),
              key: nameof(dataSource[0].store.name),
              dataIndex: nameof(dataSource[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.name;
              },
            },
            {
              title: translate('eRouteContents.store.address'),
              key: nameof(dataSource[0].store.address),
              dataIndex: nameof(dataSource[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.address;
              },
            },
            {
              title: translate('eRouteContents.orderNumber'),
              key: nameof(dataSource[0].orderNumber),
              dataIndex: nameof(dataSource[0].orderNumber),
              render(...[orderNumber, , index]) {
                return (
                  <>
                    <InputNumber
                      className="form-control form-control-sm"
                      defaultValue={orderNumber}
                      onChange={handleChangeListSimpleField(
                        nameof(orderNumber),
                        index,
                      )}
                    />
                  </>
                );
              },
            },
          ],
        },
        {
          title: translate('eRouteContents.frequency'),
          children: [
            {
              title: translate('eRouteContents.monday'),
              key: nameof(dataSource[0].monday),
              dataIndex: nameof(dataSource[0].monday),
              render(...[monday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={monday}
                    onChange={handleChangeCheckbox(nameof(monday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.tuesday'),
              key: nameof(dataSource[0].tuesday),
              dataIndex: nameof(dataSource[0].tuesday),
              render(...[tuesday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={tuesday}
                    onChange={handleChangeCheckbox(nameof(tuesday), index)}
                  />
                );
              },
            },

            {
              title: translate('eRouteContents.wednesday'),
              key: nameof(dataSource[0].wednesday),
              dataIndex: nameof(dataSource[0].wednesday),
              render(...[wednesday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={wednesday}
                    onChange={handleChangeCheckbox(nameof(wednesday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.thursday'),
              key: nameof(dataSource[0].thursday),
              dataIndex: nameof(dataSource[0].thursday),
              render(...[thursday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={thursday}
                    onChange={handleChangeCheckbox(nameof(thursday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.friday'),
              key: nameof(dataSource[0].friday),
              dataIndex: nameof(dataSource[0].friday),
              render(...[friday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={friday}
                    onChange={handleChangeCheckbox(nameof(friday), index)}
                  />
                );
              },
            },

            {
              title: translate('eRouteContents.saturday'),
              key: nameof(dataSource[0].saturday),
              dataIndex: nameof(dataSource[0].saturday),
              render(...[saturday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={saturday}
                    onChange={handleChangeCheckbox(nameof(saturday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.sunday'),
              key: nameof(dataSource[0].sunday),
              dataIndex: nameof(dataSource[0].sunday),
              render(...[sunday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={sunday}
                    onChange={handleChangeCheckbox(nameof(sunday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.week1'),
              key: nameof(dataSource[0].week1),
              dataIndex: nameof(dataSource[0].week1),
              render(...[week1, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week1}
                    onChange={handleChangeCheckbox(nameof(week1), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.week2'),
              key: nameof(dataSource[0].week2),
              dataIndex: nameof(dataSource[0].week2),
              render(...[week2, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week2}
                    onChange={handleChangeCheckbox(nameof(week2), index)}
                  />
                );
              },
            },

            {
              title: translate('eRouteContents.week3'),
              key: nameof(dataSource[0].week3),
              dataIndex: nameof(dataSource[0].week3),
              render(...[week3, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week3}
                    onChange={handleChangeCheckbox(nameof(week3), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteContents.week4'),
              key: nameof(dataSource[0].week4),
              dataIndex: nameof(dataSource[0].week4),
              render(...[week4, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week4}
                    onChange={handleChangeCheckbox(nameof(week4), index)}
                  />
                );
              },
            },
          ],
        },
        {
          title: '',
          children: [{
            title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(dataSource[0].id),
          width: 50,
          align: 'center',
          render(...[, , index]) {
            return (
              <div>
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={() => handleDeleteItem(index)}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <button className="btn btn-sm btn-link text-danger">
                  <i className="fa fa-trash" />
                </button>
              </Popconfirm>
              </div>
            );
          },
          }],

        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [dataSource, handleChangeCheckbox, handleChangeListSimpleField, handleDeleteItem, pagination, translate],
  );

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        tableLayout="fixed"
        pagination={pagination}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        className="table-content"
        title={() => (
          <>
            <div className="d-flex justify-content-between">
              <div className="flex-shrink-1 d-flex align-items-center">
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleGoCreate}
                >
                  <i className="fa mr-2 fa-plus" />
                  {translate('eRouteContents.create')}
                </button>
                <button
                    className="btn btn-sm btn-danger mr-2"
                    disabled={!selectedContents.length}
                    onClick={handleBulkDelete}
                  >
                    <i className="fa mr-2 fa-trash" />
                    {translate(generalLanguageKeys.actions.delete)}
                  </button>
                </div>
              <div className="flex-shrink-1 d-flex align-items-center mr-4">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total: pagination?.total,
                })}
              </div>
            </div>
          </>
        )}
      />
      <ERouteContentStoreMappingModal
        selectedList={eRouteContents}
        setSelectedList={setERouteContents}
        list={listStore}
        total={totalStore}
        isOpen={visibleStore}
        loading={loadingStore}
        toggle={handleCloseStore}
        onClose={handleCloseStore}
        onSave={handleSaveStoreModal}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        getList={eRouteRepository.listStore}
        count={eRouteRepository.countStore}
      />
    </>
  );
}

export default ERouteContentTable;
