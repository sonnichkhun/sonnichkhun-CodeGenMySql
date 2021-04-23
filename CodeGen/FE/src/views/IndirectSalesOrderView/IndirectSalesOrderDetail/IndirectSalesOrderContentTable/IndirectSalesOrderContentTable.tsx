import React, { Dispatch, SetStateAction } from 'react';
import { ContentTableProps } from 'react3l';
import { crudService, formService } from 'core/services';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import { tableService } from 'services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import Form from 'antd/lib/form';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import './IndirectSalesOrderContentTable.scss';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderContentFilter } from 'models/IndirectSalesOrderContentFilter';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { Item } from 'models/Item';
import ItemModal from '../ItemModal/ItemModal';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { formatNumber } from 'helpers/number-format';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import InputNumber from 'components/InputNumber/InputNumber';
import { indirectSalesOrderService } from 'views/IndirectSalesOrderView/IndirectSalesOrderService';
import { Modal, Popconfirm } from 'antd';

const { Item: FormItem } = Form;

export interface IndirectSalesOrderContentTableProps
  extends ContentTableProps<IndirectSalesOrder, IndirectSalesOrderContent> {
  filter?: UnitOfMeasureFilter;
  indirectSalesOrder?: IndirectSalesOrder;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  setCalculateTotal?: Dispatch<SetStateAction<boolean>>;
}

