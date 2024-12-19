import React, { useCallback, useMemo, useState } from 'react';
import pt from 'date-fns/locale/pt-BR';

// @ts-ignore
import { ReactDatePickerProps } from 'react-datepicker';

import { ReactComponent as DateIcon } from '../../assets/date.svg';

import { InputProps } from '~/types/main';

import { CustomBox, DateBoxBadge, DateBoxInput } from './styles';
import { parseISO } from 'date-fns';
import { formatDateISO } from '@/src/utils/validation';

interface Props extends InputProps {
  date: Date;
  onDateSelect: (value: string) => void;
  excludeDates?: Date[];
  hasHour?: boolean;
  noMinDate?: boolean;
}

export function StaticDateBox({
  name,
  disabled,
  date,
  title,
  hasHour = false,
  noMinDate = false,
  onDateSelect,
  validated = false,
  width = '7.5rem',
  noTitle = false,
  style = {},
  excludeDates = []
}: Props) {
  const [formattedDate, setFormattedDate] = useState(() => {
    let currentDate = date;
    
    // if(typeof date === 'string') {
    // @ts-ignore
    if(typeof date === 'string' && !!date) {
      currentDate = new Date(date)
    }

    // return currentDate.toLocaleDateString("pt-BR");
    return currentDate;
  });

  const dateFormat = useMemo(() => 
    hasHour ? "dd/MM/yy h:mm aa" : "dd/MM/yy"
  , [hasHour]);
  
  const minDate = useMemo(() => 
    noMinDate ? null : new Date()
  , [noMinDate]);

  const handleDate = useCallback((value) => {
    if(!!value) {
      setFormattedDate(value);
      onDateSelect(formatDateISO(value));
    }
  }, [onDateSelect]);

  return (
    <CustomBox noTitle={noTitle} style={style}>
      {!noTitle && 
        <div className="status">
          <label htmlFor={name}>{title}</label>
        </div>
      }
      <div>
        <DateBoxBadge validated>
          <DateIcon />
        </DateBoxBadge>
        <DateBoxInput
          locale={pt}
          validated
          disabled={disabled}
          width={width}
          onChange={handleDate}
          placeholderText="00/00/0000"
          showTimeSelect={hasHour}
          dateFormat={dateFormat}
          selected={formattedDate}
          minDate={minDate}
          excludeDates={excludeDates}
        />
      </div>
    </CustomBox>
  );
}

