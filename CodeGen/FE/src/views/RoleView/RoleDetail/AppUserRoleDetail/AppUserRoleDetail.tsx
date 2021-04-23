import React from 'react';
import { useTranslation } from 'react-i18next';
import { routerService, crudService } from 'core/services';
import { Role } from 'models/Role';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { Spin, Card, Form, Col, Row } from 'antd';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import FormItem from 'antd/lib/form/FormItem';
import { Status } from 'models/Status';
import AppUserRoleMappingTable from './AppUserRoleMappingTable';
import '.././RoleDetail.scss';
import { notification } from 'helpers/notification';
import { useHistory } from 'react-router';

function AppUserRoleDetail() {
  const [translate] = useTranslation();
  const history = useHistory();
  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [role, setRole, loading, , isDetail] = crudService.useDetail(
    Role,
    roleRepository.get,
    roleRepository.save,
  );

  const handleSave = React.useCallback(() => {
    roleRepository
      .assignAppUser(role)
      .then((t: Role) => {
        setRole(t);
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
        history.goBack();
      })
      .catch((error: Error) => {
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [role, setRole, translate, history]);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    roleRepository.singleListStatus,
  );
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
                className="btn btn-sm btn-outline-primary float-right"
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
                    <span className="text-danger">*</span>:{' '}
                  </span>
                  <input
                    readOnly
                    defaultValue={role.code}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('roles.name')}
                    <span className="text-danger">*</span>:{' '}
                  </span>
                  <input
                    readOnly
                    defaultValue={role.name}
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
                    disabled={true}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>

          <div className="info-title ml-3">
            {translate('roles.general.appUser')}
          </div>
          <AppUserRoleMappingTable role={role} setRole={setRole} />
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

export default AppUserRoleDetail;
