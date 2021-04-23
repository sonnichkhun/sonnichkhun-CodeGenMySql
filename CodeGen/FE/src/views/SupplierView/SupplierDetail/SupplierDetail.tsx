import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { DistrictFilter } from 'models/DistrictFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { Supplier } from 'models/Supplier';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { supplierRepository } from 'views/SupplierView/SupplierRepository';
import './SupplierDetail.scss';
import Switch from 'components/Switch/Switch';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { Province } from 'models/Province';
import { District } from 'models/District';
import { Ward } from 'models/Ward';
import { AppUser } from 'models/AppUser';

const { Item: FormItem } = Form;

function SupplierDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    supplier,
    setSupplier,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Supplier,
    supplierRepository.get,
    supplierRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Supplier>(supplier, setSupplier);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    supplierRepository.singleListStatus,
  );
  // const [statusList] = crudService.useEnumList<Status>(supplierRepository.singleListStatus);
  // Default List
  const defaultProvinceList: Province[] = crudService.useDefaultList<Province>(supplier.province);
  const defaultDistrictList: District[] = crudService.useDefaultList<District>(supplier.district);
  const defaultWardList: Ward[] = crudService.useDefaultList<Ward>(supplier.ward);
  const defaultPersonInCharge: AppUser[] = crudService.useDefaultList<AppUser>(supplier.personInCharge);
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
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
        setSupplier({
          ...supplier,
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
    [setSupplier, supplier, districtFilter.provinceId],
  );
  if (supplier.id && supplier.provinceId) {
    districtFilter.provinceId.equal = supplier.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setSupplier({
          ...supplier,
          district,
          districtId,
          ward,
          wardId,
        });
      }
      wardFilter.districtId.equal = districtId;

    },
    [setSupplier, supplier, wardFilter.districtId],
  );

  if (supplier.id && supplier.districtId) {
    wardFilter.districtId.equal = supplier.districtId;
  }

  return (
    <div className="page detail-page supplier-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('suppliers.detail.title')
                : translate(generalLanguageKeys.actions.create)}
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
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.code),
                  )}
                  help={supplier.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.code))}
                    placeholder={translate('suppliers.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.name),
                  )}
                  help={supplier.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.name))}
                    placeholder={translate('suppliers.placeholder.name')}
                    // pattern=".{0,255}"
                    maxLength={255}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.description),
                  )}
                  help={supplier.errors?.description}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.description')}
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.description}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(supplier.description),
                    )}
                    placeholder={translate('suppliers.placeholder.description')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.status),
                  )}
                  help={supplier.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.status')}
                  </span>
                  <Switch
                    checked={
                      // typeof supplier.status?.id === 'number' &&
                      supplier.statusId === statusList[1]?.id
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(supplier.status))}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.address),
                  )}
                  help={supplier.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.address')}
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.address))}
                    placeholder={translate('suppliers.placeholder.address')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.province),
                  )}
                  help={supplier.errors?.province}
                >
                  <span className="label-input ml-3">{translate('suppliers.province')}</span>
                  <SelectAutoComplete
                    value={supplier?.province?.id}
                    onChange={handleChangeProvince}
                    getList={supplierRepository.singleListProvince}
                    modelFilter={provinceFilter}
                    setModelFilter={setProvinceFilter}
                    searchField={nameof(provinceFilter.name)}
                    searchType={nameof(provinceFilter.name.contain)}
                    placeholder={
                      translate('suppliers.placeholder.province')
                    }
                    list={defaultProvinceList}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.district),
                  )}
                  help={supplier.errors?.district}
                >
                  <span className="label-input ml-3">{translate('suppliers.district')}</span>
                  <SelectAutoComplete
                    value={supplier.district?.id}
                    onChange={handleChangeDistrict}
                    getList={supplierRepository.singleListDistrict}
                    modelFilter={districtFilter}
                    setModelFilter={setDistrictFilter}
                    searchField={nameof(districtFilter.name)}
                    searchType={nameof(districtFilter.name.contain)}
                    placeholder={
                      translate('suppliers.placeholder.district')
                    }
                    disabled={supplier.provinceId !== undefined ? false : true}
                    list={defaultDistrictList}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.ward),
                  )}
                  help={supplier.errors?.ward}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.ward')}
                  </span>
                  <SelectAutoComplete
                    value={supplier.ward?.id}
                    onChange={handleChangeObjectField(nameof(supplier.ward))}
                    getList={supplierRepository.singleListWard}
                    modelFilter={wardFilter}
                    setModelFilter={setWardFilter}
                    searchField={nameof(wardFilter.name)}
                    searchType={nameof(wardFilter.name.contain)}
                    placeholder={translate('suppliers.placeholder.ward')}
                    disabled={supplier.districtId !== undefined ? false : true}
                    list={defaultWardList}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.ownerName),
                  )}
                  help={supplier.errors?.ownerName}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.ownerName')}
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.ownerName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(supplier.ownerName),
                    )}
                    placeholder={translate('suppliers.placeholder.ownerName')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.phone),
                  )}
                  help={supplier.errors?.phone}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.phone')}
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.phone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.phone))}
                    placeholder={translate('suppliers.placeholder.phone')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.email),
                  )}
                  help={supplier.errors?.email}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.email')}
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.email}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.email))}
                    placeholder={translate('suppliers.placeholder.email')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.taxCode),
                  )}
                  help={supplier.errors?.taxCode}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.taxCode')}
                  </span>
                  <input
                    type="text"
                    defaultValue={supplier.taxCode}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.taxCode))}
                    placeholder={translate('suppliers.placeholder.taxCode')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.personInCharge),
                  )}
                  help={supplier.errors?.personInCharge}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.personInCharge')}
                  </span>
                  <SelectAutoComplete
                    value={supplier.personInCharge?.id}
                    onChange={handleChangeObjectField(
                      nameof(supplier.personInCharge),
                    )}
                    getList={supplierRepository.singleListPersonInCharge}
                    modelFilter={appUserFilter}
                    setModelFilter={setAppUserFilter}
                    searchField={nameof(appUserFilter.displayName)}
                    searchType={nameof(appUserFilter.displayName.contain)}
                    placeholder={
                      translate('suppliers.placeholder.personInCharge')
                    }
                    list={defaultPersonInCharge}
                    allowClear={true}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default SupplierDetail;
