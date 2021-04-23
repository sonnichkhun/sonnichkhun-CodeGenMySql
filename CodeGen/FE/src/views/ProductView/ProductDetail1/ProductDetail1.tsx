import React from 'react';

import Form from 'antd/lib/form';
import Tabs from 'antd/lib/tabs';
import { useTranslation } from 'react-i18next';
import { routerService, crudService, formService } from 'core/services';
import { Product } from 'models/Product';
import { productRepository } from '../ProductRepository';
import { Spin, Card, Switch } from 'antd';
import { generalLanguageKeys } from 'config/consts';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import nameof from 'ts-nameof.macro';
import Select from 'components/Select/Select';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductType } from 'models/ProductType';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { SupplierFilter } from 'models/SupplierFilter';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Supplier } from 'models/Supplier';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
// import RichTextEditor from 'components/RichTextEditor/RichTextEditor';
import ImageUpload from 'components/ImageUpload/ImageUpload';
// import classNames from 'classnames';
import { Image } from 'models/Image';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { ProductProductGroupingMappings } from 'models/ProductProductGroupingMappings';
import { ProductProductGroupingMappingsFilter } from 'models/ProductProductGroupingMappingsFilter';
import TreePopup from 'components/TreePopup/TreePopup';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;

function ProductDetail1() {
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

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    // handleChangeDateField,
  ] = crudService.useChangeHandlers<Product>(product, setProduct);

  // Filter
  const [
    productProductGroupingMappingsFilter,
    setProductProductGroupingMappingsFilter,
  ] = React.useState<ProductProductGroupingMappingsFilter>(
    new ProductProductGroupingMappingsFilter(),
  );

  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());

  const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
    new SupplierFilter(),
  );

  // const [taxTypeFilter, setTaxTypeFilter] = React.useState<TaxTypeFilter>(new TaxTypeFilter());

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );
  ///////

  const defaultProductProductGroupingMappingsList: ProductProductGroupingMappings[] = crudService.useDefaultList<
    ProductProductGroupingMappings
  >(product.productProductGroupingMappings);

  const defaultProductTypeList: ProductType[] = crudService.useDefaultList<
    ProductType
  >(product.productType);

  const defaultUnitOfMeasureList: UnitOfMeasure[] = crudService.useDefaultList<
    UnitOfMeasure
  >(product.unitOfMeasure);

  const defaultSupplierList: Supplier[] = crudService.useDefaultList<Supplier>(
    product.supplier,
  );

  const defaultBrandList: Brand[] = crudService.useDefaultList<Brand>(
    product.brand,
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const [
    productProductGroupingMappings,
    setProductProductGroupingMappings,
  ] = React.useState<ProductGrouping[]>([]);

  // const handleChangeStatus = React.useCallback(
  //   (checked: boolean) => {
  //     const isActive: boolean = checked;
  //     setProduct({
  //       ...product,
  //       isActive,
  //     });

  //   },
  //   [setProduct],
  // );

  function handleChangeStatus(checked: boolean) {
    const isActive: boolean = checked;
    setProduct({
      ...product,
      isActive,
    });
  }

  // const statusDisplay: string = React.useMemo(
  //   () => {
  //     if (statusList) {
  //       const status: ProductStatus = statusList.find((status: ProductStatus) => status.id === product.statusId);
  //       if (status) {
  //         return status.name;
  //       }
  //     }
  //     return null;
  //   },
  //   [],
  // );

  const handleChangeImages = React.useCallback(
    (images: Image[]) => {
      setProduct({
        ...product,
        images,
      });
    },
    [setProduct, product],
  );

  const handleFocus = React.useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleChangeTreePopup = React.useCallback(
    items => {
      setVisible(false);
      // product.productProductGroupingMappings = Object.assign([]);
      setProductProductGroupingMappings(items);
      const productProductGroupingMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          productProductGroupingMappings.push({ productGroupingId: item.id });
        });
      }
      setProduct({
        ...product,
        productProductGroupingMappings,
      });
    },
    [setVisible, setProductProductGroupingMappings, setProduct, product],
  );

  React.useEffect(() => {
    const listPorductGrouping = [];
    if (
      product.productProductGroupingMappings &&
      product.productProductGroupingMappings.length > 0
    ) {
      product.productProductGroupingMappings.map(
        (productGrouping: ProductProductGroupingMappings) => {
          listPorductGrouping.push(productGrouping.productGrouping);
        },
      );
      setProductProductGroupingMappings(listPorductGrouping);
    }
  }, [setProductProductGroupingMappings]);

  const renderItems = React.useCallback(node => {
    if (node && node.children && node.children.length > 0) {
      return (
        <div className="tree-node d-flex" key={node?.id}>
          {node?.children?.length > 0 &&
            node.children.map(subNode => {
              return renderItems(subNode);
            })}
        </div>
      );
    } else {
      return (
        <div className="tree-node" key={node?.id}>
          {node?.name},
        </div>
      );
    }
  }, []);

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
                className="btn btn-sm btn-primary float-right"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
            </>
          }
        >
          <Tabs defaultActiveKey="1" className="mt-1">
            <TabPane key="1" tab={translate('product.tabs.general.title')}>
              <Form {...defaultDetailFormLayout}>
                <div className="row product-detail mt-5">
                  <div className="col-6">
                    <FormItem
                      label={translate('products.name')}
                      validateStatus={formService.getValidationStatus<Product>(
                        product.errors,
                        nameof(product.name),
                      )}
                      help={product.errors?.name}
                    >
                      <input
                        type="text"
                        defaultValue={product.name}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(nameof(product.name))}
                      />
                    </FormItem>

                    <FormItem
                      label={translate('products.code')}
                      validateStatus={formService.getValidationStatus<Product>(
                        product.errors,
                        nameof(product.code),
                      )}
                      help={product.errors?.code}
                    >
                      <input
                        type="text"
                        defaultValue={product.code}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(nameof(product.code))}
                      />
                    </FormItem>
                    <FormItem label={translate('products.productGrouping')}>
                      <div className="product-grouping d-flex">
                        {productProductGroupingMappings &&
                          productProductGroupingMappings.length > 0 &&
                          productProductGroupingMappings.map(productGroping => {
                            return renderItems(productGroping);
                          })}
                        {product.productProductGroupingMappings &&
                          product.productProductGroupingMappings?.length > 0 &&
                          productProductGroupingMappings.map(
                            (productGrouping, index) => {
                              return (
                                <div key={index}>
                                  {productGrouping?.productGrouping &&
                                    productGrouping?.productGrouping?.name}
                                </div>
                              );
                            },
                          )}
                      </div>
                      <input
                        type="text"
                        // defaultValue={product.productProductGroupingMappings}
                        className="form-control form-control-sm"
                        onClick={handleFocus}
                      />
                      <TreePopup
                        onChange={handleChangeTreePopup}
                        getList={productRepository.singleListProductGrouping}
                        list={defaultProductProductGroupingMappingsList}
                        modelFilter={productProductGroupingMappingsFilter}
                        setModelFilter={setProductProductGroupingMappingsFilter}
                        searchField={nameof(
                          productProductGroupingMappingsFilter.productId,
                        )}
                        selectedItems={productProductGroupingMappings}
                        visible={visible}
                        onClose={handlePopupCancel}
                      />
                    </FormItem>
                    <Form.Item label={translate('productDetail.status')}>
                      <div className="product-status">
                        <Switch
                          checked={product.isActive === true}
                          onChange={handleChangeStatus}
                        />
                        {/* <span className={classNames('status-display', { active: product.isActive === true, inactive: product.isActive === false })}>
                          {statusDisplay}
                        </span> */}
                      </div>
                    </Form.Item>

                    <FormItem label={translate('products.productType')}>
                      <Select
                        value={product.productType?.id}
                        onChange={handleChangeObjectField(
                          nameof(product.productType),
                        )}
                        getList={productRepository.singleListProductType}
                        list={defaultProductTypeList}
                        modelFilter={productTypeFilter}
                        setModelFilter={setProductTypeFilter}
                        searchField={nameof(productTypeFilter.id)}
                      />
                    </FormItem>

                    <FormItem label={translate('products.unitOfMeasure')}>
                      <Select
                        value={product.unitOfMeasure?.id}
                        onChange={handleChangeObjectField(
                          nameof(product.unitOfMeasure),
                        )}
                        getList={productRepository.singleListUnitOfMeasure}
                        list={defaultUnitOfMeasureList}
                        modelFilter={unitOfMeasureFilter}
                        setModelFilter={setUnitOfMeasureFilter}
                        searchField={nameof(unitOfMeasureFilter.id)}
                      />
                    </FormItem>

                    <FormItem label={translate('products.supplier')}>
                      <Select
                        value={product.supplier?.id}
                        onChange={handleChangeObjectField(
                          nameof(product.supplier),
                        )}
                        getList={productRepository.singleListSupplier}
                        list={defaultSupplierList}
                        modelFilter={supplierFilter}
                        setModelFilter={setSupplierFilter}
                        searchField={nameof(supplierFilter.id)}
                      />
                    </FormItem>
                    <FormItem
                      label={translate('products.scanCode')}
                      validateStatus={formService.getValidationStatus<Product>(
                        product.errors,
                        nameof(product.scanCode),
                      )}
                      help={product.errors?.scanCode}
                    >
                      <input
                        type="text"
                        defaultValue={product.scanCode}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(product.scanCode),
                        )}
                      />
                    </FormItem>

                    <FormItem label={translate('products.brand')}>
                      <Select
                        value={product.brand?.id}
                        onChange={handleChangeObjectField(
                          nameof(product.brand),
                        )}
                        getList={productRepository.singleListBrand}
                        list={defaultBrandList}
                        modelFilter={brandFilter}
                        setModelFilter={setBrandFilter}
                        searchField={nameof(brandFilter.id)}
                      />
                    </FormItem>
                  </div>
                  <div className="col-6">
                    <div className="product-image">
                      {/* <ImageUpload /> */}
                      <Form.Item label={translate('productDetail.images')}>
                        <ImageUpload
                          defaultItems={product.images}
                          limit={15}
                          aspectRatio={1}
                          onUpload={productRepository.uploadImage}
                          onChange={handleChangeImages}
                          // action="/api/product/product-detail/upload-image"
                        />
                      </Form.Item>
                    </div>
                    {/* <div className="product-editor">
                      <label>{translate('products.description')}</label>
                      <RichTextEditor
                        className="text-editor"
                        value={product.description}
                        onChange={handleChangeSimpleField(nameof(product.description))}
                        />
                    </div> */}
                  </div>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </Spin>
    </div>
  );
}

export default ProductDetail1;
