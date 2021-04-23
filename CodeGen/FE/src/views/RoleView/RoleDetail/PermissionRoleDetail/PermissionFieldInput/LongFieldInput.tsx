import { Col } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Row from 'antd/lib/row';
import { Field } from 'models/Field';
import { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import './InputStyle.scss';

export interface LongFilterInputProps {
  item: Field;
  handleList?: (value: string) => void;
}
export type CurrenObject = {
  key1: number | string | Moment | null | undefined;
  key2: number | string | Moment | null | undefined;
};
function LongFieldInput(props: LongFilterInputProps) {
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

  const handleChange = React.useCallback(
    (key: string) => {
      return (ev: React.ChangeEvent<HTMLInputElement>) => {
        currentObject[key] = ev.currentTarget.value;
        setCurrentObject(currentObject);
        if (handleList) {
          handleList(fieldMappingsValue());
        }
      };
    },
    [currentObject, fieldMappingsValue, handleList],
  );

  return (
    <>
      {item && (
        <Row>
          <Col lg={12}>
            <FormItem className="input-long">
              <input
                type="text"
                placeholder={translate('fields.placeholder.longTypeKey1')}
                onChange={handleChange(nameof(currentObject.key1))}
                className="form-control form-control-sm mt-2 mb-2 input"
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem>
              <input
                type="text"
                placeholder={translate('fields.placeholder.longTypeKey2')}
                onChange={handleChange(nameof(currentObject.key2))}
                className="form-control form-control-sm mt-2 mb-2 ml-4"
              />
            </FormItem>
          </Col>
        </Row>
      )}
    </>
  );
}

export default LongFieldInput;
