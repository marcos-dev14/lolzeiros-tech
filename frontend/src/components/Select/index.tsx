// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import chroma from "chroma-js";

import Select, { components } from "react-select";

import { Title, Indicator, Menu, DropdownImage } from "./styles";

import { ReactComponent as DropdownIcon } from "~assets/arrow_down.svg";
import { DefaultValueProps } from "~types/main";
import { isOnSafari } from "@/src/utils/validation";
import { badgeColors } from "@/src/pages/Store/Sales/styles";
import { useDebounce } from "@/src/hooks/useDebounce";

export const colourOptions = [
  { value: "ocean", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];

const Placeholder = (props) => {
  return <components.Placeholder {...props} />;
};

// const MenuList = ({ selectProps, children, ...rest }) => {
//   const { customWidth } = selectProps;
//   return (
//     <components.MenuList {...rest}>
//       <Menu style={{ width: customWidth - 8 }} onClick={() => {}}>
//         <span>
//           <img src={addItem} alt="addItem" />
//           Add new
//         </span>
//       </Menu>
//       {children}
//     </components.MenuList>
//   );
// };

const IndicatorSeparator = ({ innerProps, selectProps, isFocused }) => {
  return (
    <Indicator
      {...innerProps}
      isFocused={isFocused}
    />
  );
};

const DropdownIndicator = ({ selectProps, ...rest }) => {
  return (
    <components.DropdownIndicator {...rest}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  width: '0.9rem', height: '1rem' }}
      >
      <DropdownIcon />
      </div>
    </components.DropdownIndicator>
  );
};

const SelectContainer = ({ children, selectProps, ...props }) => {
  const { title } = selectProps;
  
  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <components.SelectContainer {...props}>
      <Title isOnSafari={usingSafari}>
        {title}
      </Title>
      {children}
    </components.SelectContainer>
  );
};

interface CustomSelectProps {
  title: string;
  badge?: boolean;
  placeholder?: string;
  defaultValue?: DefaultValueProps;
  setValue: Function;
  onKeyDown?: Function;
  customWidth?: string | number;
  fontSize?: number;
  hasMarginLeft?: boolean;
  data?: DefaultValueProps[];
  disabled?: boolean;
  isClearable?: boolean;
  error?: boolean;
  style?: object;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  title,
  badge = false,
  setValue,
  onKeyDown = () => {},
  placeholder = 'Selecione...',
  data = [],
  fontSize = 12,
  defaultValue = {},
  customWidth = 221,
  hasMarginLeft = false,
  disabled = false,
  isClearable = false,
  error = false,
  style,
}) => {
  const [isValidated, setIsValidated] = useState('');
  const [inputValue, setInputValue] = useState('');

  const debouncedSearchTerm = useDebounce(inputValue, 1000)

  useEffect(() => {
    if(isValidated !== '') return;
    setIsValidated(!!defaultValue.value);
  }, [defaultValue, isValidated])

  useEffect(() => {
    onKeyDown(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <Select
      title={title}
      placeholder={placeholder}
      components={{
        SelectContainer,
        Placeholder,
        IndicatorSeparator,
        DropdownIndicator,
      }}
      isDisabled={disabled}
      onChange={(value) => {
        setIsValidated(!!value);
        setValue(!!value ? value.value : '', !!value ? value.id : '');
      }}
      onKeyDown={(value) => setInputValue(value.target.value)}
      options={data}
      // options={!!data.length ? data : colourOptions}
      // options={colourOptions}
      customWidth={customWidth}
      defaultValue={defaultValue}
      fontSize={fontSize}
      isClearable={isClearable}
      styles={{
        control: (
          styles,
          { isFocused, selectProps: { menuIsOpen } }
        ) => ({
          ...styles,
          backgroundColor: disabled ? "#F4F5F8" : "#fff",
          borderColor: isValidated || menuIsOpen ? "#8FE7D0" : "#DBDFEB",
          borderRadius: '0.25rem',
          borderStyle: "solid",
          borderWidth: isFocused ? 0.25 : 1,
          color: "#272E47",
          fontSize: 12,
          maxHeight: 32,
          minHeight: 32,
          height: 32,
          padding: 0,
          // paddingLeft: '0.625rem',
          fontFamily: "Roboto",
          width: customWidth,
          "&:hover": {
            borderWidth: isFocused ? 0.5 : 1,
          },
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: 12,
          fontStyle: "italic",
          lineHeight: '1rem',
          fontFamily: "Roboto",
          letterSpacing: 0,
          color: "#BBBFC6",
          padding: 0,
          paddingLeft: 2,
          margin: 0,
        }),
        clearIndicator: (base) => ({
          ...base,
          // backgroundColor: '#f99',
          height: 28,
          maxHeight: 28,
          paddingTop: 4.5,
          paddingRight: 4.5,
        }),
        container: (base) => ({
          ...base,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '3.125rem',
          padding: 0,
          width: customWidth,
          fontSize: '0.75rem',
          marginLeft: hasMarginLeft ? '1.25rem' : 0,
          ...style,
        }),
        dropdownIndicator: (base, { isFocused }) => ({
          ...base,
          backgroundColor: '#fff',
          borderWidth: 0,
          borderLeftWidth: isFocused ? 1 : 0,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          height: 30,
          borderStyle: "solid",
          borderColor: "#8FE7D0",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#fff",
          marginTop: -2.5,
          borderRadius: 0,
          width: customWidth,
          zIndex: 1099,
        }),
        menuList: (base) => ({
          ...base,
          borderRadius: 0,
          width: customWidth,
          overflowX: 'hidden',
          zIndex: 1099,
        }),
        option: (styles, { isDisabled, isFocused, isSelected, label }) => {
          const color = chroma("#8FE7D0");
          return {
            ...styles,
            fontSize: badge ? 10 : 12,
            fontWeight: badge ? 'bold' : 'normal',
            textTransform: badge ? 'uppercase' : 'normal',
            backgroundColor:
              badge ? badgeColors[label] :
                isDisabled ? null :
                isSelected ? "#8FE7D0" :
                isFocused ? "#f4f5f8" :
                null,
            color: badge || isSelected ? "#fff" : isFocused ? "#8FE7D0" : "#272E47",
            width: badge ? 'auto' : customWidth,
            paddingTop: badge ? 4 : 8,
            paddingLeft: badge ? 16 : 10,
            paddingRight: badge ? 16 : 'auto',
            paddingBottom: badge ? 4 : 8,
            marginTop: badge ? 8 : 4,
            marginLeft: badge ? 4 : 4,
            marginRight: badge ? 4 : 4,
            marginBottom: badge ? 8 : 4,
            borderRadius: badge ? 20 : 0,
            zIndex: 1099,
            ":active": {
              ...styles[":active"],
              backgroundColor:
                !isDisabled && (isSelected ? color : color.alpha(0.3).css()),
            },
          };
        },
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        borderWidth: 0.5,
        colors: {
          ...theme.colors,
          primary25: "#8FE7D0",
          primary: "#8FE7D0",
        },
      })}
    />
  );
};