function IndirectSalesOrderContentTable(
  props: IndirectSalesOrderContentTableProps,
) {
  const [translate] = useTranslation();

  const { model, setModel, setCalculateTotal } = props;

  const [
    indirectSalesOrderContents,
    setIndirectSalesOrderContents,
    ,
    handleDelete,
  ] = crudService.useContentTable<
    IndirectSalesOrder,
    IndirectSalesOrderContent
  >(model, setModel, nameof(model.indirectSalesOrderContents));

  const [
    indirectSalesOrderContentFilter,
    setIndirectSalesOrderContentFilter,
  ] = React.useState<IndirectSalesOrderContentFilter>(
    new IndirectSalesOrderContentFilter(),
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    indirectSalesOrderContents,
    indirectSalesOrderContentFilter,
    setIndirectSalesOrderContentFilter,
  );

  const [
    loadingItem,
    visibleItem,
    setVisibleItem,
    listItem,
    totalItem,
  ] = indirectSalesOrderService.useItemModal(
    indirectSalesOrderRepository.listItem,
    indirectSalesOrderRepository.countItem,
    model,
  );

  const [selectedContents, setSelectedContents] = React.useState<
    IndirectSalesOrderContent[]
  >([]);

  const rowSelection: TableRowSelection<IndirectSalesOrderContent> = crudService.useContentModalList<
    IndirectSalesOrderContent
  >(selectedContents, setSelectedContents);
  const [listItemSelected, setListItem] = React.useState<Item[]>([]);
  const [currentItem] = React.useState<any>(null);

  const [
    unitOfMeasureFilter,
    setUnitOfMeasureFilter,
  ] = React.useState<UnitOfMeasureFilter>(new UnitOfMeasureFilter());

  const calculateTotal = React.useMemo(() => {
    return (quantity: number, salePrice: number, disCount: number) => {
      return Math.floor(
        Number(quantity * salePrice * ((100 - disCount) / 100)),
      );
    };
  }, []);

  const defaultUOMList = React.useMemo(() => {
    return (content: IndirectSalesOrderContent) => {
      const unit = content.unitOfMeasure;
      if (unit) {
        return [unit];
      }
      return [];
    };
  }, []);

  const handleChangeUOMInContent = React.useCallback(
    (...[, index]) => {
      return (id: number | string | null, t: UnitOfMeasure) => {
        const newSalePrice =
          indirectSalesOrderContents[index]?.item?.salePrice * t?.factor;
        const total = calculateTotal(
          indirectSalesOrderContents[index].quantity,
          newSalePrice,
          indirectSalesOrderContents[index].discountPercentage,
        );
        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          unitOfMeasure: t,
          unitOfMeasureId: +id,
          salePrice: newSalePrice,
          amount: total,
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      setCalculateTotal,
      indirectSalesOrderContents,
      calculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangeQuantity = React.useCallback(
    index => {
      return event => {
        if (
          indirectSalesOrderContents[index] &&
          indirectSalesOrderContents[index].unitOfMeasure
        ) {
          const requestedQuantitys = Number(
            Number(event) *
              indirectSalesOrderContents[index].unitOfMeasure.factor,
          );
          const total = calculateTotal(
            Number(event),
            indirectSalesOrderContents[index].salePrice,
            indirectSalesOrderContents[index].discountPercentage,
          );
          indirectSalesOrderContents[index] = {
            ...indirectSalesOrderContents[index],
            quantity: Number(event),
            requestedQuantity: requestedQuantitys,
            amount: total,
          };
        }
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      indirectSalesOrderContents,
      setCalculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangeDiscountPercentage = React.useCallback(
    index => {
      return event => {
        const total = calculateTotal(
          indirectSalesOrderContents[index].quantity,
          indirectSalesOrderContents[index].salePrice,
          Number(event),
        );
        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          discountPercentage: Number(event),
          amount: Number(total),
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      indirectSalesOrderContents,
      setCalculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangeSalePrice = React.useCallback(
    index => {
      return event => {
        const total = calculateTotal(
          indirectSalesOrderContents[index].quantity,
          Number(event),
          indirectSalesOrderContents[index].discountPercentage,
        );
        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          salePrice: Number(event),
          amount: Number(total),
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      indirectSalesOrderContents,
      setCalculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),
      okType: 'danger',
      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: IndirectSalesOrderContent) => content.itemId,
          );
          const remainContents = indirectSalesOrderContents.filter(
            (content: IndirectSalesOrderContent) => {
              if (selectedStoreIds.includes(content.itemId)) {
                return false;
              }
              return true;
            },
          );
          setIndirectSalesOrderContents([...remainContents]);
          setSelectedContents([]);
        }
      },
    });
  }, [
    indirectSalesOrderContents,
    selectedContents,
    setIndirectSalesOrderContents,
    translate,
  ]);

  const columns: ColumnProps<IndirectSalesOrderContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<IndirectSalesOrderContent>(pagination),
      },
      {
        title: translate('indirectSalesOrderContents.items.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('indirectSalesOrderContents.items.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.primaryUnitOfMeasure'),
        key: nameof(dataSource[0].primaryUnitOfMeasure),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.product?.unitOfMeasure?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.unitPrice'),
        key: nameof(dataSource[0].unitPrice),
        dataIndex: nameof(dataSource[0].item),
        ellipsis: true,
        render(item: Item) {
          return formatNumber(item?.salePrice);
        },
      },
      {
        title: translate('indirectSalesOrderContents.unitOfMeasure'),
        key: nameof(dataSource[0].unitOfMeasure),
        dataIndex: nameof(dataSource[0].unitOfMeasure),
        align: 'center',
        width: 200,
        render(
          unitOfMeasure: UnitOfMeasure,
          content: IndirectSalesOrderContent,
          index: number,
        ) {
          const defaultFilter = unitOfMeasureFilter;
          defaultFilter.unitOfMeasureGroupingId.equal =
            content.item?.product.unitOfMeasureGroupingId;
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                IndirectSalesOrderContent
              >(content.errors, nameof(content.unitOfMeasure))}
              help={content.errors?.unitOfMeasure}
            >
              <SelectAutoComplete
                value={content.unitOfMeasure?.id}
                onChange={handleChangeUOMInContent(unitOfMeasure, index)}
                getList={indirectSalesOrderRepository.singleListUnitOfMeasure}
                list={defaultUOMList(content)}
                modelFilter={defaultFilter}
                setModelFilter={setUnitOfMeasureFilter}
                searchField={nameof(unitOfMeasureFilter.name)}
                searchType={nameof(unitOfMeasureFilter.name.contain)}
                placeholder={translate(
                  'indirectSalesOrderContents.placeholder.unitOfMeasure',
                )}
                allowClear={false}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('indirectSalesOrderContents.quantity'),
        key: nameof(dataSource[0].quantity),
        dataIndex: nameof(dataSource[0].quantity),
        align: 'center',
        render(
          quantity: any,
          indirectSalesOrderContent: IndirectSalesOrderContent,
          index,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                IndirectSalesOrderContent
              >(
                indirectSalesOrderContent.errors,
                nameof(indirectSalesOrderContent.quantity),
              )}
              help={indirectSalesOrderContent.errors?.quantity}
            >
              <InputNumber
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(quantity)}
                defaultValue={quantity}
                onChange={handleChangeQuantity(index)}
                disabled={
                  indirectSalesOrderContent?.unitOfMeasure?.id
                    ? false
                    : true
                }
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('indirectSalesOrderContents.requestedQuantity'),
        key: nameof(dataSource[0].requestedQuantity),
        dataIndex: nameof(dataSource[0].requestedQuantity),
      },
      {
        title: translate('indirectSalesOrderContents.salePrice'),
        key: nameof(dataSource[0].salePrice),
        dataIndex: nameof(dataSource[0].salePrice),
        width: 200,
        align: 'center',
        render(
          salePrice: any,
          indirectSalesOrderContent: IndirectSalesOrderContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                IndirectSalesOrderContent
              >(
                indirectSalesOrderContent.errors,
                nameof(indirectSalesOrderContent.salePrice),
              )}
              help={indirectSalesOrderContent.errors?.salePrice}
            >
              <InputNumber
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(salePrice)}
                value={salePrice}
                onChange={handleChangeSalePrice(index)}
                disabled={
                  model?.editedPriceStatusId === 1 &&
                  indirectSalesOrderContent?.unitOfMeasure?.id
                    ? false
                    : true
                }
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('indirectSalesOrderContents.discountPercentage'),
        key: nameof(dataSource[0].discountPercentage),
        dataIndex: nameof(dataSource[0].discountPercentage),
        align: 'center',
        render(
          discountPercentage: any,
          indirectSalesOrderContent: IndirectSalesOrderContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                IndirectSalesOrderContent
              >(
                indirectSalesOrderContent.errors,
                nameof(indirectSalesOrderContent.discountPercentage),
              )}
              help={indirectSalesOrderContent.errors?.discountPercentage}
            >
              <InputNumber
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(discountPercentage)}
                defaultValue={discountPercentage}
                onChange={handleChangeDiscountPercentage(index)}
                disabled={
                  indirectSalesOrderContent?.unitOfMeasure?.id
                    ? false
                    : true
                }
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('indirectSalesOrderContents.taxPercentage'),
        key: nameof(dataSource[0].taxPercentage),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return formatNumber(item?.product?.taxType?.percentage);
        },
      },
      {
        title: translate('indirectSalesOrderContents.amount'),
        key: nameof(dataSource[0].amount),
        dataIndex: nameof(dataSource[0].amount),
        render(...[amount]) {
          return formatNumber(amount);
        },
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(
          ...params: [
            IndirectSalesOrderContent,
            IndirectSalesOrderContent,
            number,
          ]
        ) {
          return (
            <>
              <Popconfirm
                placement="left"
                title={translate('general.delete.content')}
                onConfirm={handleDelete(params[2])}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <button className="btn btn-link mr-2">
                  <i className="fa fa-trash text-danger" />
                </button>
              </Popconfirm>
            </>
          );
        },
      },
    ],
    [dataSource, defaultUOMList, handleChangeDiscountPercentage, handleChangeQuantity, handleChangeSalePrice, handleChangeUOMInContent, handleDelete, model, pagination, translate, unitOfMeasureFilter],
  );

  const handleGoCreate = React.useCallback(() => {
    setVisibleItem(true);
  }, [setVisibleItem]);

  const handleCloseItem = React.useCallback(() => {
    setVisibleItem(false);
  }, [setVisibleItem]);

  const handleSaveItemModal = React.useCallback(
    listItem => {
      if (listItem && listItem.length > 0) {
        const contents = listItem.map((item: Item) => {
          const content = new IndirectSalesOrderContent();
          content.item = item;
          content.itemId = item?.id;
          // Tính Giá bán: salePrice
          //  content.salePrice = content
          return content;
        });
        setIndirectSalesOrderContents([
          ...indirectSalesOrderContents,
          ...contents,
        ]);
      }
      setVisibleItem(false);
    },
    [indirectSalesOrderContents, setIndirectSalesOrderContents, setVisibleItem],
  );

  return (
    <>
      <Table
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        rowSelection={rowSelection}
        className="table-content-item"
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
                  disabled={!selectedContents.length}
                  onClick={handleBulkDelete}
                >
                  <i className="fa mr-2 fa-trash" />
                  {translate(generalLanguageKeys.actions.delete)}
                </button>
                <label
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
                  // onClick={handleExport}
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
                </button>
                <button
                  className="btn btn-sm btn-export-template mr-2"
                  // onClick={handleExportTemplate}
                >
                  <i className="fa mr-2 fa-download" />
                  {translate(generalLanguageKeys.actions.exportTemplate)}
                </button>
              </div>
            </div>
          </>
        )}
      />
      <ItemModal
        title={translate('indirectSalesOrderContents.master.item.title')}
        selectedList={listItemSelected}
        initSelectedList={listItemSelected}
        setSelectedList={setListItem}
        list={listItem}
        total={totalItem}
        isOpen={visibleItem}
        loading={loadingItem}
        onClose={handleCloseItem}
        onSave={handleSaveItemModal}
        currentItem={currentItem}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        getList={indirectSalesOrderRepository.listItem}
        count={indirectSalesOrderRepository.countItem}
      />
    </>
  );
}
export default IndirectSalesOrderContentTable;
