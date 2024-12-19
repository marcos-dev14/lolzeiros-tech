import { useCallback, useState } from 'react';

import { MainContainer, Container, Tag, DeleteTag } from './styles';

import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { api } from '@/src/services/api';

interface Props {
  width?: string;
  validated?: boolean;
  fullW?: boolean;
  defaultValue: string;
}

export function SupplierTagInput({
  defaultValue,
  validated = false,
  width = '40.25rem',
  fullW = false,
}: Props) {
  const [formattedTags, setFormattedTags] = useState(
    () => !!defaultValue ? defaultValue.split(',') : []);

  const updateSubAttributes = useCallback(async (value: string) => {
    try {
    } catch(e) {
      console.log('e')
    }
  }, [])

  const deleteTag = useCallback(async (value: string) => {
    try{
      let tempTags = formattedTags.filter((t) => t !== value);
      const formattedValue = tempTags.join(',')

      if(!tempTags.length) {
        return;
      }

      await updateSubAttributes(formattedValue)

      setFormattedTags(tempTags)
    } catch(e) {
      console.log('e', e);
    }
  }, [formattedTags, updateSubAttributes])

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
