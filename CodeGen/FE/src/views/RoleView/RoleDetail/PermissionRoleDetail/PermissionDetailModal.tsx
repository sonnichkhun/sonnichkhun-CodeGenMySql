import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import FormItem from 'antd/lib/form/FormItem';
import { TableRowSelection } from 'antd/lib/table';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { Field } from 'models/Field';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { Page } from 'models/Page';
import { Permission } from 'models/Permission';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import { PermissionPageMapping } from 'models/PermissionPageMapping';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { menuRepository } from 'views/MenuView/MenuRepository';
import { permissionRepository } from 'views/PermissionView/PermissionRepository';
import PermissionFieldMappingTable from './PermissionFieldMappingTable';
import PermissionPageMappingTable from './PermissionPageMappingTable';

export interface PermissionDetailModalProps extends ModalProps {
  handleAdd?: (permission: Permission) => () => void;
  handleClose?: () => void;
  statusList: Status[];
  currentItem: Permission;
  setCurrentItem: Dispatch<SetStateAction<Permission>>;
}
function PermissionDetailModal(props: PermissionDetailModalProps) {
  const [translate] = useTranslation();
  const {
    isOpen,
    handleAdd,
    toggle,
    handleClose,
    statusList,
    currentItem,
    setCurrentItem,
  } = props;

  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  const [menu, setMenu] = React.useState<Menu>(new Menu());
  const [listPage, setListPage] = React.useState<Page[]>([]);
  const [listField, setListField] = React.useState<Field[]>([]);
  const [loadMapping, setLoadMapping] = React.useState<boolean>(false);

  const [
    permissionPageMappings,
    setPermissionPageMappings,
  ] = crudService.useContentTable<Permission, PermissionPageMapping>(
    currentItem,
    setCurrentItem,
    nameof(currentItem.permissionPageMappings),
  );

  const [
    permissionFieldMappings,
    setPermissionFieldMappings,
  ] = crudService.useContentTable<Permission, PermissionFieldMapping>(
    currentItem,
    setCurrentItem,
    nameof(currentItem.permissionFieldMappings),
  );

  const rowSelection: TableRowSelection<Page> = crudService.useContentModalList<
    Page
  >(permissionPageMappings, setPermissionPageMappings);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Permission>(currentItem, setCurrentItem);

  const defaultMenuList: Menu[] = crudService.useDefaultList<Menu>(
    currentItem.menu,
  );

  const handleChangeMenu = React.useCallback(
    (id: number, item: Menu) => {
      const menuId: number = id;
      const menu: Menu = item;
      setMenu(menu);
      setCurrentItem({
        ...currentItem,
        menuId,
        menu,
      });
      setLoadMapping(true);
    },
    [currentItem, setCurrentItem, setMenu],
  );

  React.useEffect(() => {
    if (currentItem.menu) {
      setMenu(currentItem.menu);
      if(currentItem.menu.pages){
        setListPage(currentItem.menu.pages);
      }
      if(currentItem.menu.fields){
        setListField(currentItem.menu.fields);
      }
    }
  }, [currentItem.menu, menu.fields, menu.pages]);

  React.useEffect(() => {
    if (loadMapping) {
      menuRepository
        .get(menu.id)
        .then((item: Menu) => {
          if (item) {
            if (item.pages && item.pages.length > 0) {
              setListPage(item.pages);
            }
            if (item.fields && item.fields.length > 0) {
              setListField(item.fields);
            }
          }
          setLoadMapping(false);
        })
        .finally(() => {
          setLoadMapping(false);
        });
    }
  }, [loadMapping, menu.id, currentItem]);

  return (
    <>
      <Modal size="xl" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
        <ModalBody>
          <Card
            title={
              <>
                {translate('permissions.detail.title')}
                <button
                  className="btn btn-sm btn-outline-primary float-right "
                  onClick={handleClose}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                <button
                  className="btn btn-sm btn-primary float-right mr-2"
                  onClick={handleAdd(currentItem)}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              </>
            }
          >
            <Form className="form-modal-detail">
              {/* code & name */}
              <Row>
                <Col span={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Permission>(
                      currentItem.errors,
                      nameof(currentItem.code),
                    )}
                    help={currentItem.errors?.code}
                  >
                    <span className="label-input ml-3">
                      {translate('permissions.code')}
                      <span className="text-danger">*</span>
                    </span>
                    <input
                      type="text"
                      defaultValue={currentItem.code}
                      className="form-control form-control-sm"
                      onChange={handleChangeSimpleField(
                        nameof(currentItem.code),
                      )}
                      placeholder={translate('permissions.code')}
                    />
                  </FormItem>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Permission>(
                      currentItem.errors,
                      nameof(currentItem.menu),
                    )}
                    help={currentItem.errors?.menu}
                  >
                    <span className="label-input ml-3">
                      {translate('permissions.menu')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={currentItem.menu?.id}
                      onChange={handleChangeMenu}
                      getList={permissionRepository.singleListMenu}
                      list={defaultMenuList}
                      modelFilter={menuFilter}
                      setModelFilter={setMenuFilter}
                      searchField={nameof(menuFilter.name)}
                      searchType={nameof(menuFilter.name.contain)}
                      allowClear={true}
                      placeholder={translate('permissions.placeholder.menu')}
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col span={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Permission>(
                      currentItem.errors,
                      nameof(currentItem.name),
                    )}
                    help={currentItem.errors?.name}
                  >
                    <span className="label-input ml-3">
                      {translate('permissions.name')}
                      <span className="text-danger">*</span>
                    </span>
                    <input
                      type="text"
                      defaultValue={currentItem.name}
                      className="form-control form-control-sm"
                      onChange={handleChangeSimpleField(
                        nameof(currentItem.name),
                      )}
                      placeholder={translate('permissions.name')}
                    />
                  </FormItem>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Permission>(
                      currentItem.errors,
                      nameof(currentItem.status),
                    )}
                    help={currentItem.errors?.status}
                  >
                    <div className="label-input ml-3">
                      {translate('permissions.status')}
                    </div>
                    <Switch
                      checked={
                        currentItem.statusId === statusList[1]?.id
                          ? true
                          : false
                      }
                      list={statusList}
                      onChange={handleChangeObjectField(
                        nameof(currentItem.status),
                      )}
                    />
                  </FormItem>
                </Col>
              </Row>
              {/* page and field */}
              <Row>
                <Col span={11}>
                  {listPage.length > 0 && (
                    <>
                      <div className="label-input ml-3 mt-3 mb-3">
                        {translate('permissions.page')}
                        <span className="text-danger">*</span>
                      </div>
                      <PermissionPageMappingTable
                        list={listPage}
                        rowSelection={rowSelection}
                      />
                    </>
                  )}
                </Col>
                <Col span={2} />
                <Col span={11}>
                  {listField.length > 0 && (
                    <>
                      <div className="label-input ml-3 mt-3 mb-3">
                        {translate('permissions.field')}
                      </div>
                      <PermissionFieldMappingTable
                        list={listField}
                        selectedItems={permissionFieldMappings}
                        setSelectedItems={setPermissionFieldMappings}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </Form>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
}

export default PermissionDetailModal;
