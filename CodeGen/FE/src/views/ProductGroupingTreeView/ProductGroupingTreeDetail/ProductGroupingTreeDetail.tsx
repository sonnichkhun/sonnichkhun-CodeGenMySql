import { Col } from 'antd';
import Form from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { productGroupingRepository } from 'views/ProductGroupingTreeView/ProductGroupingRepository';
import TreeSelectDropdown from '../../../components/TreeSelect/TreeSelect';

export interface ProductGroupingDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListGroup?: (filter: TFilter) => Promise<T[]>;
  setListGroup?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  isPreview?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function ProductGroupingTreeDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: ProductGroupingDetailProps<T, TFilter>) {
  const {
    isDetail,
    isPreview,
    currentItem,
    visible,
    setVisible,
    getListGroup,
    setListGroup,
    setLoadList,
  } = props;

  const [translate] = useTranslation();

  const [
    productGrouping,
    setproductGrouping,
    ,
    ,
    handleSave,
  ] = crudService.usePopupDetail(
    ProductGrouping,
    ProductGroupingFilter,
    isDetail,
    currentItem,
    setVisible,
    productGroupingRepository.get,
    productGroupingRepository.save,
    getListGroup,
    setListGroup,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<ProductGrouping>(
    productGrouping,
    setproductGrouping,
  );

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());


  React.useEffect(() => {
    let parentId: number = null;
    if (productGrouping.parentId === undefined) {
      if (props.currentItem) {
        parentId = props.currentItem?.id;
        setproductGrouping({
          ...productGrouping,
          parentId,
        });
        handleChangeSimpleField(nameof(productGrouping.parentId));
      }
    }
  }, [
    handleChangeSimpleField,
    productGrouping,
    props.currentItem,
    setproductGrouping,
  ]);

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  return (
    <>
      <Modal
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail"
      >
        <ModalHeader>
          {props.currentItem === null
            ? translate('productGrouping.detail.addNode')
            : translate('productGrouping.detail.addNode', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Col>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('productGrouping.code')}
                  <span className="text-danger">*</span>:{' '}
                </span>
                <input
                  type="text"
                  defaultValue={productGrouping.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(
                    nameof(productGrouping.code),
                  )}
                  disabled={isPreview}
                />
              </FormItem>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('productGrouping.name')}
                  <span className="text-danger">*</span>:{' '}
                </span>
                <input
                  type="text"
                  defaultValue={productGrouping.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(
                    nameof(productGrouping.name),
                  )}
                  disabled={isPreview}
                />
              </FormItem>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('productGrouping.parentGroup')}:{' '}
                </span>
                <TreeSelectDropdown
                  defaultValue={
                    isDetail
                      ? productGrouping.parent?.id
                      : props?.currentItem?.id
                  }
                  value={productGrouping.parent?.id}
                  mode="single"
                  onChange={handleChangeObjectField(
                    nameof(productGrouping.parent),
                  )}
                  modelFilter={productGroupingFilter}
                  setModelFilter={setProductGroupingFilter}
                  getList={productGroupingRepository.singleListProductGrouping}
                  searchField={nameof(productGroupingFilter.id)}
                  disabled={isPreview}
                />
              </FormItem>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('productGrouping.description')}:{' '}
                </span>
                <input
                  type="text"
                  defaultValue={productGrouping.description}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(
                    nameof(productGrouping.description),
                  )}
                  disabled={isPreview}
                />
              </FormItem>
            </Col>
            <div className="d-flex justify-content-end mt-4 mr-3">
              {!isPreview && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}

              <button
                className="btn btn-sm btn-outline-secondary ml-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ProductGroupingTreeDetail;
