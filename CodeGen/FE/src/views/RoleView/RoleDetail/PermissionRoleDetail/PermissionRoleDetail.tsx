import { Card, Col, Form, Row, Spin } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import '.././RoleDetail.scss';
import PermissionRoleTable from './PermissionRoleTable';

function PermissionRoleDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    role,
    setRole,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Role, roleRepository.get, roleRepository.save);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [statusList] = crudService.useEnumList<Status>(
    roleRepository.singleListStatus,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Role>(role, setRole);

  return (
    <div className="page detail-page role-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('products.detail.title')
                : translate(generalLanguageKeys.actions.create)}
              <button
                className="btn btn-sm btn-outline-primary float-right "
                onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
              <button
                className="btn btn-sm btn-primary float-right mr-2"
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
              <Col lg={2} />
              <Col lg={11}>
                <FormItem>
                <span className="label-input ml-3">
                  {translate('roles.code')}
                  <span className="text-danger">*</span>
                </span>
                <input
                  type="text"
                  defaultValue={role.code}
                  onChange={handleChangeSimpleField(nameof(role.code))}
                  className="form-control form-control-sm"
                />
              </FormItem>
              <FormItem>
                <span className="label-input ml-3">
                  {translate('roles.name')}
                  <span className="text-danger">*</span>
                </span>
                <input
                  type="text"
                  defaultValue={role.name}
                  onChange={handleChangeSimpleField(nameof(role.name))}
                  className="form-control form-control-sm"
                />
              </FormItem>
            <FormItem>
              <span className="label-input ml-3">
                {translate('roles.status')}
              </span>
              <Switch
                checked={role.statusId === statusList[1]?.id ? true : false}
                list={statusList}
                onChange={handleChangeObjectField(nameof(role.status))}
              />
            </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="info-title ml-3">
            {translate('roles.general.permission')}
          </div>
          <PermissionRoleTable
            role={role}
            setRole={setRole}
            statusList={statusList}
          />
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleSave}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary mr-2"
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

export default PermissionRoleDetail;
