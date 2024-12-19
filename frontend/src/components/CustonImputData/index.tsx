import React, { useState } from "react";
import { ReactComponent as DateIcon } from "../../assets/date.svg";
import { CustomBox, DateBoxBadge, DateInput } from "./styles";

interface CustomInputDateProps {
  disabled?: boolean;
  width?: string;
  showTime?: boolean;
  onDateSelect: (dateString: string) => void;
}

const CustomInputDate: React.FC<CustomInputDateProps> = ({
  onDateSelect,
  disabled,
  width = "7.5rem",
  showTime = true,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = event.target.value;
    console.log(newDateValue);
    setInputValue(newDateValue);
    onDateSelect(newDateValue); // Passa apenas a data, sem formatar para ISO string
  };

  return (
    <CustomBox>
      <div>
        <DateBoxBadge validated>
          <DateIcon />
        </DateBoxBadge>
        <DateInput
          validated
          type={showTime ? "datetime-local" : "date"}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          width={width}
        />
      </div>
    </CustomBox>
  );
};

export default CustomInputDate;
