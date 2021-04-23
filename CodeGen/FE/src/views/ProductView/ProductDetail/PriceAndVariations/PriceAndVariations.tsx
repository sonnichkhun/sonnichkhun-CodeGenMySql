import React, { Dispatch, SetStateAction } from 'react';
import './PriceAndVariations.scss';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import Form from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import { productService } from 'views/ProductView/ProductDetail/ProductService';
import InputNumber from 'components/InputNumber/InputNumber';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import { Product } from 'models/Product';
import { VariationGrouping } from 'models/VariationGrouping';
import InputString from 'components/Input/Input';
import InputTag from 'views/ProductView/ProductDetail/PriceAndVariations/InputTag';
import { Item } from 'models/Item';
import nameof from 'ts-nameof.macro';
import { Image } from 'models/Image';
import Modal from 'antd/lib/modal';
import { generalLanguageKeys, generalColumnWidths } from 'config/consts';
import Switch from 'components/Switch/Switch';
import { Status } from 'models/Status';
import { crudService, formService } from 'core/services';
import { productRepository } from 'views/ProductView/ProductRepository';
import { Input } from 'antd';
import './PriceAndVariations.scss';

const { Item: FormItem } = Form;
const { TextArea } = Input;

export interface PriceAndVariations {
  product: Product;

  setProduct: Dispatch<SetStateAction<Product>>;
}

