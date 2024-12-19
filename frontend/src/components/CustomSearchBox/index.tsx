import { isNotEmpty } from '@/src/utils/validation';
import { InputHTMLAttributes, useCallback, useMemo, useState } from 'react';

import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { ReactComponent as SearchIcon } from '~assets/Search.svg';

import { Container, Input, ClearInput, SearchButton } from './styles'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  search: string;
  setSearch: (value: string) => void;
  onClear?: () => void;
  handleSearch?: () => void;
  fullW?: boolean;
}

export function CustomSearchBox({
  handleSearch = () => {},
  onClear = () => {},
  search,
  setSearch,
  placeholder = "Digite aqui...",
  fullW = false
}: Props) {
  // const enterKeyOptions = useMemo(() => 
  //   ["Enter", "NumpadEnter", "enter", "numpadenter"]
  // , []);

  const handleOnClear = useCallback(() => {
    setSearch('');
    onClear();
  }, [onClear, setSearch]);

  // const handleKeyDown = useCallback((code) => 
  //   enterKeyOptions.includes(code) && handleSearch()
  // , [enterKeyOptions, handleSearch]);

  return (
    <Container
      fullW={fullW}
    >
      <Input
        placeholder={placeholder}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={(e) => {
          if(!e.target.value.length) 
            handleOnClear()
        }}
        // onKeyDown={({ code }) => handleKeyDown(code)}
      />
      <ClearInput onClick={handleOnClear}>
        <CloseIcon />
      </ClearInput>
      <SearchButton onClick={handleSearch}>
        <SearchIcon />
      </SearchButton>
    </Container>
  );
}

