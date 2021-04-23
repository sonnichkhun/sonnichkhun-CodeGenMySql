import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { Product } from 'models/Product';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PriceAndVariations from 'views/ProductView/ProductDetail/PriceAndVariations/PriceAndVariations';
import { productRepository } from 'views/ProductView/ProductRepository';
import './ProductDetail.scss';
import ProductDetailGeneral from './ProductDetailGeneral/ProductDetailGeneral';

const { TabPane } = Tabs;
function ProductDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    product,
    setProduct,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Product,
    productRepository.get,
    productRepository.save,
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
          <Tabs defaultActiveKey="1">
            <TabPane key="1" tab={translate('products.general')}>
              <ProductDetailGeneral product={product} setProduct={setProduct} />
            </TabPane>
            <TabPane key="2" tab={translate('products.variationsAndPrice')}>
              <PriceAndVariations product={product} setProduct={setProduct} />
            </TabPane>
          </Tabs>
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

export default ProductDetail;
