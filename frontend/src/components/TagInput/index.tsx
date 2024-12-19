import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MainContainer, Container, Tag, DeleteTag, Input } from './styles';

import { isNotEmpty } from '~utils/validation';
import { InputProps, ITag } from '~types/main';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

interface Props extends InputProps {
  tags: ITag[];
  setTags: Function;
  width?: string;
  title?: string;
  validated?: boolean;
  fullW?: boolean;
}

export function TagInput({
  tags,
  setTags,
  title = '',
  validated = false,
  width = '40.25rem',
  fullW = false,
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tagContent, setTagContent] = useState("");
  
  const deleteTag = useCallback((tagId: string) => 
    // setTags((prev: ITag[]) => prev.filter(({ id }) => id !== tagId))
    setTags(tags.filter(({ id }) => id !== tagId))
  , [tags, setTags])
  
  const handleTagContent = useCallback(() => {
    if (isNotEmpty(tagContent)) {
      // setTags((prev: ITag[]) => [...prev, { id: tagContent, value: tagContent}])
      setTags([...tags, { id: tagContent, value: tagContent}])
      setTagContent('');
      
      return;
    }
  }, [tags, tagContent, setTags]);

  const enterKeyOptions = useMemo(
    () => ["Enter", "NumpadEnter", "enter", "numpadenter"],
    []
  );

  const handleKeyDown = useCallback((code) => {
    if(enterKeyOptions.includes(code)) {
      handleTagContent();
    };

    if(code === 'Backspace' && !!tags.length && !tagContent) {
      deleteTag(tags[tags.length - 1].id);
    }
  }, [tagContent, handleTagContent, enterKeyOptions, deleteTag, tags]);

  return (
    <MainContainer hasTitle={!!title} fullW={fullW}>
      <label htmlFor={title}>{title}</label>
      <Container
        onClick={() => inputRef?.current?.focus()} width={fullW ? '100%' : width}
        validated={validated || !!tags.length}
      >
        {tags.map(({ id, value }) => 
          <Tag key={id}>
            <p>{value}</p>
            <DeleteTag onClick={() => deleteTag(id)} type="button">
              <CloseIcon />
            </DeleteTag>
          </Tag>
        )}
        <Input
          id={title}
          ref={inputRef}
          value={tagContent}
          onChange={(e) => {
            e.preventDefault();
            setTagContent(e.target.value);
          }}
          onKeyDown={({ code }) => handleKeyDown(code)}
          hasElements={!!tags.length}
          {...rest}
        />
      </Container>
    </MainContainer>
  );
}
