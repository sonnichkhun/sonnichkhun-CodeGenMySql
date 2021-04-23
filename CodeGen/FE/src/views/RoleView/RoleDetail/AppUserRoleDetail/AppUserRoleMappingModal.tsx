import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { tableService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';

export interface AppUserRoleMappingModalProps extends ModalProps {
  loading: boolean;
  modelFilter: AppUserFilter;
  setModelFilter: Dispatch<SetStateAction<AppUserFilter>>;
  rowSelection: TableRowSelection<AppUser>;
  list: AppUser[];
  getList: (filter: AppUserFilter) => Promise<AppUser[]>;
  setList: Dispatch<SetStateAction<AppUser[]>>;
  total: number;
  onClose: () => void;
}

function AppUserRoleMappingModal(props: AppUserRoleMappingModalProps) {
  const [translate] = useTranslation();
  const {
    isOpen,
    toggle,
    onClose,
    list,
    getList,
    setList,
    loading,
    rowSelection,
    modelFilter,
    setModelFilter,
    total,
  } = props;

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    modelFilter,
    setModelFilter,
    total,
  );

  const handleFilter = React.useCallback(
    (field: string) => {
      return (f: any) => {
        setModelFilter({
          ...modelFilter,
          [field]: f,
        });
      };
    },
    [modelFilter, setModelFilter],
  );

  const handleDefaultSearch = React.useCallback(() => {
    // reset detfault filter
    const { skip, take } = new AppUserFilter();
    setModelFilter({ ...modelFilter, skip, take });
    // reload appUser list
    getList(modelFilter).then((list: AppUser[]) => {
      setList(list);
    });
  }, [getList, modelFilter, setList, setModelFilter]);

  const handleReset = React.useCallback(() => {
    const newFilter = new AppUserFilter();
    setModelFilter({ ...newFilter });
    getList(newFilter).then((list: AppUser[]) => {
      setList(list);
    });
  }, [getList, setList, setModelFilter]);

  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 60,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].username), sorter),
        title: translate('appUsers.username'),
        render(...[, appUser]) {
          return appUser?.username;
        },
      },
      {
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].displayName), sorter),
        title: translate('appUsers.displayName'),
        render(...[, appUser]) {
          return appUser?.displayName;
        },
      },
      {
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].phone), sorter),
        title: translate('appUsers.phone'),
        render(...[, appUser]) {
          return appUser?.phone;
        },
      },
      {
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].email), sorter),
        title: translate('appUsers.email'),
        render(...[, appUser]) {
          return appUser?.email;
        },
      },
    ];
  }, [list, pagination, sorter, translate]);
  return (
    <Modal
      size="xl"
      unmountOnClose={true}
      backdrop="static"
      toggle={toggle}
      isOpen={isOpen}
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
                  label={translate('appUsers.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.username.contain)}
                    filter={modelFilter.username}
                    onChange={handleFilter(nameof(modelFilter.username))}
                    placeholder={translate('appUsers.placeholder.username')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.phone.contain)}
                    filter={modelFilter.phone}
                    onChange={handleFilter(nameof(modelFilter.phone))}
                    placeholder={translate('appUsers.placeholder.phone')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.email.contain)}
                    filter={modelFilter.email}
                    onChange={handleFilter(nameof(modelFilter.email))}
                    placeholder={translate('appUsers.placeholder.email')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.displayName.contain)}
                    filter={modelFilter.displayName}
                    onChange={handleFilter(nameof(modelFilter.displayName))}
                    placeholder={translate('appUsers.placeholder.displayName')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {/* <Col span={16} /> */}
            </Row>
          </Form>
          {/* button area */}
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleDefaultSearch}
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
                  d="M47.434,46.7c0-.009,0-.018,0-.047,0-.008,0-.017-.007-.046,0-.007,0-.014-.011-.045l-.016-.044-.02-.042-.025-.043-5.088-7.61H55.313L50.49,46.039h1.086l4.956-7.413,0,0,.014-.023.009-.016.011-.024.008-.018.008-.023c0-.007,0-.013.007-.02s0-.014.005-.021,0-.016.006-.024,0-.013,0-.019,0-.018,0-.027,0-.012,0-.019,0-.019,0-.028,0,0,0-.005,0-.01,0-.015,0-.017,0-.025,0-.016,0-.024,0-.014,0-.021,0-.017-.005-.026l0-.018c0-.009-.005-.017-.008-.025a.341.341,0,0,0-.016-.041l-.009-.019-.01-.02-.012-.02-.011-.017-.014-.02-.013-.016-.015-.018-.016-.016L56.458,38l-.021-.018-.009-.008,0,0-.025-.017-.013-.009-.023-.012-.017-.009-.019-.008L56.3,37.9l-.014,0-.029-.008-.011,0-.033-.005h-.01l-.034,0H41.483l-.037,0a.422.422,0,0,0-.3.085.489.489,0,0,0-.1.656l5.5,8.23v6.562c0,.01,0,.02,0,.03s0,.012,0,.018,0,.017,0,.026l0,.022.005.021.007.026.006.017c0,.009.007.019.011.028l0,.005.009.018.005.011c.006.012.013.024.02.035l0,.006.02.029,0,.006a.457.457,0,0,0,.057.06l0,0a.447.447,0,0,0,.06.043l.01.006a.38.38,0,0,0,.048.023l.018.007a.447.447,0,0,0,.05.015l.014,0,.026,0,.014,0,.038,0h0a.434.434,0,0,0,.085-.009h.006l.035-.01.01,0,.031-.012.012-.005.007,0,1.175-.575V52.228l-.917.449V46.7Zm9.53.159-.615-.613-3.074,3.064L50.2,46.247l-.615.613,3.074,3.064-3.074,3.064.615.613,3.074-3.064L56.349,53.6l.615-.613L53.89,49.925Z"
                  transform="translate(-40.964 -37.883)"
                />
              </svg>
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>
        <Table
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
        <div className=" d-flex justify-content-end">
          <button className="btn btn-sm btn-primary" onClick={onClose}>
            {translate(generalLanguageKeys.actions.close)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default AppUserRoleMappingModal;
