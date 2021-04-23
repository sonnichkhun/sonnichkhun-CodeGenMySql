import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { unitOfMeasureGroupingRepository } from 'views/UnitOfMeasureGroupingView/UnitOfMeasureGroupingRepository';
import UnitOfMeasureGroupingContentTable from './UnitOfMeasureGroupingContentTable/UnitOfMeasureGroupingContentTable';
import './UnitOfMeasureGroupingDetail.scss';
import { Status } from 'models/Status';

const { Item: FormItem } = Form;

function UnitOfMeasureGroupingDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    unitOfMeasureGrouping,
    setUnitOfMeasureGrouping,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    UnitOfMeasureGrouping,
    unitOfMeasureGroupingRepository.get,
    unitOfMeasureGroupingRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<UnitOfMeasureGrouping>(
    unitOfMeasureGrouping,
    setUnitOfMeasureGrouping,
  );

  const [statusList] = crudService.useEnumList<Status>(
    unitOfMeasureGroupingRepository.singleListStatus,
  );

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const defaultUnitOfMeasureList: UnitOfMeasure[] = crudService.useDefaultList<
    UnitOfMeasure
  >(unitOfMeasureGrouping.unitOfMeasure);

  const [
    unitOfMeasureChangeFilter,
    setUnitOfMeasureChangeFilter,
  ] = React.useState<UnitOfMeasureFilter>(new UnitOfMeasureFilter());

  const handleChangeUnitOfMeasure = React.useCallback(
    (event, item) => {
      const unitOfMeasureId = event;
      const unitOfMeasure = item;
      const unitOfMeasureList: number[] = [unitOfMeasureId];
      unitOfMeasureChangeFilter.id.notIn = unitOfMeasureList;
      if (unitOfMeasureGrouping.unitOfMeasureId !== unitOfMeasureId) {
        // empty contents
        unitOfMeasureGrouping.unitOfMeasureGroupingContents = [];
        setUnitOfMeasureGrouping({
          ...unitOfMeasureGrouping,
          unitOfMeasureId,
          unitOfMeasure,
        });
      }
    },
    [
      setUnitOfMeasureGrouping,
      unitOfMeasureGrouping,
      unitOfMeasureChangeFilter.id,
    ],
  );

  return (
    <div className="page detail-page page-detail-uomg">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('unitOfMeasureGroupings.detail.title')
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
           <div className="info-title ml-3 mb-3 mt-3">
            {translate('roles.general.info')}
          </div>
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    UnitOfMeasureGrouping
                  >(
                    unitOfMeasureGrouping.errors,
                    nameof(unitOfMeasureGrouping.code),
                  )}
                  help={unitOfMeasureGrouping.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('unitOfMeasureGroupings.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={unitOfMeasureGrouping.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(unitOfMeasureGrouping.code),
                    )}
                    placeholder={translate(
                      'unitOfMeasureGroupings.placeholder.code',
                    )}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    UnitOfMeasure
                  >(
                    unitOfMeasureGrouping.errors,
                    nameof(unitOfMeasureGrouping.name),
                  )}
                  help={unitOfMeasureGrouping.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('unitOfMeasureGroupings.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={unitOfMeasureGrouping.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(unitOfMeasureGrouping.name),
                    )}
                    placeholder={translate(
                      'unitOfMeasureGroupings.placeholder.name',
                    )}
                  />
                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    UnitOfMeasureGrouping
                  >(
                    unitOfMeasureGrouping.errors,
                    nameof(unitOfMeasureGrouping.unitOfMeasureId),
                  )}
                  help={unitOfMeasureGrouping.errors?.unitOfMeasure}
                >
                  <span className="label-input ml-3">
                    {translate('unitOfMeasureGroupings.unitOfMeasure')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={unitOfMeasureGrouping.unitOfMeasure?.id}
                    onChange={handleChangeUnitOfMeasure}
                    getList={
                      unitOfMeasureGroupingRepository.singleListUnitOfMeasure
                    }
                    list={defaultUnitOfMeasureList}
                    modelFilter={unitOfMeasureFilter}
                    setModelFilter={setUnitOfMeasureFilter}
                    searchField={nameof(unitOfMeasureFilter.name)}
                    searchType={nameof(unitOfMeasureFilter.name.contain)}
                    placeholder={translate(
                      'unitOfMeasureGroupings.placeholder.unitOfMeasure',
                    )}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    UnitOfMeasureGrouping
                  >(
                    unitOfMeasureGrouping.errors,
                    nameof(unitOfMeasureGrouping.description),
                  )}
                  help={unitOfMeasureGrouping.errors?.description}
                >
                  <span className="label-input ml-3">
                    {translate('unitOfMeasureGroupings.description')}
                  </span>
                  <input
                    type="text"
                    defaultValue={unitOfMeasureGrouping.description}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(unitOfMeasureGrouping.description),
                    )}
                    placeholder={translate(
                      'unitOfMeasureGroupings.placeholder.description',
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                <FormItem className="mb-3">
                  <span className="label-input ml-3 mr-3">
                    {translate('unitOfMeasureGroupings.status')}
                  </span>
                  <Switch
                    checked={
                      unitOfMeasureGrouping.statusId === 1 ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(unitOfMeasureGrouping.status),
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          {unitOfMeasureGrouping.unitOfMeasureId !== undefined && (
            <div className="info-title ml-3 mt-3">
              {translate('unitOfMeasureGroupingContents.title')}
            </div>
          )}
          {unitOfMeasureGrouping.unitOfMeasureId !== undefined && (
            <UnitOfMeasureGroupingContentTable
              model={unitOfMeasureGrouping}
              setModel={setUnitOfMeasureGrouping}
              field={nameof(
                unitOfMeasureGrouping.unitOfMeasureGroupingContents,
              )}
              filter={unitOfMeasureChangeFilter}
              setFilter={setUnitOfMeasureChangeFilter}
            />
          )}
        </Card>
      </Spin>
    </div>
  );
}

export default UnitOfMeasureGroupingDetail;
