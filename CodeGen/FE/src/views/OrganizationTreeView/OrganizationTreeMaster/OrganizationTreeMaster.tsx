import { Card, Col, Form } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { ORGANIZATION_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { organizationRepository } from 'views/OrganizationTreeView/OrganizationRepository';
import AppUserModal from '../OrganizationTreeDetail/AppUserModal/AppUserModal';
import OrganizationTree from './OrganizationTree/OrganizationTree';
import './OrganizationTreeMaster.scss';

function OrganizationTreeMaster() {
  const [translate] = useTranslation();

  const [
    filter,
    ,
    list,
    setList,
    loading,
    setLoading,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    handleSearch,
  ] = crudService.useMaster<Organization, OrganizationFilter>(
    Organization,
    OrganizationFilter,
    organizationRepository.count,
    organizationRepository.list,
    organizationRepository.get,
  );

  const [
    handleCreate,
    handleGoDetail,
    handleGoCreate,
  ] = routerService.useMasterNavigation(ORGANIZATION_ROUTE);

  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [currentItem, setCurrentItem] = React.useState<any>(null);

  const [handleDelete] = tableService.useDeleteHandler<Organization>(
    organizationRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );

  const [
    loadingAppUser,
    visibleAppUser,
    setVisibleProduct,
    listAppUser2,
    totalAppUser,
    handleOpenAppUser,
    ,
    filterAppUser,
    setFilterAppUser,
  ] = crudService.useContentModal(
    organizationRepository.listAppUser,
    organizationRepository.countAppUser,
    AppUserFilter,
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
    ,
    ,
    ,
  ] = tableService.useLocalTable(listAppUser, filterAppUser, setFilterAppUser);

  const [handleImport] = crudService.useImport(
    organizationRepository.import,
    setLoading,
  );

  /**
   * If export
   */

  const [handleExport] = crudService.useExport(
    organizationRepository.export,
    filter,
  );
const listFilterType : any [] = React.useMemo(
  () => {
    return[
      {
        id: 1,
        name: translate('organizations.filter.all'),
      },
      {
        id:2,
        name: translate('organizations.filter.parent'),
      },
      {
        id: 3,
        name: translate('organizations.filter.children'),
      },
    ];
  },
  [translate],
);
const [filterTypeFilter, setFilterTypeFilter] = React.useState<number>(1);

  const [handleExportTemplate] = crudService.useExport(
    organizationRepository.exportTemplate,
    filter,
  );

  const handleGetDetail = React.useCallback(
    (id: number, filterType: number) => {
      const listAppUser = [];
      organizationRepository
        .get(id, filterType)
        .then(res => {
          if (res && res.appUsers && res.appUsers.length > 0) {
            res.appUsers.forEach(appUser => {
              listAppUser.push(appUser);
            });
            setListAppUser(listAppUser);
          } else {
            setListAppUser([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading, setListAppUser],
  );

  const handleCloseAppUser = React.useCallback(
    (currentItem: Organization) => {
      handleGetDetail(currentItem?.id, filterTypeFilter);
      setVisibleProduct(false);
    },
    [setVisibleProduct, handleGetDetail, filterTypeFilter],
  );

  const handleDeleteAppUser = React.useCallback(
    (id, current, currentItem) => {
      current.id = id;
      organizationRepository
        .deleteAppUser(current)
        .then(res => {
          if (res) {
            setVisibleProduct(false);
            handleGetDetail(currentItem.id, filterTypeFilter);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setVisibleProduct, setLoading, handleGetDetail, filterTypeFilter],
  );
  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },

      {
        title: translate('organizations.master.appUser.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.email'),
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.phone'),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        ellipsis: true,
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, appUser: AppUser) {
          return (
            <div className="d-flex justify-content-center">
                <button
                  className="btn btn-sm btn-link text-danger"
                  onClick={() => handleDeleteAppUser(id, appUser, currentItem)}
                >
                  <i className="fa fa-trash" />
                </button>
            </div>
          );
        },
      },
    ];
  }, [currentItem, dataSource, handleDeleteAppUser, pagination, translate]);

  const handleActive = React.useCallback(
    (node: AppUser) => {
      setCurrentItem(node);
      if (node.appUsers !== null) {
        setListAppUser(node.appUsers);
      } else {
        setListAppUser([]);
      }
      handleGetDetail(node.id, filterTypeFilter);
    },
    [setCurrentItem, setListAppUser, handleGetDetail,filterTypeFilter],
  );

  const handleSavePopup = React.useCallback(
    (event, currentItems) => {
      if (currentItems.appUsers === null) {
        currentItems.appUsers = [];
      }
      if (event) {
        event.forEach(element => {
          currentItems.appUsers.push(element);
        });
      }

      organizationRepository
        .update(currentItems)
        .then(res => {
          if (res) {
            setVisibleProduct(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading, setVisibleProduct],
  );

  const handleFilterAppUser = React.useCallback(
    (event)=> {
      currentItem.filterType =Number(event.equal);
      handleGetDetail(currentItem?.id, currentItem.filterType);
      setFilterTypeFilter(currentItem.filterType);
    },
    [currentItem, handleGetDetail],
  );
  return (
    <Card
      className="page master-page organization-master"
      title={translate('organizations.master.title')}
    >
      <Col lg={12}>
        <div className="org-grouping">
          <div className="mb-3">
            <span className="title-org">
              {translate('organizations.master.grouping.title')}
            </span>
            <i
              role="button"
              className="icon fa fa-plus text-danger ml-2"
              onClick={handleCreate}
            />
          </div>
          <OrganizationTree
            tree={list}
            onAdd={handleGoCreate}
            onEdit={handleGoDetail}
            onDelete={handleDelete}
            onActive={handleActive}
            currentItem={currentItem}
          />
        </div>
      </Col>
      <Col lg={12}>
        <div className="flex-shrink-1 d-flex align-items-center">
          {currentItem && currentItem?.id && (
            <>
             <Form.Item
                  labelAlign="left"
                  className="mb-1 select"
                  label={translate('organizations.appUser')}
                >
                  <AdvancedIdFilter
                    filter={filter.filterType}
                    filterType={nameof(filter.filterType.equal)}
                    value={filterTypeFilter}
                    onChange={handleFilterAppUser}
                    allowClear={false}
                    list={listFilterType}
                  />
                </Form.Item>
            <button
              className="btn btn-sm btn-primary mt-4 ml-1 mr-2 "
              onClick={handleOpenAppUser}
            >
              <i className="icon fa fa-plus mr-1" />
              {translate('organizations.master.add')}
            </button>
            </>
          )}
          <label
            className="btn btn-sm btn-outline-primary mt-4 mr-2 mb-0 "
            htmlFor="master-import"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19.085"
              height="12.893"
              viewBox="0 0 19.085 12.893"
            >
              <path
                fill="#ee534d"
                className="a"
                d="M535.168,262.972a7.2,7.2,0,0,0-.208-1.031c-.045-.165-.1-.326-.151-.488-.026-.076-.053-.153-.081-.227-.014-.039-.03-.076-.044-.112a.585.585,0,0,0-.024-.06c0-.007-.007-.014-.012-.027a5.973,5.973,0,0,0-.471-.876,4.3,4.3,0,0,0-.59-.727c-.11-.114-.227-.22-.348-.323-.03-.027-.06-.05-.092-.075l-.014-.011c-.005-.005-.015-.012-.028-.021-.073-.055-.151-.106-.226-.156a3.7,3.7,0,0,0-.417-.234,3.93,3.93,0,0,0-.467-.2,5.3,5.3,0,0,0-1.048-.295l-.02,0-.083-.01c-.073-.007-.145-.009-.217-.013-.136-.006-.263-.018-.4-.035a.417.417,0,0,1-.407-.412v-1.281c-.637.482-1.269.952-1.9,1.427-.664.5-1.329,1-1.99,1.507l3.9,2.895c-.012-.471-.021-.942-.032-1.412a.41.41,0,0,1,.3-.4,4.4,4.4,0,0,1,.983-.092,3.732,3.732,0,0,1,1.023.183,5.044,5.044,0,0,1,1.708,1.025,8.236,8.236,0,0,1,1.294,1.483c.02.028.042.057.06.086C535.174,263.031,535.172,263,535.168,262.972Z"
                transform="translate(-516.091 -255.372)"
              />
              <path
                fill="#ee534d"
                className="a"
                d="M77.237,220.837a1.374,1.374,0,0,1-1.373,1.356H67.611a1.377,1.377,0,0,1-1.377-1.376v-8.252a1.377,1.377,0,0,1,1.377-1.376h8.252a1.349,1.349,0,0,1,1.055.528c.329-.249.662-.5.994-.749a1.605,1.605,0,0,0-1.34-.723H66.9a1.613,1.613,0,0,0-1.613,1.611v9.67a1.613,1.613,0,0,0,1.613,1.611h9.669a1.61,1.61,0,0,0,1.609-1.588v-3.891l-.944-.7v3.88Z"
                transform="translate(-65.29 -210.244)"
              />
              <path
                fill="#ee534d"
                className="a"
                d="M254.106,395.7l-.838,1.242-.839-1.242h-1.646l1.646,2.485-1.646,2.485h1.646l.839-1.243.838,1.243h1.647l-1.647-2.485s1.646-2.472,1.661-2.485Z"
                transform="translate(-246.821 -391.735)"
              />
            </svg>
            {translate(generalLanguageKeys.actions.import)}
          </label>
          <input
            type="file"
            className="hidden"
            id="master-import"
            onChange={handleImport}
          />
          <button
            className="btn btn-sm btn-outline-primary mt-4 mr-2 "
            onClick={handleExport}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19.125"
              height="13.247"
              viewBox="0 0 19.125 13.247"
            >
              <path
                className="a"
                fill="#ee534d"
                d="M84.416,206.816c-.679-.519-1.362-1.032-2.045-1.547-.647-.488-1.3-.971-1.951-1.467v1.315a.429.429,0,0,1-.418.424c-.141.016-.272.029-.412.035-.074,0-.147.007-.223.014l-.085.01-.022,0a5.54,5.54,0,0,0-1.077.3,4.176,4.176,0,0,0-.479.205,3.927,3.927,0,0,0-.428.24c-.078.052-.157.1-.232.162a.26.26,0,0,0-.028.022l-.015.011c-.032.026-.063.05-.095.078-.123.1-.244.214-.358.331a4.448,4.448,0,0,0-.605.747,6.186,6.186,0,0,0-.486.9c0,.012-.009.02-.011.027a.606.606,0,0,0-.025.061c-.016.037-.031.075-.046.114-.028.077-.057.155-.083.234-.057.165-.11.331-.156.5a7.615,7.615,0,0,0-.214,1.06c0,.031-.005.061-.007.09.019-.029.04-.059.062-.089a8.52,8.52,0,0,1,1.329-1.523,5.209,5.209,0,0,1,1.755-1.053,3.846,3.846,0,0,1,1.052-.187,4.582,4.582,0,0,1,1.01.094.421.421,0,0,1,.312.409c-.012.485-.022.968-.033,1.452Q82.411,208.3,84.416,206.816Zm-6.851,1.991v4.674a1.412,1.412,0,0,1-1.411,1.393H67.675a1.415,1.415,0,0,1-1.415-1.414v-8.479a1.415,1.415,0,0,1,1.415-1.414h8.479a1.411,1.411,0,0,1,1.411,1.393v.621c.123-.052.245-.1.4-.161.186-.07.377-.129.567-.191v-1a1.654,1.654,0,0,0-1.653-1.632H66.948a1.658,1.658,0,0,0-1.657,1.656v9.935a1.658,1.658,0,0,0,1.657,1.656h9.934a1.655,1.655,0,0,0,1.653-1.632v-5.682a6.03,6.03,0,0,0-.754.19C77.708,208.744,77.638,208.779,77.565,208.807Zm-4.789-2.139-.862,1.276-.861-1.276H69.362l1.692,2.553-1.692,2.553h1.692l.861-1.277.862,1.277h1.691l-.326-.492-.675-.983c0-.007-.69-1.078-.69-1.078l1.691-2.553Z"
                transform="translate(-65.291 -202.597)"
              />
            </svg>
            {translate(generalLanguageKeys.actions.export)}
          </button>
          <button
            className="btn btn-sm btn-export-template mt-4 mr-2 "
            onClick={handleExportTemplate}
          >
            <i className="fa mr-2 fa-download" />
            {translate(generalLanguageKeys.actions.exportTemplate)}
          </button>
        </div>

        <div className="table-app-user">
          <div className="mb-3 title-org">
            {translate('organizations.master.appUser.title')}
          </div>
          <Table
            className="content-app-user"
            key={listAppUser[0]?.id}
            dataSource={listAppUser}
            columns={columns}
            bordered
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(dataSource[0].id)}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>

        <AppUserModal
          title={translate('organizations.master.appUser.title')}
          selectedList={listAppUser}
          setSelectedList={setListAppUser}
          list={listAppUser2}
          total={totalAppUser}
          isOpen={visibleAppUser}
          loading={loadingAppUser}
          toggle={handleCloseAppUser}
          onClose={handleCloseAppUser}
          onSave={handleSavePopup}
          currentItem={currentItem}
          isSave={true}
          pagination={pagination}
          dataSource={dataSource}
          getList={organizationRepository.listAppUser}
          count={organizationRepository.countAppUser}
        />
      </Col>
    </Card>
  );
}

export default OrganizationTreeMaster;
