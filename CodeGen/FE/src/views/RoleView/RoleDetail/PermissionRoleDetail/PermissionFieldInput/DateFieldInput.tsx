import { DatePicker, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Field } from 'models/Field';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CurrenObject } from './LongFieldInput';
import './InputStyle.scss';


export interface DateFilterInputProps {
  item: Field;
  handleList?: (value: string) => void;
}

function DateFieldInput(props: DateFilterInputProps) {
  const [translate] = useTranslation();
  const { item, handleList } = props;

  const [currentObject, setCurrentObject] = React.useState<CurrenObject>({
    key1: null,
    key2: null,
  });

  const fieldMappingsValue = React.useCallback(() => {
    const listValue = [];
    Object.entries(currentObject).forEach(([, value]) => {
      listValue.push(value);
    });
    return listValue.join(';');
  }, [currentObject]);

  const handleChangeRange = React.useCallback(
    (range: any) => {
      currentObject.key1 = range[0];
      currentObject.key2 = range[1];
      setCurrentObject(currentObject);
      if (handleList) {
        handleList(fieldMappingsValue());
      }
    },
    [currentObject, fieldMappingsValue, handleList],
  );

  return (
    <>
      {item && (
        <Row>
            <FormItem className="input-date">
              <DatePicker.RangePicker
                onChange={handleChangeRange}
                className={'advanced-date-filter'}
                placeholder={[
                  translate('fields.placeholder.dateTypeKey1'),
                  translate('fields.placeholder.dateTypeKey2'),
                ]}
              />
            </FormItem>
        </Row>
      )}
    </>
  );
}

export default DateFieldInput;
