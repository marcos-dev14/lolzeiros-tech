import { useCallback, useMemo, useRef, useState } from 'react';

import { MainContainer, Container, Tag, DeleteTag, Input } from './styles';

import { isNotEmpty } from '~utils/validation';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { TagInputFormInput } from '../TagInputFormInput';
import { api } from '@/src/services/api';

interface Props {
  name: string;
  title: string;
  width?: string;
  validated?: boolean;
  fullW?: boolean;
  noTitle?: boolean;
  defaultValue: string;
  attributeId: number;
  id: number;
  updateSubAttributeValue: (id: number, values: string) => void
}

export function FormTagInput({
  name: inputName,
  title,
  defaultValue,
  validated = false,
  width = '40.25rem',
  fullW = false,
  noTitle = false,
  id,
  attributeId,
  updateSubAttributeValue
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [tagContent, setTagContent] = useState("");
  const [formattedTags, setFormattedTags] = useState(
    () => !!defaultValue ? defaultValue.split(',') : []);

  const updateSubAttributes = useCallback(async (value: string) => {
    try {
      const upload = new FormData();
      upload.append('values', value)

      let endpoint =
        `/products/attribute-categories/${attributeId}/attributes/${id}?_method=PUT`;

      await api.post(endpoint, upload)
      updateSubAttributeValue(id, value)
    } catch(e) {
      console.log('e', e)
    }
  }, [attributeId, id, updateSubAttributeValue])

  const deleteTag = useCallback(async (value: string) => {
    try{
      let tempTags = formattedTags.filter((t) => t !== value);
      const formattedValue = tempTags.join(',')

      await updateSubAttributes(formattedValue)

      inputRef!.current!.value = tempTags.join(',');
      setFormattedTags(tempTags)
    } catch(e) {
      console.log('e', e);
    }
  }, [formattedTags, updateSubAttributes])
  
  const addTag = useCallback(async () => {
    try {
      if (isNotEmpty(tagContent)) {
        let tempTags = [...formattedTags, tagContent];
        const formattedValue = tempTags.join(',')

        await updateSubAttributes(formattedValue)

        inputRef!.current!.value = tempTags.join(',');

        setFormattedTags(tempTags)
        setTagContent('');
      }
    } catch (e) {
      console.log('e', e);
    }
  }, [formattedTags, tagContent, updateSubAttributes]);

  const enterKeyOptions = useMemo(
    () => ["Enter", "NumpadEnter", "enter", "numpadenter"],
    []
  );

  const handleKeyDown = useCallback((code) => {
    if(enterKeyOptions.includes(code)) {
      addTag();
    };

    if(code === 'Backspace' && !!formattedTags.length && !tagContent) {
      deleteTag(formattedTags[formattedTags.length - 1]);
    }
  }, [tagContent, addTag, enterKeyOptions, deleteTag, formattedTags]);

  return (
    <MainContainer noTitle={noTitle} fullW={fullW}>
      {!noTitle && <label htmlFor={inputName}>{title}</label>}
      <Container
        onClick={() => inputRef?.current?.focus()}
        width={fullW ? '100%' : width}
        validated={validated || !!formattedTags?.length}
      >
        {formattedTags.map((value) => 
          <Tag key={value}>
            <p>{value}</p>
            <DeleteTag onClick={() => deleteTag(value)} type="button">
              <CloseIcon />
            </DeleteTag>
          </Tag>
        )}
        <Input
          id={inputName}
          ref={inputRef}
          value={tagContent}
          onChange={(e) => setTagContent(e.target.value)}
          onKeyDown={({ code }) => handleKeyDown(code)}
          hasElements={!!formattedTags.length}
        />
      </Container>
    </MainContainer>
  );
}