function PriceAndVariations(props: PriceAndVariations) {
  const [translate] = useTranslation();

  const { product, setProduct } = props;
  const [loading, setLoading] = React.useState<boolean>(false);

  const [items, setItems] = crudService.useContentTable<Product, Item>(
    product,
    setProduct,
    nameof(product.items),
  );

  const [
    retailPrice,
    setRetailPrice,
    price,
    setPrice,
    handleAddVariation,
    addable,
    handleChangeVariationGroupingName,
  ] = productService.usePrice(product, setProduct);

  const [
    visible,
    currentVariation,
    currentVariationGrouping,
    handleOpenModal,
    handleCloseModal,
    handleUpdateVariationGrouping,
    handleChangeCurrentVariation,
    getDisplayValue,
    handleCombine,
    handleRemoveVariation,
    handleDeleteItem,
    handleRemoveVariationGrouping,
  ] = productService.useVariationGrouping(
    product,
    setProduct,
    productRepository.save,
    items,
    setItems,
    price,
    retailPrice,
    setLoading,
  );

  const [statusList] = crudService.useEnumList<Status>(
    productRepository.singleListStatus,
  );

  const [
    handleChangeListSimpleField,
    handleChangeListObjectField,
  ] = crudService.useListChangeHandlers<Item>(items, setItems);

  const columns: ColumnProps<Item>[] = React.useMemo(() => {
    return [
      {
        title: translate('items.status'),
        key: nameof(product.items[0].key),
        dataIndex: nameof(product.items[0].status),
        align: 'center',
        render(...[, item, index]) {
          return (
            <>
              {statusList.length > 0 && (
                <Switch
                  checked={item.statusId === statusList[1]?.id ? true : false}
                  list={statusList}
                  onChange={handleChangeListObjectField(
                    nameof(item.status),
                    index,
                  )}
                />
              )}
            </>
          );
        },
      },
      {
        title: translate('items.name'),
        key: nameof(product.items[0].name),
        dataIndex: nameof(product.items[0].name),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.name),
              )}
              help={item.errors?.name}
            >
              <TextArea
                rows={2}
                defaultValue={item.name}
                onChange={handleChangeListSimpleField(nameof(item.name), index)}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.code'),
        key: nameof(product.items[0].code),
        dataIndex: nameof(product.items[0].code),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.code),
              )}
              help={item.errors?.code}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(item.code)}
                defaultValue={item.code}
                onChange={handleChangeListSimpleField(nameof(item.code), index)}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.scanCode'),
        key: nameof(product.items[0].scanCode),
        dataIndex: nameof(product.items[0].scanCode),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.scanCode),
              )}
              help={item.errors?.scanCode}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(item.scanCode)}
                defaultValue={item.scanCode}
                onChange={handleChangeListSimpleField(
                  nameof(item.scanCode),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.price'),
        key: nameof(product.items[0].salePrice),
        dataIndex: nameof(product.items[0].salePrice),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.salePrice),
              )}
              help={item.errors?.salePrice}
            >
              <InputNumber
                className="form-control form-control-sm"
                value={item.salePrice}
                onChange={handleChangeListSimpleField(
                  nameof(item.salePrice),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.retailPrice'),
        key: nameof(product.items[0].retailPrice),
        dataIndex: nameof(product.items[0].retailPrice),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.retailPrice),
              )}
              help={item.errors?.retailPrice}
            >
              <InputNumber
                className="form-control form-control-sm"
                value={item.retailPrice}
                onChange={handleChangeListSimpleField(
                  nameof(item.retailPrice),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [Item, Item, number]) {
          return (
            <>
              <button
                className="btn btn-link mr-2"
                onClick={handleDeleteItem(params[2])}
                disabled={params[1].canDelete ? false : true}
              >
                <i className="fa fa-trash text-danger" />
              </button>
            </>
          );
        },
      },
    ];
  }, [
    handleChangeListObjectField,
    handleChangeListSimpleField,
    handleDeleteItem,
    product.items,
    statusList,
    translate,
  ]);

  const imageTableColumns: ColumnProps<any>[] = React.useMemo(() => {
    return [
      {
        title: translate('items.name'),
        key: nameof(product.items[0].name),
        dataIndex: nameof(product.items[0].name),
      },
      {
        title: translate('items.images'),
        key: nameof(product.items[0].images),
        dataIndex: nameof(product.items[0].images),
        render(images: Image[]) {
          return JSON.stringify(images);
        },
      },
    ];
  }, [product.items, translate]);

  return (
    <div className="price-and-variations">
      <Modal
        visible={visible}
        destroyOnClose={true}
        onOk={handleUpdateVariationGrouping}
        onCancel={handleCloseModal}
      >
        <Form {...defaultDetailFormLayout}>
          <FormItem label={translate('variations.code')}>
            <InputString
              value={currentVariation?.code}
              onChange={handleChangeCurrentVariation(
                nameof(currentVariationGrouping.code),
              )}
            />
          </FormItem>
          <FormItem label={translate('variations.name')}>
            <InputString
              value={currentVariation?.name}
              onChange={handleChangeCurrentVariation(
                nameof(currentVariationGrouping.name),
              )}
            />
          </FormItem>
        </Form>
      </Modal>
      <Row>
        <Col xs={24} md={8}>
          <Form {...defaultDetailFormLayout}>
            <FormItem label={translate('products.price')}>
              <InputNumber defaultValue={price} onChange={setPrice} />
            </FormItem>
            <FormItem label={translate('products.retailPrice')}>
              <InputNumber
                defaultValue={retailPrice}
                onChange={setRetailPrice}
              />
            </FormItem>
          </Form>
        </Col>
        <Col xs={24} md={16}>
          {product?.variationGroupings &&
            product?.variationGroupings.length > 0 && (
              <ul className="variations">
                {product?.variationGroupings?.map(
                  (variationGrouping: VariationGrouping, index: number) => {
                    return (
                      <li
                        className="ant-row ant-form-item variation"
                        key={index}
                      >
                        <div className="name">
                          <span className="label">
                            {translate('products.variationGrouping')}
                          </span>
                          <InputString
                            className="flex-grow-1"
                            value={variationGrouping.name}
                            onChange={handleChangeVariationGroupingName(index)}
                          />
                        </div>
                        <div className="value">
                          <span className="label">
                            {translate('products.variationValue')}
                          </span>
                          <InputTag
                            max={4}
                            value={getDisplayValue(index)}
                            onClick={handleOpenModal(index)}
                            onRemoveVariationGrouping={handleRemoveVariationGrouping(
                              index,
                            )}
                            onRemoveVariation={handleRemoveVariation(index)}
                          />
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            )}

          <div className="btn-add">
            {addable && (
              <button
                className="btn btn-sm btn-primary  mt-1"
                onClick={handleAddVariation}
              >
                <img
                  className="btn-icon mr-2"
                  src="/assets/icons/baseline-add-24px.svg"
                  alt=""
                />
                {translate('products.addVariation')}
              </button>
            )}
          </div>
          <div>
            <button
              className="btn btn-sm btn-primary  mt-1"
              onClick={handleCombine}
            >
              <img
                className="btn-icon mr-2"
                src="/assets/icons/baseline-history-24px.svg"
                alt=""
              />
              {translate('products.createVariations')}
            </button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          <Table
            tableLayout="fixed"
            columns={columns}
            dataSource={items}
            pagination={false}
            rowKey={nameof(items[0].key)}
            loading={loading}
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Table
            tableLayout="fixed"
            columns={imageTableColumns}
            dataSource={product.items}
            pagination={false}
            rowKey={nameof(product.items[0].key)}
          />
        </Col>
      </Row>
    </div>
  );
}

export default PriceAndVariations;
