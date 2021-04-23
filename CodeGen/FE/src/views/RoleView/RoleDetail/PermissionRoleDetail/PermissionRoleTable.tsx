import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { IdFilter } from 'core/filters';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Field } from 'models/Field';
import { MenuFilter } from 'models/MenuFilter';
import { Permission } from 'models/Permission';
import { PermissionFilter } from 'models/PermissionFilter';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import '.././RoleDetail.scss';
import PermissionDetailModal from './PermissionDetailModal';
export interface PermissionRoleTableProps {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
  statusList: Status[];
}

function PermissionRoleTable(props: PermissionRoleTableProps) {
  const [translate] = useTranslation();
  const { role, setRole, statusList } = props;
  // list permission
  const [
    permissions,
    setPermissions,
    ,
    handleDelete,
  ] = crudService.useContentTable<Role, Permission>(
    role,
    setRole,
    nameof(role.permissions),
  );
  // const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [permissionFilter, setPermissionFilter] = React.useState<
    PermissionFilter
  >(new PermissionFilter());

  // permission filter
  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  // localtable service for sorting, paging
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<Permission, PermissionFilter>(
    permissions,
    permissionFilter,
    setPermissionFilter,
  );
  const [handleExport] = crudService.useExport(
    roleRepository.export,
    permissionFilter,
  );

  const [handleExportTemplate] = crudService.useExport(
    roleRepository.exportTemplate,
    permissionFilter,
  );
  const [permission, setPermission] = React.useState<Permission>(new Permission ());

  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      permissionFilter[field].contain = ev.target.value;
      setPermissionFilter({
        ...permissionFilter,
      });
    },
    [permissionFilter],
  );

  const handleIdFilter = React.useCallback(
    (field: string) => (filter: IdFilter) => {
      permissionFilter[field] = filter;
      setPermissionFilter({
        ...permissionFilter,
      });
    },
    [permissionFilter],
  );

  const handleAdd = React.useCallback(
    (item: Permission) => {
      return () => {
        if (role) {
          item = { ...item, roleId: role.id, role };
          // remove null fields
          item.permissionFieldMappings = item.permissionFieldMappings.filter(
            (item: Field) => item !== null,
          );
          setPermissions([...permissions, item]);
          setVisible(false);
        }
      };
    },
    [permissions, role, setPermissions],
  );

  // hook for add new permission modals
  const [visible, setVisible] = React.useState<boolean>(false);
  const handleOpen = React.useCallback(
    (permission : Permission) => {
      setPermission(permission);
      setVisible(true);
  }, [setVisible, setPermission]);

  const handleClose = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);


  // render table columns
  const columns: ColumnProps<Permission>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.columns.index)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Permission>(pagination),
      },
      {
        title: () => (
          <>
            <div>{translate('permissions.code')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(permissionFilter.code))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
        render(...[, permission]) {
          return permission?.code;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('permissions.name')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(permissionFilter.name))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        render(...[, permission]) {
          return permission?.name;
        },
      },
      {
        title: () => (
          <div className="w-100">
            <div>{translate('permissions.permissionsMenu')}</div>
            <AdvancedIdFilter
              filter={permissionFilter.menuId}
              filterType={nameof(permissionFilter.menuId.equal)}
              value={permissionFilter.menuId.equal}
              onChange={handleIdFilter(nameof(permissionFilter.menuId))}
              getList={roleRepository.singleListMenu}
              modelFilter={menuFilter}
              setModelFilter={setMenuFilter}
              searchField={nameof(menuFilter.name)}
              allowClear={true}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </div>
        ),
        key: nameof(dataSource[0].menuId),
        dataIndex: nameof(dataSource[0].menuId),
        width: generalColumnWidths.default,
        render(...[, permission]) {
          return permission?.menu.name;
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate('appUsers.status')}
          </div>
        ),
        key: nameof(dataSource[0].status),
        dataIndex: nameof(dataSource[0].status),
        align: 'center',
        render(...[, permission]) {
          return (
            <div className={permission.statusId === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.actions.label)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[,permission, index] ) {
          return (
            <div className="d-flex justify-content-center">
               <button
                  className="btn btn-sm btn-link text-danger"
                  // onClick={handleOpenPreview(id)}
                >
                  <i className="fa fa-eye" />
                </button>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => handleOpen(permission)}
                >
                  <i className="fa fa-edit" />
                </button>
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={handleDelete(index)}
              >
                <i className="fa fa-trash" />
              </button>
            </div>
          );
        },
      },
    ],
    [dataSource, handleDelete, handleIdFilter, handleOpen, handleValueFilter, menuFilter, pagination, permissionFilter.code, permissionFilter.menuId, permissionFilter.name, translate],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={nameof(permissions[0].id)}
        onChange={handleTableChange}
        className="permission-table"
        title={() => (
          <>
          <div className="d-flex d-flex justify-content-between">
            <div className="flex-shrink-1 d-flex align-items-center">
              <button
                className="btn btn-sm btn-primary mr-2"
                onClick={handleOpen}
              >
                <i className="fa mr-2 fa-plus" />
                {translate('roles.addPermission')}
              </button>
              <label
                className="btn btn-sm btn-outline-primary mr-2 mb-0"
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
              <button
                className="btn btn-sm btn-outline-primary mr-2"
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
                className="btn btn-sm btn-export-template mr-2"
                onClick={handleExportTemplate}
              >
                <i className="fa mr-2 fa-download" />
                {translate(generalLanguageKeys.actions.exportTemplate)}
              </button>
            </div>
            <div className="flex-shrink-1 d-flex align-items-center">
              {translate('general.master.pagination', {
                pageSize: pagination.pageSize,
                total: pagination.total,
              })}
            </div>
          </div>
        </>
        )}
      />
      <PermissionDetailModal
        isOpen={visible}
        handleAdd={handleAdd}
        handleClose={handleClose}
        statusList={statusList}
        currentItem={permission}
        setCurrentItem ={setPermission}
      />
    </>
  );
}

export default PermissionRoleTable;
