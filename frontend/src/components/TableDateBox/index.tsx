import { useMemo } from 'react';

import { ReactComponent as DateIcon } from '../../assets/date.svg';

import { InputProps } from '~/types/main';

import { CustomBox, DateBoxBadge, DateBoxInput } from './styles';

interface Props extends InputProps {
  date: Date | string | null;  // Permitir que a data seja nula
  onDateSelect?: (value: Date) => void;
  showTime?: boolean;
}

export function TableDateBox({
  name,
  disabled,
  date,
  onDateSelect,
  showTime = true,
  validated = false,
  width = '7.5rem',
}: Props) {
  const [formattedDate, hour] = useMemo(() => {
    if (!date) {
      return ['', ''];  // Se a data for nula, retorna strings vazias
    }

    let currentDate: Date;

    if (typeof date === 'string') {
      currentDate = new Date(date);
    } else {
      currentDate = date;
    }

    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    const formattedHour = currentDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return [formattedDate, formattedHour];
  }, [date]);

  return (
    <CustomBox>
      <div>
        <DateBoxBadge validated>
          <DateIcon />
        </DateBoxBadge>
        <DateBoxInput validated disabled={disabled} width={width} onClick={() => { }}>
          {date ? (
            <p>
              {formattedDate}
              {showTime && <>&nbsp;<b>{hour}</b></>}
            </p>
          ) : (
            <p>{formattedDate}</p>
          )}
        </DateBoxInput>
      </div>
    </CustomBox>
  );
}
