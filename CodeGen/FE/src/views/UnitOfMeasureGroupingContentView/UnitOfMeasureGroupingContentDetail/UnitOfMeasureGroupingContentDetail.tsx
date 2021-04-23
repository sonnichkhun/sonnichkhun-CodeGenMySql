import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingContent } from 'models/UnitOfMeasureGroupingContent';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { unitOfMeasureGroupingContentRepository } from 'views/UnitOfMeasureGroupingContentView/UnitOfMeasureGroupingContentRepository';
import './UnitOfMeasureGroupingContentDetail.scss';

const { Item: FormItem } = Form;

function UnitOfMeasureGroupingContentDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    unitOfMeasureGroupingContent,
    setUnitOfMeasureGroupingContent,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    UnitOfMeasureGroupingContent,
    unitOfMeasureGroupingContentRepository.get,
    unitOfMeasureGroupingContentRepository.save,
  );

  const [, handleChangeObjectField] = crudService.useChangeHandlers<
    UnitOfMeasureGroupingContent
  >(unitOfMeasureGroupingContent, setUnitOfMeasureGroupingContent);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [
    unitOfMeasureGroupingFilter,
    setUnitOfMeasureGroupingFilter,
  ] = React.useState<UnitOfMeasureGroupingFilter>(
    new UnitOfMeasureGroupingFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultUnitOfMeasureList: UnitOfMeasure[] = crudService.useDefaultList<
    UnitOfMeasure
  >(unitOfMeasureGroupingContent.unitOfMeasure);

  const defaultUnitOfMeasureGroupingList: UnitOfMeasureGrouping[] = crudService.useDefaultList<
    UnitOfMeasureGrouping
  >(unitOfMeasureGroupingContent.unitOfMeasureGrouping);

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
                ? translate('unitOfMeasureGroupingContents.detail.title')
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
              label={translate('unitOfMeasureGroupingContents.unitOfMeasure')}
              validateStatus={formService.getValidationStatus<
                UnitOfMeasureGroupingContent
              >(
                unitOfMeasureGroupingContent.errors,
                nameof(unitOfMeasureGroupingContent.unitOfMeasure),
              )}
              help={unitOfMeasureGroupingContent.errors?.unitOfMeasure}
            >
              <Select
                value={unitOfMeasureGroupingContent.unitOfMeasure?.id}
                onChange={handleChangeObjectField(
                  nameof(unitOfMeasureGroupingContent.unitOfMeasure),
                )}
                getList={
                  unitOfMeasureGroupingContentRepository.singleListUnitOfMeasure
                }
                list={defaultUnitOfMeasureList}
                modelFilter={unitOfMeasureFilter}
                setModelFilter={setUnitOfMeasureFilter}
                searchField={nameof(unitOfMeasureFilter.id)}
              />
            </FormItem>

            <FormItem
              label={translate(
                'unitOfMeasureGroupingContents.unitOfMeasureGrouping',
              )}
              validateStatus={formService.getValidationStatus<
                UnitOfMeasureGroupingContent
              >(
                unitOfMeasureGroupingContent.errors,
                nameof(unitOfMeasureGroupingContent.unitOfMeasureGrouping),
              )}
              help={unitOfMeasureGroupingContent.errors?.unitOfMeasureGrouping}
            >
              <Select
                value={unitOfMeasureGroupingContent.unitOfMeasureGrouping?.id}
                onChange={handleChangeObjectField(
                  nameof(unitOfMeasureGroupingContent.unitOfMeasureGrouping),
                )}
                getList={
                  unitOfMeasureGroupingContentRepository.singleListUnitOfMeasureGrouping
                }
                list={defaultUnitOfMeasureGroupingList}
                modelFilter={unitOfMeasureGroupingFilter}
                setModelFilter={setUnitOfMeasureGroupingFilter}
                searchField={nameof(unitOfMeasureGroupingFilter.id)}
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

export default UnitOfMeasureGroupingContentDetail;
