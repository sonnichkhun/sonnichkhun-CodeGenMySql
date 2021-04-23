import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import { generalLanguageKeys, generalColumnWidths } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { tableService } from 'services';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import nameof from 'ts-nameof.macro';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { Form, Row, Col, Popconfirm } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import { ItemFilter } from 'models/ItemFilter';
import { Item } from 'models/Item';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { indirectSalesOrderService } from 'views/IndirectSalesOrderView/IndirectSalesOrderService';
import { Product } from 'models/Product';
import './ItemModal.scss';

export interface ContentModalProps<T extends Model> extends ModalProps {

  selectedList?: T[];

  setSelectedList?: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: Item[]) => void;

  total?: number;

  getList?: (itemFilter?: ItemFilter) => Promise<Item[]>;

  count?: (itemFilter?: ItemFilter) => Promise<number>;

  onClose?: () => void;
}

function ItemModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const { toggle, isOpen, onSave, getList, count, onClose } = props;

  // const [filterProduct, setFilterProduct] = React.useState<ProductFilter>(
  //   new ProductFilter(),
  // );
  const [listItem, setListItem] = React.useState<Item[]>([]);
  const [selectedList, setSelectedList] = React.useState<Item[]>([]);


  const [totalItem, setTotal] = React.useState<number>(0);

  const [
    filterItem,
    setFilterItem,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = indirectSalesOrderService.useItemContentMaster(getList, count);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterItem,
    setFilterItem,
    total,
    handleSearch,
  );


  React.useEffect(() => {
    setListItem(list);
    setTotal(totalItem);
    setLoading(false);
    if(isOpen === true) {
      setSelectedList([]);
    }
  }, [setListItem, setTotal, list, setLoading, totalItem, setSelectedList, isOpen]);

  const rowSelection: TableRowSelection<Item> = crudService.useContentModalList<
    Item
  >(selectedList, setSelectedList);

  const handleChangeFilter = React.useCallback(() => {
    filterItem.skip = 0;
    Promise.all([getList(filterItem), count(filterItem)])
      .then(([listItem, totalItem]) => {
        setListItem(listItem);
        setTotal(totalItem);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    getList,
    filterItem,
    count,
    setListItem,
    setTotal,
    handleSearch,
    setLoading,
  ]);

  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);

  const handleReset = React.useCallback(() => {
    const newFilter = new ItemFilter();
    setFilterItem(newFilter);
    setListItem(list);
    handleSearch();
  }, [list, setFilterItem, setListItem, handleSearch]);

  const columns: ColumnProps<Item>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 80,
        render: renderMasterIndex<Item>(pagination),
      },
      {
        title: translate('items.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
      },
      {
        title: translate('items.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        ellipsis: true,
      },
      {
        title: translate('items.productGrouping'),
        key: nameof(list[0].productGrouping),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.productGrouping?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.productType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.supplier'),
        key: nameof(list[0].supplier),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.supplier?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.saleStock'),
        key: nameof(list[0].saleStock),
        dataIndex: nameof(list[0].saleStock),
      },
      {
        title: translate('items.salePrice'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
      },
    ];
  }, [list, pagination, translate]);

  const handleDeleteItem = React.useCallback(
    index => {
      if (index > -1) {
        selectedList.splice(index, 1);
      }
      setSelectedList([...selectedList]);
    },
    [selectedList],
  );

  const columnsSelected: ColumnProps<Item>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 80,
        render: renderMasterIndex<Item>(),
      },
      {
        title: translate('items.code'),
        key: nameof(selectedList[0].code),
        dataIndex: nameof(selectedList[0].code),
      },
      {
        title: translate('items.name'),
        key: nameof(selectedList[0].name),
        dataIndex: nameof(selectedList[0].name),
        ellipsis: true,
      },
      {
        title: translate('items.productGrouping'),
        key: nameof(selectedList[0].productGrouping),
        dataIndex: nameof(selectedList[0].product),
        render(product: Product) {
          return product?.productGrouping?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.productType'),
        key: nameof(selectedList[0].productType),
        dataIndex: nameof(selectedList[0].product),
        render(product: Product) {
          return product?.productType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.supplier'),
        key: nameof(selectedList[0].supplier),
        dataIndex: nameof(selectedList[0].product),
        render(product: Product) {
          return product?.supplier?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.saleStock'),
        key: nameof(selectedList[0].saleStock),
        dataIndex: nameof(selectedList[0].saleStock),
      },
      {
        title: translate('items.salePrice'),
        key: nameof(selectedList[0].salePrice),
        dataIndex: nameof(selectedList[0].salePrice),
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(selectedList[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="d-flex justify-content-center">
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
      },
    ];
  }, [handleDeleteItem, selectedList, translate]);

  return (
    <ModalContent
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      {/* <ModalHeader>{title}</ModalHeader> */}
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
                  label={translate('items.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterItem.code.contain)}
                    filter={filterItem.code}
                    onChange={handleChangeFilter}
                    placeholder={translate('items.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('items.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterItem.name.contain)}
                    filter={filterItem.name}
                    onChange={handleChangeFilter}
                    placeholder={translate('items.placeholder.name')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3">
            <button
              className="btn btn-sm btn-primary mr-2 ml-1"
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
          key={listItem[0]?.id}
          tableLayout="fixed"
          columns={columns}
          dataSource={listItem}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listItem[0].id)}
          onChange={handleTableChange}
          className="ml-3 mr-3"
        />
        <div className="title-table mb-3 mt-3">
          <span className="text-table">{translate('items.selectedTable')}</span>
        </div>
        <Table
          scroll={{ y: 240 }}
          tableLayout="fixed"
          columns={columnsSelected}
          dataSource={selectedList}
          loading={loading}
          rowKey={nameof(selectedList[0].id)}
          pagination={false}
          className="ml-3 mr-3"
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-secondary ml-2"
            onClick={onClose}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
}

export default ItemModal;
