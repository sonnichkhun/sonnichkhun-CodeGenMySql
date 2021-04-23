import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Item } from 'models/Item';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { itemRepository } from 'views/ItemView/ItemRepository';
import './ItemDetail.scss';

const { Item: FormItem } = Form;

function ItemDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    item,
    setItem,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Item, itemRepository.get, itemRepository.save);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Item>(item, setItem);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [productFilter, setProductFilter] = React.useState<ProductFilter>(
    new ProductFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultProductList: Product[] = crudService.useDefaultList<Product>(
    item.product,
  );

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
                ? translate('items.detail.title')
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
              label={translate('items.code')}
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.code),
              )}
              help={item.errors?.code}
            >
              <input
                type="text"
                defaultValue={item.code}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(item.code))}
              />
            </FormItem>

            <FormItem
              label={translate('items.name')}
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.name),
              )}
              help={item.errors?.name}
            >
              <input
                type="text"
                defaultValue={item.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(item.name))}
              />
            </FormItem>

            <FormItem
              label={translate('items.scanCode')}
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.scanCode),
              )}
              help={item.errors?.scanCode}
            >
              <input
                type="text"
                defaultValue={item.scanCode}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(item.scanCode))}
              />
            </FormItem>

            <FormItem
              label={translate('items.product')}
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.product),
              )}
              help={item.errors?.product}
            >
              <Select
                value={item.product?.id}
                onChange={handleChangeObjectField(nameof(item.product))}
                getList={itemRepository.singleListProduct}
                list={defaultProductList}
                modelFilter={productFilter}
                setModelFilter={setProductFilter}
                searchField={nameof(productFilter.id)}
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
          {/* <Tabs defaultActiveKey="1">

          </Tabs> */}
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

export default ItemDetail;
