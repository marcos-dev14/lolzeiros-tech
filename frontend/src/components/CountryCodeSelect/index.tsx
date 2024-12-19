// @ts-nocheck
import React, { useMemo } from "react";
import chroma from "chroma-js";

import Select, { components } from "react-select";

import { DropdownImage } from "./styles";

import arrow from "../../assets/arrow_select.svg";

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
    <></>
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
  return (
    <components.SelectContainer {...props}>
      {children}
    </components.SelectContainer>
  );
};

interface DefaultValueProps {
  label: string;
  value: string;
}

interface CustomSelectProps {
  placeholder: string;
  customColor?: string;
  defaultValue?: DefaultValueProps;
  setValue: Function;
  customWidth?: string | number;
  fontSize?: number;
  hasMarginLeft?: boolean;
  data?: DefaultValueProps[];
  disabled?: boolean;
  validated?: boolean;
  error?: boolean;
  style?: object;
}

export const CountryCodeSelect: React.FC<CustomSelectProps> = ({
  setValue,
  placeholder,
  data = [],
  fontSize = 12,
  defaultValue = {},
  customWidth = '4.875rem',
  customColor = "",
  hasMarginLeft = false,
  disabled = false,
  validated = false,
  error = false,
  style,
}) => {
  return (
    <Select
      placeholder={placeholder}
      components={{
        SelectContainer,
        Placeholder,
        DropdownIndicator,
        IndicatorSeparator
      }}
      isDisabled={disabled}
      onChange={({ label }) => setValue(label)}
      // options={!data.length || colourOptions}
      options={colourOptions}
      customWidth={customWidth}
      customColor={customColor}
      defaultValue={defaultValue}
      fontSize={fontSize}
      styles={{
        control: (
          styles,
          { isFocused, selectProps: { style, menuIsOpen, validated } }
        ) => ({
          ...styles,
          ...style,
          backgroundColor: "#fff",
          // borderColor: customColor || (menuIsOpen ? "#8FE7D0" : "#DBDFEB"),
          borderColor: validated ? "#8FE7D0" : "#DBDFEB",
          borderRadius: 0,
          borderTopLeftRadius: '0.25rem',
          borderBottomLeftRadius: '0.25rem',
          borderStyle: "solid",
          // borderWidth: isFocused || validated ? 0.25 : 1,
          borderWidth: validated ? 0.25 : 1,
          color: customColor || "#272E47",
          fontSize: 12,
          maxHeight: '2rem',
          minHeight: '2rem',
          height: '2rem',
          padding: 0,
          paddingLeft: 4,
          width: customWidth,
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
          height: '2rem',
          // backgroundColor: '#f90',
          width: customWidth,
          fontSize: '0.75rem',
          opacity: disabled ? 0.3 : 1,
          marginLeft: hasMarginLeft ? 15.5 : 0,
        }),
        dropdownIndicator: (base, { validated }) => ({
          ...base,
          backgroundColor: '#fff',
          borderWidth: 0,
          height: '1.85rem',
          width: '1.8125rem',
          borderStyle: "none",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#fff",
          marginTop: -2.5,
          borderRadius: 0,
          width:  customWidth,
          zIndex: 1099,
        }),
        menuList: (base) => ({
          ...base,
          borderRadius: 0,
          width: customWidth,
          zIndex: 1099,
          overflowX: 'hidden'
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
            width: customWidth,
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
