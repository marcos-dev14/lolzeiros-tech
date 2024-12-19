import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MainContainer, Container, Tag, DeleteTag, Input } from './styles';

import { isNotEmpty } from '~utils/validation';
import { InputProps, ITag } from '~types/main';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

interface Props extends InputProps {
  tags: string;
  width?: string;
  validated?: boolean;
  vertical?: boolean;
  customOnBlur: Function;
  deleteTag: (value: string) => void;
}

export function VerticalTagInput({
  tags,
  validated = false,
  width = '40.25rem',
  style = {},
  customOnBlur,
  deleteTag,
  disabled = false,
  vertical = false,
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  // o id é o id do produto SE currentData e qualquer coisa s eo 
  const formattedTags = useMemo(() =>
    tags.split(',').map((e, index) => ({ id: `${index}-${e}`, value: e }))
  , [tags]);
  const [tagContent, setTagContent] = useState("");

  // const enterKeyOptions = useMemo(() =>
  //   ["Enter", "NumpadEnter", "enter", "numpadenter"]
  // , []);

  // const deleteTag = useCallback((tagId: string) => {

  //   // setTags((prev: ITag[]) => prev.filter(({ id }) => id !== tagId))
  //   // setTags(tags.filter(({ id }) => id !== tagId))
  //   // , [tags, setTags]
  // }, [])

  // const handleTagContent = useCallback(() => {
  //   if (isNotEmpty(tagContent)) {
  //     // setTags((prev: ITag[]) => [...prev, { id: tagContent, value: tagContent}])
  //     // setTags([...tags, { id: tagContent, value: tagContent}])
  //     setTagContent('');
      
  //     return;
  //   }
  // // }, [tags, tagContent, setTags]);
  // }, [tags, tagContent]);

  // const handleKeyDown = useCallback((code) => {
  //   if(enterKeyOptions.includes(code)) {
  //     handleTagContent();
  //   };

  //   if(code === 'Backspace' && !!tags.length && !tagContent) {
  //     // deleteTag(tags[tags.length - 1].id);
  //   }
  // }, [tagContent, handleTagContent, enterKeyOptions, deleteTag, tags]);

  return (
    <MainContainer width={width}>
      <Container
        validated={validated || !!formattedTags.length}
        disabled={disabled}
        onClick={() => inputRef.current?.focus()}
        multipleElements={tags.length > 1}
      >
        {!!tags && formattedTags.map(({ id, value }) => 
          <Tag key={id}>
            <p title={value}>{value}</p>
            <DeleteTag
              onClick={() => deleteTag(value)}
              type="button"
            >
              <CloseIcon />
            </DeleteTag>
          </Tag>
        )}
        </Container>
        {!disabled &&
          <Input
            ref={inputRef}
            // onKeyDown={({ code }) => handleKeyDown(code)}
            hasElements={!!tags.length}
            value={tagContent}
            onChange={(e) => setTagContent(e.target.value)}
            onBlur={({ target: { value } }) => {
              customOnBlur(value);
              setTagContent('');
              }
            }
            disabled={disabled}
            {...rest}
          />
        }
    </MainContainer>
  );
}
