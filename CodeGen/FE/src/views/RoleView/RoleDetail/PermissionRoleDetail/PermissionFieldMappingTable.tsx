import { Field } from 'models/Field';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import React from 'react';
import '.././RoleDetail.scss';
import DateFieldInput from './PermissionFieldInput/DateFieldInput';
import IdFieldInput from './PermissionFieldInput/IdFieldInput';
import LongFieldInput from './PermissionFieldInput/LongFieldInput';
import StringFieldInput from './PermissionFieldInput/StringFieldInput';
export interface PermissionFieldMappingTableProps {
  list?: Field[];
  selectedItems?: PermissionFieldMapping[];
  setSelectedItems?: (v: PermissionFieldMapping[]) => void;
}
function PermissionFieldMappingTable(props: PermissionFieldMappingTableProps) {
  const { list, selectedItems, setSelectedItems } = props;

  const handleChangeIdInput = React.useCallback(
    (field: Field, index: number) => {
      return (value: string[] | number[]) => {
        if (setSelectedItems) {
          // each field return from table create one mapping with permission
          // Find mapping following index
          const updatedSelection = {
            ...selectedItems[index],
            value: value.join(';'),
            fieldId: field.id,
            field,
          };
          selectedItems[index] = updatedSelection;
          setSelectedItems(selectedItems);
        }
      };
    },
    [selectedItems, setSelectedItems],
  );

  const handleChangeFieldInput = React.useCallback(
    (field: Field, index: number, type: string) => {
      return (value: string) => {
        if (setSelectedItems) {
          let newField = new PermissionFieldMapping();
          newField = {
            ...newField,
            type,
            value,
            fieldId: field.id,
            field,
          };
          selectedItems[index] = newField;
          setSelectedItems(selectedItems);
        }
      };
    },
    [selectedItems, setSelectedItems],
  );

  return (
    <div className="field-table">
      {list &&
        list.map((item: Field, index: number) => {
          const type = item.type;
          switch (type) {
            case 'STRING': {
              return (
                <React.Fragment key={item.id}>
                  <span className="label-input ml-3">{item.name}</span>
                  <StringFieldInput
                    item={item}
                    handleList={handleChangeFieldInput(item, index, type)}
                  />
                </React.Fragment>
              );
            }
            case 'ID': {
              return (
                <React.Fragment key={item.id}>
                  {/* ignore field with name Id */}
                  {item.name.trim().toLowerCase() !== 'Id'.toLowerCase() && (
                    <>
                      <span className="label-input ml-3">{item.name}</span>
                      <IdFieldInput
                        item={item}
                        mappingItem={selectedItems[index]}
                        handleList={handleChangeIdInput(item, index)}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            }
            case 'LONG': {
              return (
                <React.Fragment key={item.id}>
                  <span className="label-input ml-3">{item.name}</span>
                  <LongFieldInput
                    item={item}
                    handleList={handleChangeFieldInput(item, index, type)}
                  />
                </React.Fragment>
              );
            }
            case 'DATE': {
              return (
                <React.Fragment key={item.id}>
                  <span className="label-input ml-3">{item.name}</span>
                  <DateFieldInput
                    item={item}
                    handleList={handleChangeFieldInput(item, index, type)}
                  />
                </React.Fragment>
              );
            }
            default:
              return null;
          }
        })}
    </div>
  );
}

export default PermissionFieldMappingTable;
