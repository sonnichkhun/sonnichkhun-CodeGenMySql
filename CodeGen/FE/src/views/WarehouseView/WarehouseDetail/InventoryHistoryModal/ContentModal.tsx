import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import { generalLanguageKeys } from 'config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import { Model } from 'core/models';
import { tableService } from 'services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { InventoryHistory } from 'models/InventoryHistory';
import { InventoryHistoryFilter } from 'models/InventoryHistoryFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import nameof from 'ts-nameof.macro';
import { warehouseService } from '../../WarehouseService';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  list?: T[];

  pagination?: PaginationConfig;

  isSave?: boolean;

  currentItem?: any;

  getList?: (
    inventoryHistoryFilter?: InventoryHistoryFilter,
  ) => Promise<InventoryHistory[]>;

  count?: (inventoryHistoryFilter?: InventoryHistoryFilter) => Promise<number>;
}

function ContentModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    handleClose,
    currentItem,
    getList,
    count,
  } = props;

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    handleSearch,
    total,
  ] = warehouseService.useInventoryHistoryMaster(getList, count, currentItem);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const columns: ColumnProps<InventoryHistory>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 100,
        render: renderMasterIndex<InventoryHistory>(pagination),
      },
      {
        title: translate('warehouses.inventoryHistorys.updateTime'),
        key: nameof(list[0].updateTime),
        dataIndex: nameof(list[0].updateTime),
        render() {
          return formatDateTime(list[0]?.updateTime);
        },
      },
      {
        title: translate('warehouses.inventoryHistorys.oldSaleStock'),
        key: nameof(list[0].oldSaleStock),
        dataIndex: nameof(list[0].oldSaleStock),
      },
      {
        title: translate('warehouses.inventoryHistorys.saleStock'),
        key: nameof(list[0].saleStock),
        dataIndex: nameof(list[0].saleStock),
      },
      {
        title: translate('warehouses.inventoryHistorys.oldAccountingStock'),
        key: nameof(list[0].oldAccountingStock),
        dataIndex: nameof(list[0].oldAccountingStock),
      },
      {
        title: translate('warehouses.inventoryHistorys.accountingStock'),
        key: nameof(list[0].accountingStock),
        dataIndex: nameof(list[0].accountingStock),
      },
      {
        title: translate('warehouses.inventoryHistorys.appUser'),
        key: nameof(list[0].appUser),
        dataIndex: nameof(list[0].appUser),
        render(appUser: AppUser) {
          return appUser?.displayName;
        },
      },
    ];
  }, [list, pagination, translate]);

  const handleChangeFilter = React.useCallback(
    (event) => {
      filter.skip = 0;
      setFilter(
        {
          ...filter,
          updateTime: event,
        });
      handleSearch();
    },
    [filter, setFilter, handleSearch],
  );



  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
      className="modal-content-org"
    >
      <div className="d-flex justify-content-between modal-header">
        <h5 className="d-flex align-items-center">{title}</h5>
        <button
          className="btn btn-outline-primary d-flex align-items-center "
          onClick={handleClose}
        >
          <i className="fa mr-2 fa-times-circle" />
          {translate('general.actions.cancel')}
        </button>
      </div>
      <ModalBody>
        <Form>
          <Row>
            <Col className="pl-1" span={6}>
              <FormItem className="mb-3" labelAlign="left">
                <AdvancedDateFilter
                  filter={filter.updateTime}
                  onChange={handleChangeFilter}
                  className="w-100"
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          key={list[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
    </Modal>
  );
}

export default ContentModal;
