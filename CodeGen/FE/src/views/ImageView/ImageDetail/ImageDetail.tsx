import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Image } from 'models/Image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { imageRepository } from 'views/ImageView/ImageRepository';
import './ImageDetail.scss';

const { Item: FormItem } = Form;

function ImageDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    image,
    setImage,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Image, imageRepository.get, imageRepository.save);

  const [handleChangeSimpleField] = crudService.useChangeHandlers<Image>(
    image,
    setImage,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

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
                ? translate('images.detail.title')
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
              label={translate('images.name')}
              validateStatus={formService.getValidationStatus<Image>(
                image.errors,
                nameof(image.name),
              )}
              help={image.errors?.name}
            >
              <input
                type="text"
                defaultValue={image.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(image.name))}
              />
            </FormItem>

            <FormItem
              label={translate('images.url')}
              validateStatus={formService.getValidationStatus<Image>(
                image.errors,
                nameof(image.url),
              )}
              help={image.errors?.url}
            >
              <input
                type="text"
                defaultValue={image.url}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(image.url))}
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

export default ImageDetail;
