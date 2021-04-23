import DatePicker from 'antd/lib/date-picker';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import classNames from 'classnames';
import { DateFilter } from 'core/filters';
import moment, { Moment } from 'moment';
import React, { ComponentProps } from 'react';
import { FilterType } from 'react3l';
import nameof from 'ts-nameof.macro';
import './AdvancedDateFilter.scss';

export interface AdvancedDateFilterProps extends ComponentProps<any> {
  filter: DateFilter;

  filterType?: keyof DateFilter | string;

  onChange?(filter: DateFilter);


  placeholder?: string | string[];
}

const dateFilterTypes: FilterType<DateFilter>[] = DateFilter.types();

function AdvancedDateFilter(props: AdvancedDateFilterProps) {
  const {
    filter,
    filterType,
    onChange,
    className,
    placeholder,
  } = props;

  const [type] = React.useState<keyof DateFilter>((filterType ?? dateFilterTypes[0].key as any));

  const handleChangeRange = React.useCallback(
    (range) => {
      filter.greaterEqual = range[0];
      filter.lessEqual = range[1];
      if (onChange) {
        onChange(filter);
      }
    },
    [filter, onChange],
  );

  const handleChange = React.useCallback(
    (value: Moment) => {
      if (value) {
        const date: Date = value.startOf('day').toDate();
        filter.greaterEqual = moment(date.getTime());
        filter.lessEqual = moment(date.getTime() + 86399999);
      } else {
        filter.greaterEqual = null;
        filter.lessEqual = null;
      }
      if (onChange) {
        onChange(filter);
      }
    },
    [filter, onChange],
  );

  return React.useMemo(() => {
    if (type === nameof(filter.range)) {
      const dateFilterRange: RangePickerValue = [filter.greaterEqual, filter.lessEqual];
      return (
        <DatePicker.RangePicker value={dateFilterRange}
          onChange={handleChangeRange}
          className={classNames('advanced-date-filter', className)}
          placeholder={placeholder as [string, string]}
        />
      );
    }
    return (
      <DatePicker
        defaultValue={filter[type] as Moment}
        onChange={handleChange}
        className={classNames('advanced-date-filter', className)}
        placeholder={placeholder as string}
      />
    );
  },
    [className, filter, handleChange, handleChangeRange, placeholder, type],
  );
}

export default AdvancedDateFilter;
