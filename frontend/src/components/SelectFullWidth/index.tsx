// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import chroma from "chroma-js";

import Select, { components } from "react-select";

import { Title, Indicator, Menu, DropdownImage } from "./styles";

import arrow from "../../assets/arrow_select.svg";
import { isOnSafari } from "@/src/utils/validation";

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
  const { customColor } = selectProps;

  return (
    <Indicator
      {...innerProps}
      isFocused={isFocused}
      style={customColor ? { backgroundColor: customColor } : {}}
    />
  );
};

const DropdownIndicator = ({ selectProps, ...rest }) => {
  // const { customColor } = selectProps;

  return (
    <components.DropdownIndicator {...rest}>
      <DropdownImage
        src={arrow}
        alt="Arrow Down Icon"
      />
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

interface DefaultValueProps {
  label: string;
  value: string;
}

interface CustomSelectProps {
  title: string;
  placeholder: string;
  customColor?: string;
  defaultValue?: DefaultValueProps;
  setValue: Function;
  fontSize?: number;
  hasMarginLeft?: boolean;
  data?: DefaultValueProps[];
  disabled?: boolean;
  error?: boolean;
  style?: object;
}

export const SelectFullWidth: React.FC<CustomSelectProps> = ({
  title,
  setValue,
  placeholder = 'Selecione...',
  data = [],
  fontSize = 12,
  defaultValue = {},
  customColor = "",
  hasMarginLeft = false,
  disabled = false,
  error = false,
  style,
}) => {
  const [isValidated, setIsValidated] = useState('');

  useEffect(() => {
    if(isValidated !== '') return;
    setIsValidated(!!defaultValue.value);
  }, [defaultValue, isValidated])

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
      onChange={({ value, label }) => {
        setIsValidated(!!value);
        setValue(label);
      }}
      // options={!data.length || colourOptions}
      options={colourOptions}
      customColor={customColor}
      defaultValue={defaultValue}
      fontSize={fontSize}
      styles={{
        control: (
          styles,
          { isFocused, selectProps: { style, menuIsOpen } }
        ) => ({
          ...styles,
          ...style,
          backgroundColor: "#fff",
          borderColor: customColor || (isValidated || menuIsOpen ? "#8FE7D0" : "#DBDFEB"),
          borderRadius: '0.25rem',
          borderStyle: "solid",
          borderWidth: isFocused ? 0.25 : 1,
          color: customColor || "#272E47",
          fontSize: 12,
          maxHeight: 32,
          minHeight: 32,
          height: 32,
          padding: 0,
          paddingLeft: 4,
          width: '100%',
          "&:hover": {
            borderWidth: isFocused ? 0.5 : 1,
          },
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: 12,
          fontStyle: "italic",
          lineHeight: 16,
          fontFamily: "Roboto",
          letterSpacing: 0,
          color: customColor || "#BBBFC6",
          padding: 0,
          paddingLeft: 2,
          margin: 0,
        }),
        container: (base) => ({
          ...base,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '3.125rem',
          // backgroundColor: '#f90',
          width: '100%',
          fontSize: '0.75rem',
          opacity: disabled ? 0.3 : 1,
          marginLeft: hasMarginLeft ? '1.25rem' : 0,
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
          width: '100%',
          zIndex: 1099,
        }),
        menuList: (base) => ({
          ...base,
          borderRadius: 0,
          width: '100%',
          zIndex: 1099,
        }),
        option: (styles, { isDisabled, isFocused, isSelected }) => {
          const color = chroma("#8FE7D0");
          return {
            ...styles,
            fontSize: 12,
            backgroundColor: isDisabled
              ? null
              : isSelected
              ? "#8FE7D0"
              : isFocused
              ? "#f4f5f8"
              : null,
            color: isSelected ? "#fff" : isFocused ? "#8FE7D0" : "#424242",
            width: '100%',
            marginLeft: 4,
            marginTop: 4,
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
