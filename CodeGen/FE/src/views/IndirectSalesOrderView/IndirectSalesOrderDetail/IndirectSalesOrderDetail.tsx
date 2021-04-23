import Card from 'antd/lib/card';
import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { EditPriceStatus } from 'models/EditPriceStatus';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import IndirectSalesOrderContentTable from 'views/IndirectSalesOrderView/IndirectSalesOrderDetail/IndirectSalesOrderContentTable/IndirectSalesOrderContentTable';
import IndirectSalesOrderPromotionTable from 'views/IndirectSalesOrderView/IndirectSalesOrderDetail/IndirectSalesOrderPromotionTable/IndirectSalesOrderPromotionTable';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import './IndirectSalesOrderDetail.scss';
import StoreModal from './StoreModal/StoreModal';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import InputNumber from 'components/InputNumber/InputNumber';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;

function IndirectSalesOrderDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    indirectSalesOrder,
    setIndirectSalesOrder,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    IndirectSalesOrder,
    indirectSalesOrderRepository.get,
    indirectSalesOrderRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeDateField,
  ] = crudService.useChangeHandlers<IndirectSalesOrder>(
    indirectSalesOrder,
    setIndirectSalesOrder,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [editPriceStatusList] = crudService.useEnumList<EditPriceStatus>(
    indirectSalesOrderRepository.singleListEditPriceStatus,
  );

  // const [indirectSalesOrderStatusList] = crudService.useEnumList<IndirectSalesOrderStatus>(indirectSalesOrderRepository.singleListIndirectSalesOrderStatus);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  // const [resellerStoreFilter, setResellerStoreFilter] = React.useState<StoreFilter>(new StoreFilter());

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultAppUserList: AppUser[] = crudService.useDefaultList<AppUser>(
    indirectSalesOrder.saleEmployee,
  );

  const [, , , listStore2 ] = crudService.useContentModal(
    indirectSalesOrderRepository.listStore,
    indirectSalesOrderRepository.countStore,
    StoreFilter,
  );

  const [listBuyerStore, setListBuyerStore] = React.useState<Store[]>([]);
  const [listResellerStore, setListResellerStore] = React.useState<Store[]>([]);
  const [visibleBuyerStore, setVisibleBuyerStore] = React.useState<boolean>(
    false,
  );
  const [visibleResellerStore, setVisibleResellerStore] = React.useState<
    boolean
  >(false);
  const [calculateTotal, setCalculateTotal] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (calculateTotal) {
      let newSubTotal = 0;
      let generalVAT = 0;
      if (
        indirectSalesOrder.indirectSalesOrderContents &&
        indirectSalesOrder.indirectSalesOrderContents.length > 0
      ) {
        indirectSalesOrder.indirectSalesOrderContents.forEach(
          (indirectSalesOrderContent: IndirectSalesOrderContent) => {
            newSubTotal += indirectSalesOrderContent.amount;
          },
        );

        indirectSalesOrder.indirectSalesOrderContents.forEach(
          (indirectSalesOrderContent: IndirectSalesOrderContent) => {
            // vat = SUM ([amount - (Chiet khau tong don X amount)/subtotal]x % VAt từng dòng)
            generalVAT += (indirectSalesOrderContent.amount - ((indirectSalesOrder.generalDiscountAmount*indirectSalesOrderContent.amount)/newSubTotal))*(indirectSalesOrderContent.discountPercentage/100);
          },
        );

        const newTotal = newSubTotal - indirectSalesOrder.generalDiscountAmount + generalVAT;

        setIndirectSalesOrder({
          ...indirectSalesOrder,
          subTotal: newSubTotal,
          totalTaxAmount: Math.floor(generalVAT),
          total: Math.floor(newTotal),
        });
      }
      setCalculateTotal(false);
    }
  }, [calculateTotal, indirectSalesOrder, setIndirectSalesOrder]);

  React.useEffect(() => {
    if (
      indirectSalesOrder &&
      (!indirectSalesOrder.requestStateId ||
        indirectSalesOrder.requestStateId === null)
    ) {
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        requestStateId: 1,
      });
    }
  }, [setIndirectSalesOrder, indirectSalesOrder]);

  const handleOpenBuyerStore = React.useCallback(() => {
    setVisibleBuyerStore(true);
  }, [setVisibleBuyerStore]);

  const handleCloseBuyerStore = React.useCallback(() => {
    setVisibleBuyerStore(false);
  }, [setVisibleBuyerStore]);

  const handleSavePopupBuyerStore = React.useCallback(
    event => {
      setVisibleBuyerStore(false);
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        buyerStoreId: event[0].id,
        buyerStore: event[0],
      });
      setListBuyerStore(event);
    },
    [
      setVisibleBuyerStore,
      setListBuyerStore,
      setIndirectSalesOrder,
      indirectSalesOrder,
    ],
  );

  const handleOpenResellerStore = React.useCallback(() => {
    setVisibleResellerStore(true);
  }, [setVisibleResellerStore]);

  const handleCloseResellerStore = React.useCallback(() => {
    setVisibleResellerStore(false);
  }, [setVisibleResellerStore]);

  const handleSavePopupResellerStore = React.useCallback(
    event => {
      setVisibleResellerStore(false);
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        sellerStoreId: event[0].id,
        sellerStore: event[0],
      });
      setListResellerStore(event);
    },
    [
      setVisibleResellerStore,
      setListResellerStore,
      setIndirectSalesOrder,
      indirectSalesOrder,
    ],
  );

  const handleChangeGeneralDiscountPercentage = React.useCallback(
    event => {
      const discountAmount = Math.floor((event/100)*indirectSalesOrder?.subTotal);
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        generalDiscountAmount: discountAmount,
        generalDiscountPercentage: event,
      });
      setCalculateTotal(true);
    },
    [indirectSalesOrder, setIndirectSalesOrder],
  );

  const handleChangeGeneralDiscountAmount = React.useCallback(
    event => {
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        generalDiscountAmount: event,
      });
    },
    [indirectSalesOrder, setIndirectSalesOrder],
  );

  return (
    <div className="page detail-page detail-page-indirect-order">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('indirectSalesOrders.detail.title')
                : translate(generalLanguageKeys.actions.create)}
              {indirectSalesOrder.requestStateId &&
                indirectSalesOrder.requestStateId === 1 && (
                  <span className="new-state ml-4">
                    {translate(generalLanguageKeys.state.new)}
                  </span>
                )}
              {indirectSalesOrder.requestStateId &&
                indirectSalesOrder.requestStateId === 2 && (
                  <span className="pending-state ml-4">
                    {translate(generalLanguageKeys.state.pending)}
                  </span>
                )}
              {indirectSalesOrder.requestStateId &&
                indirectSalesOrder.requestStateId === 3 && (
                  <span className="approved-state ml-4">
                    {translate(generalLanguageKeys.state.approved)}
                  </span>
                )}
              {indirectSalesOrder.requestStateId &&
                indirectSalesOrder.requestStateId === 4 && (
                  <span className="rejected-state ml-4">
                    {translate(generalLanguageKeys.state.rejected)}
                  </span>
                )}
              <button
                className="btn btn-sm btn-outline-primary float-right ml-2"
                onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
              <button
                className="btn btn-sm btn-primary float-right"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
            </>
          }
        >
          <Form>
            <div className="info-title ml-3 mb-3 mt-3">
              <span className="title-default">
                {translate('indirectSalesOrders.general.title')}
              </span>
            </div>
            <Row>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(indirectSalesOrder.errors, nameof(indirectSalesOrder.code))}
                  help={indirectSalesOrder.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.code')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.code),
                    )}
                    placeholder={translate('indirectSalesOrders.placeholder.code')}
                    disabled
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.deliveryAddress),
                  )}
                  help={indirectSalesOrder.errors?.deliveryAddress}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.deliveryAddress')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.deliveryAddress}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.deliveryAddress),
                    )}
                    placeholder={translate('indirectSalesOrders.placeholder.deliveryAddress')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.orderDate),
                  )}
                  help={indirectSalesOrder.errors?.orderDate}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.orderDate')}
                    <span className="text-danger">*</span>
                  </span>
                  <DatePicker
                    value={ typeof indirectSalesOrder.orderDate === 'object' ? indirectSalesOrder.orderDate : null}
                    onChange={handleChangeDateField(
                      nameof(indirectSalesOrder.orderDate),
                    )}
                    className="w-100"
                    placeholder={translate('indirectSalesOrders.placeholder.orderDate')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.editedPriceStatus),
                  )}
                  help={indirectSalesOrder.errors?.editedPriceStatus}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.status')}
                  </span>
                  <Switch
                    checked={
                      // typeof indirectSalesOrder.status?.id === 'number' &&
                      indirectSalesOrder.editedPriceStatusId ===
                      editPriceStatusList[0]?.id
                    }
                    list={editPriceStatusList}
                    onChange={handleChangeObjectField(
                      nameof(indirectSalesOrder.editedPriceStatus),
                    )}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.buyerStore),
                  )}
                  help={indirectSalesOrder.errors?.buyerStore}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.buyerStore')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.buyerStore?.name}
                    className="form-control form-control-sm"
                    onClick={handleOpenBuyerStore}
                    placeholder={translate('indirectSalesOrders.placeholder.buyerStore')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.sellerStore),
                  )}
                  help={indirectSalesOrder.errors?.sellerStore}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.sellerStore')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.sellerStore?.name}
                    className="form-control form-control-sm"
                    onClick={handleOpenResellerStore}
                    placeholder={translate('indirectSalesOrders.placeholder.sellerStore')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.deliveryDate),
                  )}
                  help={indirectSalesOrder.errors?.deliveryDate}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.deliveryDate')}
                  </span>
                  <DatePicker
                    value={typeof indirectSalesOrder.deliveryDate === 'object' ? indirectSalesOrder.deliveryDate : null}
                    onChange={handleChangeDateField(
                      nameof(indirectSalesOrder.deliveryDate),
                    )}
                    className="w-100"
                    placeholder={translate('indirectSalesOrders.placeholder.deliveryDate')}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.phoneNumber),
                  )}
                  help={indirectSalesOrder.errors?.phoneNumber}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.phoneNumber')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.phoneNumber}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.phoneNumber),
                    )}
                    placeholder={translate('indirectSalesOrders.placeholder.phoneNumber')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.saleEmployee),
                  )}
                  help={indirectSalesOrder.errors?.saleEmployee}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.saleEmployee')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={indirectSalesOrder.saleEmployee?.id}
                    onChange={handleChangeObjectField(
                      nameof(indirectSalesOrder.saleEmployee),
                    )}
                    getList={indirectSalesOrderRepository.filterListAppUser}
                    modelFilter={appUserFilter}
                    setModelFilter={setAppUserFilter}
                    searchField={nameof(appUserFilter.displayName)}
                    searchType={nameof(appUserFilter.displayName.contain)}
                    placeholder={translate('indirectSalesOrders.placeholder.sellerStore')}
                    list={defaultAppUserList}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(indirectSalesOrder.errors, nameof(indirectSalesOrder.note))}
                  help={indirectSalesOrder.errors?.note}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.note')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.note}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.note),
                    )}
                    placeholder={translate('indirectSalesOrders.placeholder.note')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Tabs defaultActiveKey="1" className="ml-3 mr-3">
            <TabPane
              key="indirectSalesOrderContents"
              tab={translate(
                'indirectSalesOrders.tabs.indirectSalesOrderContents.title',
              )}
            >
              <IndirectSalesOrderContentTable
                model={indirectSalesOrder}
                setModel={setIndirectSalesOrder}
                field={nameof(indirectSalesOrder.indirectSalesOrderContents)}
                onChange={handleChangeSimpleField(
                  nameof(indirectSalesOrder.indirectSalesOrderContents),
                )}
                setCalculateTotal={setCalculateTotal}
                // buyerStoreId={indirectSalesOrder?.buyerStoreId}
              />
            </TabPane>

            <TabPane
              key="indirectSalesOrderPromotions"
              tab={translate(
                'indirectSalesOrders.tabs.indirectSalesOrderPromotions.title',
              )}
            >
              <IndirectSalesOrderPromotionTable
                model={indirectSalesOrder}
                setModel={setIndirectSalesOrder}
                field={nameof(indirectSalesOrder.indirectSalesOrderPromotions)}
                onChange={handleChangeSimpleField(
                  nameof(indirectSalesOrder.indirectSalesOrderPromotions),
                )}
              />
            </TabPane>
          </Tabs>
          <div className="info-title ml-3 mb-3 mt-3">
            <span className="title-default">
              {translate('indirectSalesOrders.payment.title')}
            </span>
          </div>
          <div className="payment">
            <Row>
              <Col lg={12}></Col>
              <Col lg={12}>
                <Row>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.subTotal),
                  )}
                  help={indirectSalesOrder.errors?.subTotal}
                >
                  <span className="label-input ml-3 mr-3">
                    {translate('indirectSalesOrders.subTotal')}
                  </span>
                  <InputNumber
                    value={indirectSalesOrder.subTotal}
                    className="form-control form-control-sm sub-total"
                    disabled
                  />
                </FormItem>
                </Row>
                <Row>
                  <Col lg={8}>
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        IndirectSalesOrder
                      >(
                        indirectSalesOrder.errors,
                        nameof(indirectSalesOrder.generalDiscountPercentage),
                      )}
                      help={
                        indirectSalesOrder.errors?.generalDiscountPercentage
                      }
                    >
                      <span className="label-input ml-3 mr-3">
                        {translate(
                          'indirectSalesOrders.generalDiscountPercentage',
                        )}
                      </span>
                      <InputNumber
                        type="text"
                        defaultValue={
                          indirectSalesOrder.generalDiscountPercentage
                        }
                        className="form-control form-control-sm input-discount"
                        onChange={handleChangeGeneralDiscountPercentage}
                      />

                      <span className="ml-4">%</span>
                    </FormItem>
                  </Col>
                  <Col lg={16}>
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        IndirectSalesOrder
                      >(
                        indirectSalesOrder.errors,
                        nameof(indirectSalesOrder.generalDiscountAmount),
                      )}
                      help={indirectSalesOrder.errors?.generalDiscountAmount}
                    >
                      <InputNumber
                        value={(indirectSalesOrder?.generalDiscountAmount)}
                        className="form-control form-control-sm input-discount-amount"
                        onChange={handleChangeGeneralDiscountAmount}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.totalTaxAmount),
                  )}
                  help={indirectSalesOrder.errors?.totalTaxAmount}
                >
                  <span className="label-input ml-3 mr-3">
                    {translate('indirectSalesOrders.totalTaxAmount')}
                  </span>
                  <InputNumber
                    value={(indirectSalesOrder.totalTaxAmount)}
                    className="form-control form-control-sm"
                    disabled
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.total),
                  )}
                  help={indirectSalesOrder.errors?.total}
                >
                  <span className="label-input ml-3 mr-3">
                    {translate('indirectSalesOrders.newTotal')}
                  </span>
                  <InputNumber
                    value={(indirectSalesOrder.total)}
                    className="form-control form-control-sm"
                    disabled
                  />
                </FormItem>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
          </div>
        </Card>
        <StoreModal
          title={translate('indirectSalesOrders.select.store')}
          selectedList={listBuyerStore}
          setSelectedList={setListBuyerStore}
          list={listStore2}
          isOpen={visibleBuyerStore}
          toggle={handleCloseBuyerStore}
          onClose={handleCloseBuyerStore}
          getList={indirectSalesOrderRepository.listStore}
          count={indirectSalesOrderRepository.countStore}
          onSave={handleSavePopupBuyerStore}
        />

        <StoreModal
          title={translate('indirectSalesOrders.select.store')}
          selectedList={listResellerStore}
          setSelectedList={setListResellerStore}
          list={listStore2}
          isOpen={visibleResellerStore}
          toggle={handleCloseResellerStore}
          onClose={handleCloseResellerStore}
          getList={indirectSalesOrderRepository.listStore}
          count={indirectSalesOrderRepository.countStore}
          onSave={handleSavePopupResellerStore}
        />
      </Spin>
    </div>
  );
}

export default IndirectSalesOrderDetail;
