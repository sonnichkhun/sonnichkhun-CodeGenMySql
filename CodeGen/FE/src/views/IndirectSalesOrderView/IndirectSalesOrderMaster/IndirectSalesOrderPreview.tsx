import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { Descriptions, Spin } from 'antd';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { useTranslation } from 'react-i18next';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { Item } from 'models/Item';
import { formatNumber } from 'helpers/number-format';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { formatDate } from 'core/helpers/date-time';
import nameof from 'ts-nameof.macro';

export interface IndirectSalesOrderPreviewProps {
  indirectSalesOrder: IndirectSalesOrder;
  indirectSalesOrderContent: IndirectSalesOrderContent;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
}

export default function IndirectSalesOrderPreview(
  props: IndirectSalesOrderPreviewProps,
) {
  const {
    indirectSalesOrder,
    indirectSalesOrderContent,
    previewVisible,
    onClose,
    previewLoading,
    loading,
  } = props;
  const [translate] = useTranslation();

  const columnsPopup: ColumnProps<
    IndirectSalesOrderContent
  >[] = React.useMemo(() => {
    return [
      {
        title: translate('indirectSalesOrderContents.items.code'),
        key: nameof(indirectSalesOrderContent[0].code),
        dataIndex: nameof(indirectSalesOrderContent[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('indirectSalesOrderContents.items.name'),
        key: nameof(indirectSalesOrderContent.item[0].name),
        dataIndex: nameof(indirectSalesOrderContent.item),
        render(item: Item) {
          return item?.name;
        },
      },
      {
        title: translate('indirectSalesOrderContents.quantity'),
        key: nameof(indirectSalesOrderContent[0].quantity),
        dataIndex: nameof(indirectSalesOrderContent[0].quantity),
      },
      {
        title: translate('indirectSalesOrderContents.salePrice'),
        key: nameof(indirectSalesOrderContent[0].salePrice),
        dataIndex: nameof(indirectSalesOrderContent[0].salePrice),
        render(...[salePrice]) {
            return formatNumber(salePrice);
        },
      },
      {
        title: translate('indirectSalesOrderContents.taxPercentage'),
        key: nameof(indirectSalesOrderContent[0].taxPercentage),
        dataIndex: nameof(indirectSalesOrderContent[0].item),
        render(item: Item) {
          return formatNumber(item?.product?.taxType?.percentage);
        },
      },
      {
        title: translate('indirectSalesOrderContents.discountAmount'),
        key: nameof(indirectSalesOrderContent[0].discountAmount),
        dataIndex: nameof(indirectSalesOrderContent[0].discountAmount),
      },
      {
        title: translate('indirectSalesOrderContents.amount'),
        key: nameof(indirectSalesOrderContent[0].amount),
        dataIndex: nameof(indirectSalesOrderContent[0].amount),
        render(...[amount]){
            return formatNumber(amount);
        },
      },
    ];
  }, [indirectSalesOrderContent, translate]);
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={translate('indirectSalesOrders.preview.title')}
      className="modal-preview"
    >
      <Spin spinning={previewLoading}>
        <Descriptions>
          <Descriptions.Item
            label={translate('indirectSalesOrders.sellerStore')}
          >
            {indirectSalesOrder?.sellerStore?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions className="mb-4 pb-4 phone-number">
          <Descriptions.Item
            label={translate('indirectSalesOrders.phoneNumber')}
          >
            {indirectSalesOrder?.sellerStore?.telephone}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={4}>
          <Descriptions.Item
            label={translate('indirectSalesOrders.buyerStore')}
          >
            {indirectSalesOrder?.buyerStore?.name}
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item label={translate('indirectSalesOrders.orderDate')}>
            {formatDate(indirectSalesOrder?.orderDate)}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={4}>
          <Descriptions.Item
            label={translate('indirectSalesOrders.deliveryAddress')}
          >
            {indirectSalesOrder?.deliveryAddress}
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('indirectSalesOrders.indirectSalesOrderStatus')}
          >
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 1 && (
                <span className="new-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </span>
              )}
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 2 && (
                <span className="pending-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </span>
              )}
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 3 && (
                <span className="approved-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </span>
              )}
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 4 && (
                <span className="rejected-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </span>
              )}
            {/* {previewModel?.indirectSalesOrderStatus?.name} */}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={4}>
          <Descriptions.Item
            label={translate('indirectSalesOrders.phoneNumber')}
          >
            {indirectSalesOrder?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item label={translate('indirectSalesOrders.code')}>
            {indirectSalesOrder?.code}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={1}>
          <Descriptions.Item>
            <Table
              dataSource={indirectSalesOrder.indirectSalesOrderContents}
              columns={columnsPopup}
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(indirectSalesOrder.id)}
              scroll={{ y: 240 }}
              pagination={false}
            />
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={1}>
            <Descriptions.Item
                label={translate('indirectSalesOrders.subTotal')}
                className="float-right"
            >
                {formatNumber(indirectSalesOrder?.subTotal) }
            </Descriptions.Item>
            <Descriptions.Item
                label={translate('indirectSalesOrders.discountPercentage')}
                className="float-right"
            >
                {formatNumber(indirectSalesOrder?.generalDiscountAmount)}
            </Descriptions.Item>
            <Descriptions.Item
                label={translate('indirectSalesOrders.totalTaxAmount')}
                className="float-right"
            >
                {formatNumber(indirectSalesOrder?.totalTaxAmount)}
            </Descriptions.Item>
            <Descriptions.Item
                className="float-right total"
            >
                {formatNumber(indirectSalesOrder?.total)}
            </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
