import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import pt from 'date-fns/locale/pt-BR';
import { ReactDatePickerProps } from 'react-datepicker';
import { useField } from '@unform/core';
import { BoxBadge } from '~styles/components/box';
import { ReactComponent as DateIcon } from '~assets/date.svg';
import { CustomBox, DateBoxInput, Measure } from './styles';
import { parseISO, isValid, isAfter } from 'date-fns';
import { isNotEmpty } from '@/src/utils/validation';

interface Props extends Omit<ReactDatePickerProps, 'onChange'> {
  name: string;
  title: string;
  width?: string;
  noMinDate?: boolean;
  disabled?: boolean;
  validated?: boolean;
  hasHour?: boolean;
  empty?: boolean;
  isClearable?: boolean;
  focusOnNextElement?: () => void;
  onDateSelect?: (value: Date) => void;
  initialDate?: string;
  onDateChange?: (value: string) => void;
  onFieldChange?: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  showVencidaIndicator?: boolean; // Nova propriedade opcional para controlar o indicador de data vencida
}

export function DateBox({
  name,
  title,
  disabled,
  hasHour = true,
  placeholderText = '00',
  validated = false,
  width = '7.5rem',
  empty = false,
  isClearable = false,
  noMinDate = false,
  focusOnNextElement = () => { },
  onDateSelect = () => { },
  initialDate,
  onDateChange = () => { },
  onFieldChange = () => { },
  showVencidaIndicator = false,
}: Props) {
  const datepickerRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [isValidated, setIsValidated] = useState(validated || isNotEmpty(defaultValue));
  const [isDateVencida, setIsDateVencida] = useState(false);

  const minDate = useMemo(() => {
    if (noMinDate) {
      return null;
    } else {
      return new Date();
    }
  }, [noMinDate]);

  const [date, setDate] = useState(() =>
    initialDate && isValid(parseISO(initialDate))
      ? parseISO(initialDate)
      : empty
        ? ''
        : defaultValue !== null
          ? defaultValue === ''
            ? defaultValue
            : typeof defaultValue === 'object'
              ? defaultValue
              : parseISO(defaultValue)
          : new Date()
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datepickerRef.current,
      path: 'props.selected',
      clearValue: (ref: any) => {
        ref.clear();
      },
    });
  }, [fieldName, registerField]);

  useEffect(() => {
    if (showVencidaIndicator) {
      const dataAtual = new Date();
      setIsDateVencida(isAfter(dataAtual, date));
    }
  }, [date, showVencidaIndicator]);

  const handleDate = useCallback(
    (value) => {
      setDate(value ?? '');
      onDateSelect(value);
      onDateChange(value);
      setIsValidated(!!value);
    },
    [onDateSelect, onDateChange]
  );

  const handleFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(event, name);
    },
    [onFieldChange, name]
  );

  return (
    <CustomBox>
      <div>
        <label htmlFor={name}>{title}</label>
      </div>
      <div>
        <BoxBadge validated={isValidated}>
          <Measure>
            <DateIcon />
          </Measure>
        </BoxBadge>
        <div style={{
          border: showVencidaIndicator && isDateVencida ? '1px solid red' : '',
        }}>

          <DateBoxInput
            locale={pt}
            validated={isValidated}
            disabled={disabled}
            width={width}
            ref={datepickerRef}
            selected={date}
            minDate={minDate}
            onChange={handleDate}
            placeholderText={placeholderText}
            showTimeSelect={hasHour}
            dateFormat={hasHour ? 'dd/MM/yy h:mm aa' : 'dd/MM/yy'}
            isClearable={isClearable}
            onKeyDown={({ code }) => code === 'Tab' && focusOnNextElement()}
            onFieldChange={handleFieldChange}
          />
        </div>
      </div>
    </CustomBox>
  );
}