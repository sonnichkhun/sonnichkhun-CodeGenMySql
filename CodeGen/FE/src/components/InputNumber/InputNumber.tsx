import AntInputNumber, {
  InputNumberProps as AntInputNumberProps,
} from 'antd/lib/input-number';
import React, { ReactText } from 'react';
import './InputNumber.scss';
import classNames from 'classnames';

interface InputNumberProps {
  value?: number;

  defaultValue?: number;

  onChange?: (event) => void;

  allowNegative?: boolean;

  onlyInteger?: boolean;

  className?: string;

  disabled?: boolean;

  min?: number;

  max?: number;

  step?: number;

  formatter?(x: ReactText): string;
}

const InputNumber = React.forwardRef(
  (props: InputNumberProps & AntInputNumberProps, ref: React.Ref<any>) => {
    const {
      defaultValue,
      step,
      value,
      className,
      disabled,
      min,
      max,
      onChange,
      allowNegative,
    } = props;

    const isControlled: boolean =
      !props.hasOwnProperty('defaultValue') && props.hasOwnProperty('value');

    const parser = React.useMemo(() => {
      return (x: string) => {
        const result: number = parseFloat(x.split(',').join(''));
        if (result < 0) {
          if (allowNegative) {
            return result;
          }
          return undefined;
        }
        if (Number.isNaN(result)) {
          if (x === '-') {
            return x;
          }
          return undefined;
        }
        return result;
      };
    }, [allowNegative]);

    const formatter = React.useCallback(
      (x: ReactText) => {
        if (x === '-') {
          return x;
        }
        if (typeof x === 'string') {
          x = parser(x);
        }
        if (typeof x === 'number') {
          x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return x;
        }
        return '';
      },
      [parser],
    );

    return React.useMemo(() => {
      const commonProps = {
        className: classNames(
          'form-control form-control-sm input-number',
          className,
        ),
        disabled,
        max,
        min,
        step,
        formatter,
        parser,
        onChange,
      };

      if (isControlled) {
        return <AntInputNumber ref={ref} {...commonProps} value={value || 0} />;
      }
      return (
        <AntInputNumber
          ref={ref}
          {...commonProps}
          defaultValue={defaultValue || 0}
        />
      );
    }, [
      className,
      disabled,
      max,
      min,
      step,
      formatter,
      parser,
      onChange,
      isControlled,
      ref,
      defaultValue,
      value,
    ]);
  },
);

InputNumber.defaultProps = {
  allowNegative: true,
  onlyInteger: false,
  step: 1,
};

export default InputNumber;
