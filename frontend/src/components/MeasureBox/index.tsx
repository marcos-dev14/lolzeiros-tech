// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { BoxBadge, BoxInput } from "~styles/components/box";

import { InputProps } from "~/types/main";

import { CustomBox, Measure } from "./styles";

interface Props extends InputProps {
  name: string;
  measure: string;
  noTitle?: boolean;
}

export function MeasureBox({
  name,
  title,
  disabled,
  measure,
  noTitle = false,
  validated = false,
  width = "7.5rem",
  onBlur = () => {},
  placeholder = "Digite aqui...",
  defaultValue,
  ...rest
}: Props) {
  const [isValidated, setIsValidated] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);

  // @ts-ignore
  const handleOnBlur = useCallback(
    (e) => {
      // @ts-ignore
      setIsValidated(!!e.target.value);
      // @ts-ignore
      onBlur(e);
    },
    [onBlur]
  );

  useEffect(() => {
    if (isValidated !== "") return;
    // @ts-ignore
    setIsValidated(!!defaultValue);
  }, [defaultValue, isValidated]);

  const handleOnChange = useCallback((e) => {
    // @ts-ignore
    e.preventDefault();
    setValue(e.target.value.replace(/[^0-9\.]/gi, ""));
  }, []);

  return (
    <CustomBox noTitle={noTitle} >
      {!noTitle && (
        <div className="status">
          <label htmlFor={name}>{title}</label>
        </div>
      )}
      <div style={{ margin: 'auto'}} >
        <BoxBadge validated={validated || !!isValidated}>
          <Measure>{measure}</Measure>
        </BoxBadge>
        <BoxInput
          id={name}
          disabled={disabled}
          validated={validated || !!isValidated}
          placeholder={disabled ? "" : placeholder}
          width={width}
          ref={inputRef}
          defaultValue={defaultValue}
          onBlur={handleOnBlur}
          value={value}
          onChange={handleOnChange}
          isInput
          type="text"
          {...rest}
        />
      </div>
    </CustomBox>
  );
}
