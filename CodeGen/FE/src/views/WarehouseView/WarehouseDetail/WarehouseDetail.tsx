import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { Warehouse } from 'models/Warehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import InventoryTable from 'views/WarehouseView/WarehouseDetail/InventoryTable/InventoryTable';
import { warehouseRepository } from 'views/WarehouseView/WarehouseRepository';
import './WarehouseDetail.scss';

const { Item: FormItem } = Form;

function WarehouseDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    warehouse,
    setWarehouse,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Warehouse,
    warehouseRepository.get,
    warehouseRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Warehouse>(warehouse, setWarehouse);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    warehouseRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultDistrictList: District[] = crudService.useDefaultList<District>(
    warehouse.district,
  );

  const defaultProvinceList: Province[] = crudService.useDefaultList<Province>(
    warehouse.province,
  );

  const defaultWardList: Ward[] = crudService.useDefaultList<Ward>(
    warehouse.ward,
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
        setWarehouse({
          ...warehouse,
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
    [setWarehouse, warehouse, districtFilter.provinceId],
  );

  if (warehouse.id && warehouse.provinceId) {
    districtFilter.provinceId.equal = warehouse.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setWarehouse({
          ...warehouse,
          district,
          districtId,
          ward,
          wardId,
        });
      }
      wardFilter.districtId.equal = districtId;
    },
    [setWarehouse, warehouse, wardFilter.districtId],
  );

  if (warehouse.id && warehouse.districtId) {
    wardFilter.districtId.equal = warehouse.districtId;
  }

  return (
    <div className="page detail-page warehouse-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('warehouses.detail.title')
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
            <div className="info-title">
              <span className="title-default ml-4 mb-3">{translate('warehouses.general.info')}</span>

            </div>
            <Row>
              <Col lg={1}></Col>
              <Col lg={10}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.code),
                  )}
                  help={warehouse.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.code')}
                    <span className="text-danger">*</span>:{' '}
                  </span>
                  <input
                    type="text"
                    defaultValue={warehouse.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(warehouse.code))}
                    placeholder={translate('warehouses.placeholder.code')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.name),
                  )}
                  help={warehouse.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.name')}
                    <span className="text-danger">*</span>:{' '}
                  </span>
                  <input
                    type="text"
                    defaultValue={warehouse.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(warehouse.name))}
                    placeholder={translate('warehouses.placeholder.name')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.organization),
                  )}
                  help={warehouse.errors?.organization}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.organization')}
                    <span className="text-danger">*</span>:{' '}
                  </span>
                  <TreeSelectDropdown
                    defaultValue={isDetail ? warehouse.organization?.id : null}
                    value={warehouse.organization?.id}
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(warehouse.organization),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={warehouseRepository.singleListOrganization}
                    searchField={nameof(organizationFilter.id)}
                    placeholder={translate('warehouses.placeholder.organization')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.status),
                  )}
                  help={warehouse.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.status')}:{' '}
                  </span>
                  <SwitchStatus
                    checked={
                      // typeof store.status?.id === 'number' &&
                      warehouse.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(warehouse.status))}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={10}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.address),
                  )}
                  help={warehouse.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.address')}:{' '}
                  </span>
                  <input
                    type="text"
                    defaultValue={warehouse.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(warehouse.address),
                    )}
                    placeholder={translate('warehouses.placeholder.address')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.province),
                  )}
                  help={warehouse.errors?.province}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.province')}:{' '}
                  </span>
                  <SelectAutoComplete
                    value={warehouse.province?.id}
                    onChange={handleChangeProvince}
                    getList={warehouseRepository.singleListProvince}
                    modelFilter={provinceFilter}
                    setModelFilter={setProvinceFilter}
                    searchField={nameof(provinceFilter.name)}
                    searchType={nameof(provinceFilter.name.contain)}
                    placeholder={translate('warehouses.placeholder.province')}
                    list={defaultProvinceList}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.district),
                  )}
                  help={warehouse.errors?.district}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.district')}:{' '}
                  </span>
                  <SelectAutoComplete
                    value={warehouse.district?.id}
                    onChange={handleChangeDistrict}
                    getList={warehouseRepository.singleListDistrict}
                    modelFilter={districtFilter}
                    setModelFilter={setDistrictFilter}
                    searchField={nameof(districtFilter.name)}
                    searchType={nameof(districtFilter.name.contain)}
                    placeholder={translate('warehouses.placeholder.district')}
                    disabled={warehouse.provinceId !== undefined ? false : true}
                    list={defaultDistrictList}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.ward),
                  )}
                  help={warehouse.errors?.ward}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.ward')}:{' '}
                  </span>
                  <SelectAutoComplete
                    value={warehouse.ward?.id}
                    onChange={handleChangeObjectField(nameof(warehouse.ward))}
                    getList={warehouseRepository.singleListWard}
                    modelFilter={wardFilter}
                    setModelFilter={setWardFilter}
                    searchField={nameof(wardFilter.name)}
                    searchType={nameof(wardFilter.name.contain)}
                    placeholder={translate('warehouses.placeholder.ward')}
                    disabled={warehouse.districtId !== undefined ? false : true}
                    list={defaultWardList}
                  />
                </FormItem>
              </Col>
              <Col lg={1}></Col>
            </Row>
          </Form>

          <div>
            {isDetail && (
              <div>
                <div className="info-title mb-3">
                  <span className="title-default ml-4">{translate('warehouses.product.title')}</span>

                </div>
                <InventoryTable
                  model={warehouse}
                  setModel={setWarehouse}
                  field={nameof(warehouse.inventories)}
                  onChange={handleChangeSimpleField(
                    nameof(warehouse.inventories),
                  )}
                />
              </div>
            )}
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export default WarehouseDetail;
