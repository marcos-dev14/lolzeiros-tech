import { useCallback, useState } from 'react';

import { MainContainer, Container, Tag, DeleteTag } from './styles';

import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { api } from '@/src/services/api';

interface Props {
  name: string;
  width?: string;
  validated?: boolean;
  fullW?: boolean;
  defaultValue: string;
  attributeId: number;
  productId: number;
  updateSubAttributeValue: (values: string) => void;
  handleDeleteSubAttribute: () => void;
}

export function ProductFormTagInput({
  name: inputName,
  defaultValue,
  validated = false,
  width = '40.25rem',
  fullW = false,
  attributeId,
  productId,
  updateSubAttributeValue,
  handleDeleteSubAttribute
}: Props) {
  const [formattedTags, setFormattedTags] = useState(
    () => !!defaultValue ? defaultValue.split(',') : []);

  const updateSubAttributes = useCallback(async (value: string) => {
    try {
      let endpoint =
        `/products/${productId}/attributes/${attributeId}`;

      await api.put(endpoint, { value })
      updateSubAttributeValue(value)
    } catch(e) {
      console.log('e', e)
    }
  }, [productId, attributeId, updateSubAttributeValue])

  const deleteTag = useCallback(async (value: string) => {
    try{
      let tempTags = formattedTags.filter((t) => t !== value);
      const formattedValue = tempTags.join(',')

      if(!tempTags.length) {
        handleDeleteSubAttribute();
        return;
      }

      await updateSubAttributes(formattedValue)

      setFormattedTags(tempTags)
    } catch(e) {
      console.log('e', e);
    }
  }, [formattedTags, handleDeleteSubAttribute, updateSubAttributes])

  return (
    <MainContainer noTitle fullW={fullW}>
      <Container
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
      </Container>
    </MainContainer>
  );
}
