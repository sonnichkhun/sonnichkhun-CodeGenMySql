import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { Status } from 'models/Status';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { storeTypeRepository } from 'views/StoreTypeView/StoreTypeRepository';
import './StoreTypeDetail.scss';


const { Item: FormItem } = Form;

export interface StoreGroupingDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListStore?: (filter: TFilter) => Promise<T[]>;
  setListStore?: Dispatch<SetStateAction<T[]>>;
  total?: number;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function StoreTypeDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: StoreGroupingDetailProps<T, TFilter>) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListStore,
    setListStore,
    setLoadList,
  } = props;

  const [translate] = useTranslation();

  // Hooks, useDetail, useChangeHandler
  const [
    storeType,
    setStoreType,
    ,
    ,
    handleSave,
  ] = crudService.usePopupDetail(
    StoreType,
    StoreTypeFilter,
    isDetail,
    currentItem,
    setVisible,
    storeTypeRepository.get,
    storeTypeRepository.save,
    getListStore,
    setListStore,
    setLoadList,
  );

  const [handleChangeSimpleField, handleChangeObjectField] = crudService.useChangeHandlers<StoreType>(
    storeType,
    setStoreType,
  );
  const [statusList] = crudService.useEnumList<Status>(
    storeTypeRepository.singleListStatus,
  );

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
      <Modal isOpen={visible} toggle={handleCancel} className="form-modal-detail">
        <ModalHeader>
          {props.currentItem === null
            ? translate('storeTypes.detail.title')
            : translate('storeTypes.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form >
            <Col >
              <FormItem
                className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('storeTypes.code')}
                </span>
                <input
                  type="text"
                  defaultValue={storeType.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(storeType.code))}
                  placeholder={translate('storeTypes.placeholder.code')}
                />
              </FormItem>
            </Col>
            <Col >
              <FormItem
                className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('storeTypes.name')}
                </span>
                <input
                  type="text"
                  defaultValue={storeType.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(storeType.name))}
                  placeholder={translate('storeTypes.placeholder.name')}
                />
              </FormItem>
            </Col>
            <Col >
              <FormItem
                className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('storeTypes.status')}:{' '}
                </span>
                <Switch
                  checked={
                    storeType.statusId === statusList[1]?.id ? true : false
                  }
                  list={statusList}
                  onChange={handleChangeObjectField(nameof(storeType.status))}
                />
              </FormItem>
            </Col>
            <div className="d-flex justify-content-end mt-4 mr-3">
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
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
export default StoreTypeDetail;
