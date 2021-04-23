import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps, PaginationConfig, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Role } from 'models/Role';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';

const {Item: FormItem} = Form;

export interface RoleAppUserMappingModalProps <T extends Model> extends ModalProps {
  title: string;

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[], currentItem) => void;

  currentItem?: Role;

  total: number;

  getList?: (appUserFilter : AppUserFilter) => Promise<AppUser[]>;

  count?: (appUserFilter : AppUserFilter)  => Promise<number>;

  onClose?: (event) => void;

}

function RoleAppUserMappingModal<T extends Model>
(props: RoleAppUserMappingModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    loading,
    list,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    total,
    getList,
    count,
  } = props;

  const rowSelection: TableRowSelection<AppUser> = crudService.useContentModalList<
    T
  >(selectedList, setSelectedList);

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [totalAppUser, setTotal] = React.useState<number>(0);

  const [loadingAppUser, setLoading] = React.useState<boolean>(loading);

  React.useEffect(() => {
    setListAppUser(list);
    setTotal(totalAppUser);
    setLoading(false);
  }, [setListAppUser, setTotal, setLoading, list, totalAppUser]);

  // const handleSearch = React.useCallback(() => {
  //   setLoading(true);
  // }, []);

  const handleChangeFilter = React.useCallback(() => {
    Promise.all([getList(appUserFilter), count(appUserFilter)])
      .then(([listAppUser, totalAppUser]) => {
        setListAppUser(listAppUser);
        setTotal(totalAppUser);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getList, appUserFilter, count]);

  const handleReset = React.useCallback(() => {
    const newFilter = new AppUserFilter();
    setAppUserFilter(newFilter);
    setListAppUser(list);
  }, [list]);

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
        rowSelection.selectedRowKeys = null;
      }
    },
    [props, rowSelection.selectedRowKeys],
  );

  const [pagination] = tableService.useMasterTable(
    appUserFilter,
    setAppUserFilter,
    total,
  );
  const columns: ColumnProps<AppUser>[] = React.useMemo(
    () => {
      return [
        {
          title: translate('roles.appUser.username'),
          key: nameof(list[0].username),
          dataIndex: nameof(list[0].username),
        },
        {
          title: translate('roles.appUser.displayName'),
          key: nameof(list[0].displayName),
          dataIndex: nameof(list[0].displayName),
        },
        {
          title: translate('roles.appUser.phone'),
          key: nameof(list[0].phone),
          dataIndex: nameof(list[0].phone),
        },
        {
          title: translate('roles.appUser.email'),
          key: nameof(list[0].email),
          dataIndex: nameof(list[0].email),
        },
      ];
    },
    [list, translate],
  );
  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.username.contain)}
                    filter={appUserFilter.username}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.username')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.phone.contain)}
                    filter={appUserFilter.phone}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.phone')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.email.contain)}
                    filter={appUserFilter.email}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.email')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              </Row>
              <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.displayName.contain)}
                    filter={appUserFilter.displayName}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.displayName')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
               onClick={handleChangeFilter}
            >
              <i className="fa mr-2 fa-search" />
              {translate(generalLanguageKeys.actions.filter)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleReset}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#ee534d"
                  d="M47.434,46.7c0-.009,0-.018,0-.047,0-.008,0-.017-.007-.046,0-.007,0-.014-.011-.045l-.016-.044-.02-.042-.025-.043-5.088-7.61H55.313L50.49,46.039h1.086l4.956-7.413,0,0,.014-.023.009-.016.011-.024.008-.018.008-.023c0-.007,0-.013.007-.02s0-.014.005-.021,0-.016.006-.024,0-.013,0-.019,0-.018,0-.027,0-.012,0-.019,0-.019,0-.028,0,0,0-.005,0-.01,0-.015,0-.017,0-.025,0-.016,0-.024,0-.014,0-.021,0-.017-.005-.026l0-.018c0-.009-.005-.017-.008-.025a.341.341,0,0,0-.016-.041l-.009-.019-.01-.02-.012-.02-.011-.017-.014-.02-.013-.016-.015-.018-.016-.016L56.458,38l-.021-.018-.009-.008,0,0-.025-.017-.013-.009-.023-.012-.017-.009-.019-.008L56.3,37.9l-.014,0-.029-.008-.011,0-.033-.005h-.01l-.034,0H41.483l-.037,0a.422.422,0,0,0-.3.085.489.489,0,0,0-.1.656l5.5,6.23v6.562c0,.01,0,.02,0,.03s0,.012,0,.018,0,.017,0,.026l0,.022.005.021.007.026.006.017c0,.009.007.019.011.028l0,.005.009.018.005.011c.006.012.013.024.02.035l0,.006.02.029,0,.006a.457.457,0,0,0,.057.06l0,0a.447.447,0,0,0,.06.043l.01.006a.38.38,0,0,0,.048.023l.018.007a.447.447,0,0,0,.05.015l.014,0,.026,0,.014,0,.038,0h0a.434.434,0,0,0,.085-.009h.006l.035-.01.01,0,.031-.012.012-.005.007,0,1.175-.575V52.228l-.917.449V46.7Zm9.53.159-.615-.613-3.074,3.064L50.2,46.247l-.615.613,3.074,3.064-3.074,3.064.615.613,3.074-3.064L56.349,53.6l.615-.613L53.89,49.925Z"
                  transform="translate(-40.964 -37.883)"
                />
              </svg>
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>
        <Table
        key={listAppUser[0]?.id}
        tableLayout="fixed"
        columns={columns}
        dataSource={listAppUser}
        loading={loadingAppUser}
        rowSelection={rowSelection}
        pagination={pagination}
        rowKey={nameof(listAppUser[0].id)}
      />
        </ModalBody>
        <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <div>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onSave(selectedList, currentItem)}
              >
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
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default RoleAppUserMappingModal;