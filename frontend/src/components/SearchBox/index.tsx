import { isNotEmpty } from '@/src/utils/validation';
import { InputHTMLAttributes, useCallback, useMemo, useState } from 'react';

import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { ReactComponent as SearchIcon } from '~assets/Search.svg';

import { Container, Input, ClearInput, SearchButton } from './styles'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  search?: (value: string) => void;
  onClear?: () => void;
  fullW?: boolean;
}

export function SearchBox({
  search = () => {},
  onClear = () => {},
  placeholder = "Digite aqui...",
  fullW = false
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const enterKeyOptions = useMemo(
    () => ["Enter", "NumpadEnter", "enter", "numpadenter"],
    []
  );

  const handleSearch = useCallback(() => {
    if(!isNotEmpty(searchTerm)) return;

    search(searchTerm);
  }, [searchTerm, search]);

  const handleOnClear = useCallback(() => {
    setSearchTerm('');
    onClear();
  }, [onClear]);

  const handleKeyDown = useCallback((code) => 
    enterKeyOptions.includes(code) && handleSearch()
  , [enterKeyOptions, handleSearch]);

  return (
    <Container
      fullW={fullW}
    >
      <Input
        placeholder={placeholder}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // onBlur={(e) => {
        //   if(!e.target.value.length) 
        //     handleOnClear()
        // }}
        onKeyDown={({ code }) => handleKeyDown(code)}
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

