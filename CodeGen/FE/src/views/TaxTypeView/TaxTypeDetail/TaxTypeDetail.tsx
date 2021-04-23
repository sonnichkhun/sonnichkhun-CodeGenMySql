import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Status } from 'models/Status';
import { TaxType } from 'models/TaxType';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { taxTypeRepository } from 'views/TaxTypeView/TaxTypeRepository';
import './TaxTypeDetail.scss';

const { Item: FormItem } = Form;

function TaxTypeDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    taxType,
    setTaxType,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    TaxType,
    taxTypeRepository.get,
    taxTypeRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<TaxType>(taxType, setTaxType);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    taxTypeRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="page detail-page">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('taxTypes.detail.title')
                : translate(generalLanguageKeys.actions.create)}
            </>
          }
        >
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
          <Form {...defaultDetailFormLayout}>
            <FormItem
              label={translate('taxTypes.code')}
              validateStatus={formService.getValidationStatus<TaxType>(
                taxType.errors,
                nameof(taxType.code),
              )}
              help={taxType.errors?.code}
            >
              <input
                type="text"
                defaultValue={taxType.code}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(taxType.code))}
              />
            </FormItem>

            <FormItem
              label={translate('taxTypes.name')}
              validateStatus={formService.getValidationStatus<TaxType>(
                taxType.errors,
                nameof(taxType.name),
              )}
              help={taxType.errors?.name}
            >
              <input
                type="text"
                defaultValue={taxType.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(taxType.name))}
              />
            </FormItem>

            <FormItem
              label={translate('taxTypes.status')}
              validateStatus={formService.getValidationStatus<TaxType>(
                taxType.errors,
                nameof(taxType.status),
              )}
              help={taxType.errors?.status}
            >
              <Select
                value={taxType.status?.id}
                onChange={handleChangeObjectField(nameof(taxType.status))}
                list={statusList}
              />
            </FormItem>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
        </Card>
        <Card className="mt-2">
          <Tabs defaultActiveKey="1"></Tabs>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export default TaxTypeDetail;
