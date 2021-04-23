import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { PERMISSION_ROUTE } from 'config/route-consts';
import { crudService, formService, routerService } from 'core/services';
import { getOrderTypeForTable, renderMasterIndex } from 'helpers/ant-design/table';
import { Permission } from 'models/Permission';
import { PermissionFilter } from 'models/PermissionFilter';
import { Role } from 'models/Role';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { permissionRepository } from 'views/PermissionView/PermissionRepository';
import { roleRepository } from 'views/RoleView/RoleRepository';

const {Item: FormItem} = Form;

function PermissionTable(
  // props: ContentTableProps<Role, Permission>
  ) {
  const [translate] = useTranslation();

  // const {
  //   model,
  //   setModel,
  // } = props;

  const [
    filter,
    setFilter,
    list,
    setList,
    ,
    setLoading,
    total,
    ,
    ,
    ,
    handleOpenPreview,
    ,
    ,
    handleSearch,
    ,
    ,
    ,
  ] = crudService.useMaster<Permission, PermissionFilter>(
    Permission,
    PermissionFilter,
    permissionRepository.count,
    permissionRepository.list,
    permissionRepository.get,
  );
  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    PERMISSION_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  /**
   * If import
   */
  // const [handleImport] = crudService.useImport(
  //   permissionRepository.import,
  //   setLoading,
  // );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(permissionRepository.export, filter);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // const [statusList] = crudService.useEnumList<Status>(
  //   roleRepository.singleListStatus,
  // );
  // const [
  //   permissionFilter,
  //   setPermissionFilter,
  // ] = React.useState<PermissionFilter>(
  //   new PermissionFilter(),
  // );

  const [handleDelete] = tableService.useDeleteHandler<Role>(
    roleRepository.delete,
    setLoading,
    list,
    setList,
  );

  const columns: ColumnProps<Permission>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Permission>(pagination),
      },
      {
        title: translate('permissions.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        render: renderMasterIndex<Permission>(pagination),
      },
      {
        title: translate('permissions.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Role>(nameof(list[0].name), sorter),
        render(name: string, permission: Permission) {
          return (
            <FormItem validateStatus={formService.getValidationStatus<Permission>(permission.errors, nameof(permission.name))}
                      help={ permission.errors?.name }
            >
              <input type="text"
                     className="form-control form-control-sm"
                     name={nameof(name)}
                     defaultValue={name}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('permissions.menu'),
        key: nameof(list[0].menu),
        dataIndex: nameof(list[0].menu),
        render: renderMasterIndex<Permission>(pagination),
      },
      {
        title: translate('permissions.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        render: renderMasterIndex<Permission>(pagination),
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number) {
          return (
            <div className="d-flex justify-content-center btn-action">
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={handleOpenPreview(id)}
              >
                <i className="fa fa-eye" />
              </button>
              <button
                className="btn btn-sm btn-link"
                onClick={handleGoDetail(id)}
              >
                <i className="fa fa-edit" />
              </button>
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={handleDelete}
              >
                <i className="fa fa-trash" />
              </button>
            </div>
          );
        },
      },
    ],
    [translate, pagination, list, sorter, handleOpenPreview, handleGoDetail, handleDelete],
  );
    return (
    <>

      <Table
             pagination={pagination}
             dataSource={list}
             columns={columns}
             onChange={handleTableChange}
             tableLayout="fixed"
             size="small"
             title={() => (
              <>
                <div className="d-flex justify-content-between">
                  <div className="flex-shrink-1 d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                    <label
                      className="btn btn-sm btn-outline-primary mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="fa mr-2 fa-upload" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={handleExport}
                    >
                      <i className="fa mr-2 fa-download" />
                      {translate(generalLanguageKeys.actions.export)}
                    </button>
                    <button
                      className="btn btn-sm mr-2 text-danger btn-export-template"
                      // onClick={handleExportTemplate}
                    >
                      <i className="fa mr-2 fa-download" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
                    </button>
                  </div>
                  <div className="flex-shrink-1 d-flex align-items-center">
                    {translate('general.master.pagination', {
                      pageSize: pagination.pageSize,
                      total,
                    })}
                  </div>
                </div>
              </>
            )}

      />
    </>
  );
}

export default PermissionTable;