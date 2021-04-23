import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import Map from 'components/GoogleAutoCompleteMap/GoogleAutoCompleteMap';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Image } from 'models/Image';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { storeRepository } from 'views/StoreView/StoreRepository';
import './StoreDetail.scss';

const { Item: FormItem } = Form;

function StoreDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    store,
    setStore,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Store, storeRepository.get, storeRepository.save);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Store>(store, setStore);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    storeRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());

  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );

  // Default List

  const defaultParentStoreList: Store[] = crudService.useDefaultList<Store>(
    store.parentStore,
  );

  const defaultStoreGroupingList: StoreGrouping[] = crudService.useDefaultList<
    StoreGrouping
  >(store.storeGrouping);

  const defaultStoreTypeList: StoreType[] = crudService.useDefaultList<
    StoreType
  >(store.storeType);

  const defaultProvinceList: Province[] = crudService.useDefaultList<Province>(
    store.province,
  );
  const defaultDistrictList: District[] = crudService.useDefaultList<District>(
    store.district,
  );
  const defaultWardList: Ward[] = crudService.useDefaultList<Ward>(store.ward);
  const [imageStore, setImageStore] = React.useState<Image[]>([]);
  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      setImageStore(items);
      const storeImageMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          storeImageMappings.push({
            image: item,
            imageId: item.id,
          });
        });
      }
      setStore({
        ...store,
        imageStore,
      });
    },
    [setStore, store, imageStore],
  );

  const handleChangeProvince = React.useCallback(
    (event, item) => {
      const provinceId = event;
      const province = item;
      if (districtFilter.provinceId.equal !== provinceId) {
        const districtId = undefined;
        const district = undefined;
        const wardId = undefined;
        const ward = undefined;
        setStore({
          ...store,
          province,
          provinceId,
          districtId,
          district,
          wardId,
          ward,
        });
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [setStore, store, districtFilter.provinceId],
  );

  if (store.id && store.provinceId) {
    districtFilter.provinceId.equal = store.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setStore({
          ...store,
          district,
          districtId,
          ward,
          wardId,
        });
      }
      wardFilter.districtId.equal = districtId;
    },
    [setStore, store, wardFilter.districtId],
  );

  if (store.id && store.districtId) {
    wardFilter.districtId.equal = store.districtId;
  }

  return (
    <div className="page detail-page store-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail === false
                ? translate(generalLanguageKeys.actions.create)
                : translate('stores.detail.title')}
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
            <div className="info-title ml-3">
              {translate('stores.general.info')}
            </div>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.code),
                  )}
                  help={store.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('stores.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={store.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.code))}
                    placeholder={translate('stores.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.organization),
                  )}
                  help={store.errors?.organization}
                >
                  <span className="label-input ml-3">
                    {translate('stores.organization')}
                    <span className="text-danger">*</span>
                  </span>
                  <TreeSelectDropdown
                    defaultValue={store.organization?.id}
                    value={store.organization?.id}
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(store.organization),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={storeRepository.singleListOrganization}
                    searchField={nameof(organizationFilter.id)}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.storeType),
                  )}
                  help={store.errors?.storeType}
                >
                  <span className="label-input ml-3">
                    {translate('stores.storeType')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={store.storeType?.id}
                    onChange={handleChangeObjectField(nameof(store.storeType))}
                    getList={storeRepository.singleListStoreType}
                    modelFilter={storeTypeFilter}
                    setModelFilter={setStoreTypeFilter}
                    searchField={nameof(storeTypeFilter.name)}
                    searchType={nameof(storeTypeFilter.name.contain)}
                    placeholder={translate('stores.placeholder.storeType')}
                    list={defaultStoreTypeList}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.name),
                  )}
                  help={store.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('stores.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={store.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.name))}
                    placeholder={translate('stores.placeholder.name')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.parentStore),
                  )}
                  help={store.errors?.parentStore}
                >
                  <span className="label-input ml-3">
                    {translate('stores.parentStore')}
                  </span>
                  <SelectAutoComplete
                    value={store.parentStore?.id}
                    onChange={handleChangeObjectField(
                      nameof(store.parentStore),
                    )}
                    getList={storeRepository.singleListParentStore}
                    modelFilter={storeFilter}
                    setModelFilter={setStoreFilter}
                    searchField={nameof(storeFilter.name)}
                    searchType={nameof(storeFilter.name.contain)}
                    placeholder={translate('stores.placeholder.parentStore')}
                    list={defaultParentStoreList}
                    allowClear={true}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.storeGrouping),
                  )}
                  help={store.errors?.storeGrouping}
                >
                  <span className="label-input ml-3">
                    {translate('stores.storeGrouping')}
                  </span>
                  <SelectAutoComplete
                    value={store.storeGrouping?.id}
                    onChange={handleChangeObjectField(
                      nameof(store.storeGrouping),
                    )}
                    getList={storeRepository.singleListStoreGrouping}
                    modelFilter={storeGroupingFilter}
                    setModelFilter={setStoreGroupingFilter}
                    searchField={nameof(storeGroupingFilter.name)}
                    searchType={nameof(storeGroupingFilter.name.contain)}
                    placeholder={translate('stores.placeholder.storeGrouping')}
                    list={defaultStoreGroupingList}
                    allowClear={true}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                {/* <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.reseller),
                  )}
                  help={store.errors?.reseller}
                >
                  <span className="label-input ml-3">
                    {translate('stores.reseller')}
                  </span>
                  <input
                    type="text"
                    defaultValue={store.reseller}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.reseller))}
                    placeholder={translate('stores.placeholder.reseller')}
                  />
                </FormItem> */}
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.province),
                  )}
                  help={store.errors?.province}
                >
                  <span className="label-input ml-3">
                    {translate('stores.province')}
                  </span>
                  <SelectAutoComplete
                    value={store.province?.id}
                    onChange={handleChangeProvince}
                    getList={storeRepository.singleListProvince}
                    modelFilter={provinceFilter}
                    setModelFilter={setProvinceFilter}
                    searchField={nameof(provinceFilter.name)}
                    searchType={nameof(provinceFilter.name.contain)}
                    placeholder={translate('stores.placeholder.province')}
                    list={defaultProvinceList}
                    allowClear={true}
                  />
                </FormItem>
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.district),
                  )}
                  help={store.errors?.district}
                >
                  <span className="label-input ml-3">
                    {translate('stores.district')}
                  </span>
                  <SelectAutoComplete
                    value={store.district?.id}
                    onChange={handleChangeDistrict}
                    getList={storeRepository.singleListDistrict}
                    modelFilter={districtFilter}
                    setModelFilter={setDistrictFilter}
                    searchField={nameof(districtFilter.name)}
                    searchType={nameof(districtFilter.name.contain)}
                    placeholder={translate('stores.placeholder.district')}
                    disabled={store.provinceId !== undefined ? false : true}
                    list={defaultDistrictList}
                    allowClear={true}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ward),
                  )}
                  help={store.errors?.ward}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ward')}
                  </span>
                  <SelectAutoComplete
                    value={store.ward?.id}
                    onChange={handleChangeObjectField(nameof(store.ward))}
                    getList={storeRepository.singleListWard}
                    modelFilter={wardFilter}
                    setModelFilter={setWardFilter}
                    searchField={nameof(wardFilter.name)}
                    searchType={nameof(wardFilter.name.contain)}
                    placeholder={translate('stores.placeholder.ward')}
                    disabled={store.districtId !== undefined ? false : true}
                    list={defaultWardList}
                    allowClear={true}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                <div className={'store-address'}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.address),
                    )}
                    help={store.errors?.address}
                    id={'store-address'}
                  >
                    <span className="label-input label-address ml-3">
                      {translate('stores.address1')}
                      <span className="text-danger">*</span>
                    </span>
                    <div style={{ height: 250 }} className="mb-5 google-map">
                      <Map
                        lat={store.latitude ? store.latitude : 21.027763}
                        lng={store.longitude ? store.longitude : 105.83416}
                        defaultZoom={10}
                        defaultAddress={store.address}
                        inputClassName={
                          'form-control form-control-sm mb- input-map'
                        }
                        inputMapClassName={'mt-4 '}
                        model={store}
                        setModel={setStore}
                        isAddress={true}
                        placeholder={translate('stores.placeholder.address')}
                      />
                    </div>
                  </FormItem>
                </div>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('stores.location')}
                  </span>
                  <Row>
                    <Col span={12} className="pr-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.latitude')}
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control form-control-sm"
                        placeholder={translate('stores.latitude')}
                        defaultValue={store.latitude}
                      />
                    </Col>
                    <Col span={12} className="pl-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.longitude')}
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control form-control-sm"
                        placeholder={translate('stores.longitude')}
                        defaultValue={store.longitude}
                      />
                    </Col>
                  </Row>
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.telephone),
                  )}
                  help={store.errors?.telephone}
                >
                  <span className="label-input ml-3">
                    {translate('stores.telephone')}
                  </span>
                  <input
                    type="text"
                    defaultValue={store.telephone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.telephone))}
                    placeholder={translate('stores.placeholder.phone')}
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3 mb-5 pb-4">
                    {translate('stores.images')}
                  </span>

                  <ImageUpload
                    defaultItems={imageStore}
                    limit={15}
                    aspectRatio={1}
                    onUpload={storeRepository.uploadImage}
                    onChange={handleChangeImages}
                  />
                </FormItem>
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                <div className={'store-address'}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.deliveryAddress),
                    )}
                    help={store.errors?.deliveryAddress}
                  >
                    <span className="label-input label-address ml-3">
                      {translate('stores.address2')}
                    </span>
                    <div style={{ height: 250 }} className="mb-5 google-map">
                      <Map
                        lat={
                          store.deliveryLatitude
                            ? store.deliveryLatitude
                            : 21.027763
                        }
                        lng={
                          store.deliveryLongitude
                            ? store.deliveryLongitude
                            : 105.83416
                        }
                        defaultZoom={10}
                        defaultAddress={store.deliveryAddress}
                        inputClassName={
                          'form-control form-control-sm mb-4 input-map'
                        }
                        inputMapClassName={'mt-4 '}
                        model={store}
                        setModel={setStore}
                        isAddress={false}
                        placeholder={translate('stores.placeholder.address2')}
                      />
                    </div>
                  </FormItem>
                </div>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('stores.location')}
                  </span>
                  <Row>
                    <Col span={12} className="pr-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.latitude')}
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control form-control-sm"
                        placeholder={translate('stores.latitude')}
                        defaultValue={store.deliveryLatitude}
                      />
                    </Col>
                    <Col span={12} className="pl-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.longitude')}
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control form-control-sm"
                        placeholder={translate('stores.longitude')}
                        defaultValue={store.deliveryLongitude}
                      />
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <div className="info-title ml-3 mt-4">
              {translate('stores.owner.info')}
            </div>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ownerName),
                  )}
                  help={store.errors?.ownerName}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ownerName')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={store.ownerName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.ownerName))}
                    placeholder={translate('stores.placeholder.ownerName')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ownerEmail),
                  )}
                  help={store.errors?.ownerEmail}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ownerEmail')}
                  </span>
                  <input
                    type="text"
                    defaultValue={store.ownerEmail}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.ownerEmail))}
                    placeholder={translate('stores.placeholder.ownerEmail')}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ownerPhone),
                  )}
                  help={store.errors?.ownerPhone}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ownerPhone')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={store.ownerPhone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.ownerPhone))}
                    placeholder={translate('stores.placeholder.ownerPhone')}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.status),
                  )}
                  help={store.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('stores.status')}
                  </span>
                  <Switch
                    checked={
                      store.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(store.status))}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
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
      </Spin>
    </div>
  );
}

export default StoreDetail;
