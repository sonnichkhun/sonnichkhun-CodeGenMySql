import { Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { crudService } from 'core/services';
import { Field } from 'models/Field';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { Select } from 'antd';
import './InputStyle.scss';
import { Status } from 'models/Status';
import { Organization } from 'models/Organization';
import { Role } from 'models/Role';
import { Menu } from 'models/Menu';
import { Sex } from 'models/Sex';
import { Province } from 'models/Province';
import { District } from 'models/District';

const { Option } = Select;

export interface IdFilterInputProps {
  item: Field;
  mappingItem?: PermissionFieldMapping;
  handleList?: (value: string[] | number[]) => void;
}

function IdFieldInput(props: IdFilterInputProps) {
  const { item, handleList, mappingItem } = props;
  const [translate] = useTranslation();

  const [statusList] = crudService.useEnumList<Status>(
    roleRepository.singleListStatus,
  );

  const [organizationList] = crudService.useEnumList<Organization>(
    roleRepository.singleListStatus,
  );

  const [roleList] = crudService.useEnumList<Role>(
    roleRepository.singleListRole,
  );

  const [menuList] = crudService.useEnumList<Menu>(
    roleRepository.singleListMenu,
  );

  const [sexList] = crudService.useEnumList<Sex>(
    roleRepository.singleListSex,
  );

  const [provinceList] = crudService.useEnumList<Province>(
    roleRepository.singleListProvince,
  );

  const [districtList] = crudService.useEnumList<District>(
    roleRepository.singleListDistrict,
  );

  const renderInput = React.useMemo(() => {
    return () => {
      if (item) {
        switch (item.name.trim()) {
          // StatusId
          case 'StatusId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {statusList &&
                  statusList.length > 0 &&
                  statusList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );
          // OrganizationId
          case 'OrganizationId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {organizationList &&
                  organizationList.length > 0 &&
                  organizationList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );
          // RoleId
          case 'RoleId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {roleList &&
                  roleList.length > 0 &&
                  roleList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );
          // MenuId
          case 'MenuId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {menuList &&
                  menuList.length > 0 &&
                  menuList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );
          // SexId
          case 'SexId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {sexList &&
                  sexList.length > 0 &&
                  sexList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );
          // ProvinceId
          case 'ProvinceId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {provinceList &&
                  provinceList.length > 0 &&
                  provinceList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );
          // DistrictId
          case 'DistrictId':
            return (
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={translate('fields.placeholder.idType')}
                value={
                  mappingItem && mappingItem.value.split(';').length > 0
                    ? mappingItem.value.split(';')
                    : []
                }
                onChange={handleList}
                optionLabelProp="label"
              >
                {districtList &&
                  districtList.length > 0 &&
                  districtList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            );            
        }
      }
    };
  }, [districtList, handleList, item, mappingItem, menuList, organizationList, provinceList, roleList, sexList, statusList, translate]);

  return (
    <>
      {item && (
        <Row>
          <FormItem className="input-id">{renderInput()}</FormItem>
        </Row>
      )}
    </>
  );
}

export default IdFieldInput;
