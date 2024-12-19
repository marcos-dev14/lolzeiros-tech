import { InputHTMLAttributes, useCallback } from 'react';

import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { ReactComponent as SearchIcon} from '~assets/Search.svg';

import { Container, Input, ClearInput, SearchButton } from './styles'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  search: () => void;
}

export function TableSearchBox({
  value,
  setValue,
  search,
  placeholder = "Digite aqui...",
  ...rest
}: Props) {
  const handleKeyDown = useCallback((code) => {
    const enterKeyOptions = ["Enter", "NumpadEnter", "enter", "numpadenter"]
    
    if(enterKeyOptions.includes(code)) {
      search();
    };
  }, [search]);

  return (
    <Container>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        onKeyPress={({ code }) => handleKeyDown(code)}
        {...rest}
      />
      <ClearInput onClick={() => setValue('')}>
        <CloseIcon />
      </ClearInput>
      <SearchButton onClick={search}>
        <SearchIcon />
      </SearchButton>
    </Container>
  );
}

