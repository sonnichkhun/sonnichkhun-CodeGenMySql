import { Col, Input, Row } from 'antd';
import Form from 'antd/lib/form';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { crudService, formService } from 'core/services';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { Image } from 'models/Image';
import { Product } from 'models/Product';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductImageMapping } from 'models/ProductImageMapping';
import { ProductProductGroupingMappings } from 'models/ProductProductGroupingMappings';
import { ProductProductGroupingMappingsFilter } from 'models/ProductProductGroupingMappingsFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Status } from 'models/Status';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingContent } from 'models/UnitOfMeasureGroupingContent';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { productRepository } from '../../ProductRepository';
import ProductProductGroupingMappingTable from '../ProductProductGroupingMappingTable/ProductProductGroupingMappingTable';
import './ProductDetailGeneral.scss';

const { Item: FormItem } = Form;
const { TextArea } = Input;

export interface ProductDetailGeneralProps {
  product: Product;
  setProduct: Dispatch<SetStateAction<Product>>;
}

function ProductDetailGeneral(props: ProductDetailGeneralProps) {
  const { product, setProduct } = props;
  const [translate] = useTranslation();

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    // handleChangeDateField,
  ] = crudService.useChangeHandlers<Product>(product, setProduct);

  const [
    productProductGroupingMappingsFilter,
    setProductProductGroupingMappingsFilter,
  ] = React.useState<ProductProductGroupingMappingsFilter>(
    new ProductProductGroupingMappingsFilter(),
  );

  const [statusList] = crudService.useEnumList<Status>(
    productRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------
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

  const [
    unitOfMeasureGroupingFilter,
    setUnitOfMeasureGroupingFilter,
  ] = React.useState<UnitOfMeasureGroupingFilter>(
    new UnitOfMeasureGroupingFilter(),
  );

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultProductProductGroupingMappingsList: ProductProductGroupingMappings[] = crudService.useDefaultList<
    ProductProductGroupingMappings
  >(product.productProductGroupingMappings);

  const defaultProductTypeList: ProductType[] = crudService.useDefaultList<
    ProductType
  >(product.productType);

  const defaultUnitOfMeasureList: UnitOfMeasure[] = crudService.useDefaultList<
    UnitOfMeasure
  >(product.unitOfMeasure);

  const defaultUnitOfMeasureGroupingList: UnitOfMeasureGrouping[] = crudService.useDefaultList<
    UnitOfMeasureGrouping
  >(product.unitOfMeasureGrouping);

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

  const [productImageMappings, setProductImageMappings] = React.useState<
    Image[]
  >([]);

  const handleFocus = React.useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleChangeTreePopup = React.useCallback(
    items => {
      setVisible(false);
      setProductProductGroupingMappings(items);
      const productProductGroupingMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          productProductGroupingMappings.push({
            productGrouping: item,
            productGroupingId: item.id,
          });
        });
      }
      setProduct({
        ...product,
        productProductGroupingMappings,
      });
    },
    [setVisible, setProductProductGroupingMappings, setProduct, product],
  );

  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      setProductImageMappings(items);
      const productImageMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          productImageMappings.push({
            image: item,
            imageId: item.id,
          });
        });
      }
      setProduct({
        ...product,
        productImageMappings,
      });
    },
    [setProduct, product],
  );

  React.useEffect(() => {
    if (product.unitOfMeasureId) {
      const newFilter = new UnitOfMeasureGroupingFilter();
      newFilter.unitOfMeasureId.equal = product.unitOfMeasureId;
      setUnitOfMeasureGroupingFilter({ ...newFilter });
    }
  }, [product.unitOfMeasureId]);
  React.useEffect(() => {
    const listPorductGrouping = [];
    if (
      product.productProductGroupingMappings &&
      product.productProductGroupingMappings.length > 0
    ) {
      product.productProductGroupingMappings.map(
        (productGrouping: ProductProductGroupingMappings) => {
          return listPorductGrouping.push(productGrouping.productGrouping);
        },
      );
      setProductProductGroupingMappings(listPorductGrouping);
    }
  }, [
    product.productProductGroupingMappings,
    setProductProductGroupingMappings,
  ]);

  React.useEffect(() => {
    const images = [];
    if (
      product.productImageMappings &&
      product.productImageMappings.length > 0
    ) {
      product.productImageMappings.map(
        (productImageMapping: ProductImageMapping) => {
          return images.push(productImageMapping.image);
        },
      );
      setProductImageMappings(images);
    }
  }, [
    product.productImageMappings,
    product.productProductGroupingMappings,
    setProductProductGroupingMappings,
  ]);

  /* set UOMGroupingFilter for UOMGrouping if UOM existed */
  React.useEffect(() => {
    if (product.unitOfMeasureId) {
      const newFilter = new UnitOfMeasureGroupingFilter();
      newFilter.unitOfMeasureId.equal = product.unitOfMeasureId;
      setUnitOfMeasureGroupingFilter({ ...newFilter });
    }
  }, [product.unitOfMeasureId]);

  /* render content for UOMGrouping contents */
  const renderItems = React.useMemo(() => {
    const contentList = [];
    if (product) {
      if (product.unitOfMeasureGrouping) {
        if (
          product.unitOfMeasureGrouping.unitOfMeasureGroupingContents &&
          product.unitOfMeasureGrouping.unitOfMeasureGroupingContents.length > 0
        )
          product.unitOfMeasureGrouping.unitOfMeasureGroupingContents.forEach(
            (content: UnitOfMeasureGroupingContent) => {
              if (content.unitOfMeasure && content.factor) {
                const { unitOfMeasure, factor } = content;
                const value = `${unitOfMeasure.name} (${factor})`;
                contentList.push(value);
              }
            },
          );
      }
    }
    return contentList.join(',');
  }, [product]);

  /* handle Change UOM */

  const handleChangeUnitOfMeasure = React.useCallback(
    (event, item) => {
      const unitOfMeasureId = event;
      const unitOfMeasure = item;
      if (
        unitOfMeasureGroupingFilter.unitOfMeasureId.equal !== unitOfMeasureId
      ) {
        const unitOfMeasureGroupingId = undefined;
        const unitOfMeasureGrouping = undefined;
        setProduct({
          ...product,
          unitOfMeasure,
          unitOfMeasureId,
          unitOfMeasureGroupingId,
          unitOfMeasureGrouping,
        });
      }
      unitOfMeasureGroupingFilter.unitOfMeasureId.equal = unitOfMeasureId;
      setUnitOfMeasureGroupingFilter({ ...unitOfMeasureGroupingFilter });
    },
    [unitOfMeasureGroupingFilter, setProduct, product],
  );

  return (
    <Form>
      <Row>
        <Col lg={11}>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.name),
              )}
              help={product.errors?.Name}
            >
              <span className="label-input ml-3">
                {translate('products.name')}
                <span className="text-danger">*</span>
              </span>
              <input
                type="text"
                defaultValue={product.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.name))}
                placeholder={translate('products.placeholder.name')}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.code),
              )}
              help={product.errors?.Code}
            >
              <span className="label-input ml-3">
                {translate('products.code')}
                <span className="text-danger">*</span>
              </span>
              <input
                type="text"
                defaultValue={product.code}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.code))}
                placeholder={translate('products.placeholder.code')}
              />
            </FormItem>
          </Row>
          <Row>
            <Form.Item
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.status),
              )}
              help={product.errors?.status}
            >
              <span className="label-input ml-3">
                {translate('products.status')}
              </span>
              <Switch
                checked={product.statusId === statusList[1]?.id ? true : false}
                list={statusList}
                onChange={handleChangeObjectField(nameof(product.status))}
              />
            </Form.Item>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.productType),
              )}
              help={product.errors?.code}
            >
              <span className="label-input ml-3">
                {translate('products.productType')}
                <span className="text-danger">*</span>
              </span>
              <SelectAutoComplete
                value={product.productType?.id}
                onChange={handleChangeObjectField(nameof(product.productType))}
                placeholder={translate('products.placeholder.productType')}
                getList={productRepository.singleListProductType}
                modelFilter={productTypeFilter}
                setModelFilter={setProductTypeFilter}
                searchField={nameof(productTypeFilter.name)}
                searchType={nameof(productTypeFilter.name.contain)}
                list={defaultProductTypeList}
                allowClear={true}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              <span className="label-input ml-3">
                {translate('products.unitOfMeasure')}
                <span className="text-danger">*</span>
              </span>
              <SelectAutoComplete
                value={product.unitOfMeasure?.id}
                onChange={handleChangeUnitOfMeasure}
                placeholder={translate('products.placeholder.unitOfMeasure')}
                getList={productRepository.singleListUnitOfMeasure}
                modelFilter={unitOfMeasureFilter}
                setModelFilter={setUnitOfMeasureFilter}
                searchField={nameof(unitOfMeasureFilter.name)}
                searchType={nameof(productTypeFilter.name.contain)}
                list={defaultUnitOfMeasureList}
                allowClear={true}
              />
            </FormItem>
          </Row>

          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.unitOfMeasureGrouping),
              )}
              help={product.errors?.unitOfMeasureGrouping}
            >
              <span className="label-input ml-3">
                {translate('products.unitOfMeasureGrouping')}
              </span>
              <SelectAutoComplete
                value={product.unitOfMeasureGrouping?.id}
                onChange={handleChangeObjectField(
                  nameof(product.unitOfMeasureGrouping),
                )}
                placeholder={translate(
                  'products.placeholder.unitOfMeasureGrouping',
                )}
                getList={productRepository.singleListUnitOfMeasureGrouping}
                modelFilter={unitOfMeasureGroupingFilter}
                setModelFilter={setUnitOfMeasureGroupingFilter}
                searchField={nameof(unitOfMeasureGroupingFilter.name)}
                searchType={nameof(productTypeFilter.name.contain)}
                list={defaultUnitOfMeasureGroupingList}
                allowClear={true}
                disabled={product?.unitOfMeasureId ? false : true}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              <span className="label-input ml-3">
                {translate('products.unitOfMeasureContent')}
              </span>
              <input
                type="text"
                value={renderItems}
                disabled={true}
                className="form-control form-control-sm"
                placeholder={translate(
                  'products.placeholder.unitOfMeasureGroupingContents',
                )}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              <span className="label-input ml-3">
                {translate('products.supplier')}
              </span>
              <SelectAutoComplete
                value={product.supplier?.id}
                onChange={handleChangeObjectField(nameof(product.supplier))}
                placeholder={translate('products.placeholder.supplier')}
                getList={productRepository.singleListSupplier}
                modelFilter={supplierFilter}
                setModelFilter={setSupplierFilter}
                searchField={nameof(supplierFilter.name)}
                searchType={nameof(supplierFilter.name.contain)}
                list={defaultSupplierList}
                allowClear={true}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.erpCode),
              )}
              help={product.errors?.erpCode}
            >
              <span className="label-input ml-3">
                {translate('products.eRPCode')}
              </span>
              <input
                type="text"
                defaultValue={product.erpCode}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.erpCode))}
                placeholder={translate('products.placeholder.eRPCode')}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.scanCode),
              )}
              help={product.errors?.scanCode}
            >
              <span className="label-input ml-3">
                {translate('products.scanCode')}
              </span>
              <input
                type="text"
                defaultValue={product.scanCode}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.scanCode))}
                placeholder={translate('products.placeholder.scanCode')}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              <span className="label-input ml-3">
                {translate('products.brand')}
              </span>
              <SelectAutoComplete
                value={product.brand?.id}
                onChange={handleChangeObjectField(nameof(product.brand))}
                placeholder={translate('products.placeholder.brand')}
                getList={productRepository.singleListBrand}
                modelFilter={brandFilter}
                setModelFilter={setBrandFilter}
                searchField={nameof(brandFilter.name)}
                searchType={nameof(productTypeFilter.name.contain)}
                list={defaultBrandList}
                allowClear={true}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.otherName),
              )}
              help={product.errors?.otherName}
            >
              <span className="label-input ml-3">
                {translate('products.otherName')}
              </span>
              <input
                type="text"
                defaultValue={product.otherName}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.otherName))}
                placeholder={translate('products.placeholder.otherName')}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.technicalName),
              )}
              help={product.errors?.technicalName}
            >
              <span className="label-input ml-3">
                {translate('products.technicalName')}
              </span>
              <input
                type="text"
                defaultValue={product.technicalName}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(
                  nameof(product.technicalName),
                )}
                placeholder={translate('products.placeholder.technicalName')}
              />
            </FormItem>
          </Row>
          <Row></Row>
        </Col>
        <Col lg={2}></Col>
        <Col lg={10}>
          <div className="product-image mb-3">
            <label>{translate('productDetail.images')}</label>
            <ImageUpload
              defaultItems={productImageMappings}
              limit={15}
              aspectRatio={1}
              onUpload={productRepository.uploadImage}
              onChange={handleChangeImages}
            />
          </div>
          <div className="product-editor mb-3">
            <label>{translate('products.description')}</label>
            <TextArea
              rows={4}
              placeholder={translate(`products.placeholder.description`)}
              onChange={handleChangeSimpleField(nameof(product.description))}
            />
          </div>
          <div className="product-grouping mb-3">
            <ProductProductGroupingMappingTable
              product={product}
              list={defaultProductProductGroupingMappingsList}
              modelFilter={productProductGroupingMappingsFilter}
              setModelFilter={setProductProductGroupingMappingsFilter}
              setProduct={setProduct}
              handleClose={handlePopupCancel}
              visible={visible}
              handleChangeTreePopup={handleChangeTreePopup}
              handleFocus={handleFocus}
              selectedItems={productProductGroupingMappings}
              setSelectedItems={setProductProductGroupingMappings}
            />
          </div>
        </Col>
        <Col lg={1}></Col>
      </Row>
      <div className="col-6"></div>
      {/* </div> */}
    </Form>
  );
}

export default ProductDetailGeneral;
