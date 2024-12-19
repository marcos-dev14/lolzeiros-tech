import { useMemo } from 'react';

import { ReactComponent as DateIcon } from '../../assets/date.svg';

import { InputProps } from '~/types/main';

import { CustomBox, DateBoxBadge, DateBoxInput } from './styles';

interface Props extends InputProps {
  date: Date;
  onDateSelect: (value: Date) => void;
}

export function CustomDateBox({
  name,
  title,
  disabled,
  date,
  onDateSelect,
  validated = false,
  width = '7.5rem',
}: Props) {
  const [formattedDate, hour] = useMemo(() => {
    let currentDate = date;
    
    // @ts-ignore
    if(typeof date === 'string') {
      currentDate = new Date(date)
    }

   return currentDate.toLocaleDateString("pt-BR", {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).split(' ')}
  , [date])

  return (
    <CustomBox>
      <div className="status">
        <label htmlFor={name}>{title}</label>
      </div>
      <div>
        <DateBoxBadge validated>
          <DateIcon />
        </DateBoxBadge>
        <DateBoxInput
          validated
          disabled={disabled}
          width={width}
          onClick={() => {}}
        >
          <p>{formattedDate}&nbsp;<b>{hour}</b></p>
        </DateBoxInput>
      </div>
    </CustomBox>
  );
}

