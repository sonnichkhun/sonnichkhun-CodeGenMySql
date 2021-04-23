import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteType } from 'models/ERouteType';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import './ERouteDetail.scss';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { eRouteRepository } from '../ERouteRepository';
import ERouteContentTable from './ERouteContentTable/ERouteContentTable';

const { Item: FormItem } = Form;

function ERouteDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    eRoute,
    setERoute,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    ERoute,
    eRouteRepository.get,
    eRouteRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeDateField,
  ] = crudService.useChangeHandlers<ERoute>(eRoute, setERoute);

  const [statusList] = crudService.useEnumList<Status>(
    eRouteRepository.singleListStatus,
  );

  const [eRouteTypeList] = crudService.useEnumList<ERouteType>(
    eRouteRepository.singleListErouteType,
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<
    ERouteTypeFilter
  >(new ERouteTypeFilter());

  const defaultAppUserList: AppUser[] = crudService.useDefaultList<AppUser>(
    eRoute.saleEmployee,
  );

  React.useEffect(() => {
    if (!eRoute.requestStateId) {
      setERoute({
        ...eRoute,
        requestStateId: 1,
        appUserId: 40,
        creatorId: 40,
      });
    }
  }, [setERoute, eRoute]);
  return (
    <div className="page detail-page">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail === false
                ? translate(generalLanguageKeys.actions.create)
                : translate('eRoutes.detail.title')}
              {eRoute.requestStateId && eRoute.requestStateId === 1 && (
                <span className="new-state ml-4">
                  {translate(generalLanguageKeys.state.new)}
                </span>
              )}
              {eRoute.requestStateId && eRoute.requestStateId === 2 && (
                <span className="pending-state ml-4">
                  {translate(generalLanguageKeys.state.pending)}
                </span>
              )}
              {eRoute.requestStateId && eRoute.requestStateId === 3 && (
                <span className="approved-state ml-4">
                  {translate(generalLanguageKeys.state.approved)}
                </span>
              )}
              {eRoute.requestStateId && eRoute.requestStateId === 4 && (
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
                className="btn btn-sm btn-primary float-right ml-2"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
              <button
                className="btn btn-sm btn-outline-primary float-right ml-2"
                // onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle"></i>
                {translate(generalLanguageKeys.actions.reject)}
              </button>
              <button
                className="btn btn-sm btn-primary float-right"
                // onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-paper-plane"></i>
                {translate(generalLanguageKeys.actions.approve)}
              </button>
            </>
          }
        >
          <Form>
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.code),
                  )}
                  help={eRoute.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={eRoute.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(eRoute.code))}
                    placeholder={translate('eRoutes.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.saleEmployee),
                  )}
                  help={eRoute.errors?.saleEmployee}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.saleEmployee')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={eRoute.saleEmployee?.id}
                    onChange={handleChangeObjectField(
                      nameof(eRoute.saleEmployee),
                    )}
                    getList={eRouteRepository.singleListAppUser}
                    list={defaultAppUserList}
                    modelFilter={appUserFilter}
                    setModelFilter={setAppUserFilter}
                    searchField={nameof(appUserFilter.id)}
                    searchType={nameof(appUserFilter.displayName.contain)}
                    placeholder={translate('eRoutes.placeholder.saleEmployee')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.startDate),
                  )}
                  help={eRoute.errors?.startDate}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.startDate')}
                  </span>
                  <DatePicker
                    value={
                      typeof eRoute.startDate === 'object'
                        ? eRoute.startDate
                        : null
                    }
                    onChange={handleChangeDateField(nameof(eRoute.startDate))}
                    className="w-100 mr-3"
                    placeholder={translate('eRoutes.placeholder.startDate')}
                  />
                  <span>-</span>
                  <DatePicker
                    value={
                      typeof eRoute.endDate === 'object' ? eRoute.endDate : null
                    }
                    onChange={handleChangeDateField(nameof(eRoute.endDate))}
                    className="w-100 ml-3"
                    placeholder={translate('eRoutes.placeholder.endDate')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.status),
                  )}
                  help={eRoute.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.status')}
                  </span>
                  <Switch
                    checked={
                      eRoute.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(eRoute.status))}
                  />
                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.name),
                  )}
                  help={eRoute.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={eRoute.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(eRoute.name))}
                    placeholder={translate('eRoutes.placeholder.name')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.type),
                  )}
                  help={eRoute.errors?.type}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.eRouteType')}
                  </span>
                  <SelectAutoComplete
                    value={eRoute.eRouteType?.id}
                    onChange={handleChangeObjectField(
                      nameof(eRoute.eRouteType),
                    )}
                    getList={eRouteRepository.singleListErouteType}
                    list={eRouteTypeList}
                    modelFilter={eRouteTypeFilter}
                    setModelFilter={setERouteTypeFilter}
                    searchField={nameof(eRouteTypeFilter.id)}
                    searchType={nameof(eRouteTypeFilter.name.contain)}
                    placeholder={translate('eRoutes.placeholder.eRouteType')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.creator),
                  )}
                  help={eRoute.errors?.creator}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.creator')}
                  </span>
                  <input
                    type="text"
                    value={eRoute.creator?.displayName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(eRoute.creator))}
                    disabled={eRoute.creatorId ? true : false}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="title ml-3">{translate('eRoutes.title.store')}</div>
          <ERouteContentTable eRoute={eRoute} setERoute={setERoute} />

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
        </Card>
      </Spin>
    </div>
  );
}
export default ERouteDetail;
