import { forwardRef, useCallback, useState } from 'react';

import { ReactComponent as PlusWhiteIcon } from '~assets/plus_white.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as MoveIcon } from '~assets/move.svg'
import { ReactComponent as TrashWhiteIcon } from '~assets/trash_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_white.svg'
import { ReactComponent as SortIcon } from '~assets/sort_alphabetical.svg'

import { Container, Header, Content, ArrangeOrderButton } from './styles';

import { FormInput } from '~components/FormInput';
import { FormTagInput } from '../FormTagInput';
import { FormMaxCharactersInput } from '~components/FormMaxCharactersInput';
import { TableActionButton } from '~styles/components/tables';
import { MainAttribute, SubAttribute } from '@/src/pages/Store/Attributes';

import { ConfirmationModal } from '@/src/components/ConfirmationModal';

import { api } from '~api';

import { sortByField } from '~utils/sorting';

interface CurrentSubAttribute extends SubAttribute {
  registered: boolean;
}

type Props = {
  attribute: MainAttribute;
  attributeIndex: number;
  sortSubAttributes?: (id: number, attributes: SubAttribute[]) => void; 
  removeCurrentAttribute?: (value: number) => void;
}

export const Attribute = forwardRef<{}, Props>(({
  attribute,
  attributeIndex,
  sortSubAttributes,
  removeCurrentAttribute,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDeletingAttribute, setCurrentDeletingAttribute] = useState('');
  const [currentDeletingSubAttribute, setCurrentDeletingSubAttribute] = useState<CurrentSubAttribute>(null as unknown as CurrentSubAttribute);
  const [isDeleting, setIsDeleting] = useState(-1);
  const [registered, setRegistered] = useState(attribute.registered);
  const [subAttributes, setSubAttributes] = useState<CurrentSubAttribute[]>(
    () => attribute.attributes.map(a => ({...a, registered: true}))
  );

  const addNewSubAttribute = useCallback(() => {
    const newSubAttribute = {
      id: Date.now() + subAttributes.length + 1,
      name: '',
      values: '',
      registered: false
    }

    setSubAttributes(prev => [...prev, newSubAttribute]);
  }, [subAttributes]);
  
  const updateSubAttributeValue = useCallback((id: number, values: string) => {
    const subAttributeIndex = subAttributes.findIndex(a => a.id === id)
    
    let tempSubAttributes = [...subAttributes];
    
    const subAttribute: CurrentSubAttribute = {
      ...tempSubAttributes[subAttributeIndex],
      values
    };
    
    tempSubAttributes[subAttributeIndex] = subAttribute;
    
    setSubAttributes(tempSubAttributes);
  }, [subAttributes]);

  const handleAttributeName = useCallback(async (option: 'create' | 'update') => {
    try {      
      // @ts-ignore
      const attributeName = ref?.current?.getFieldValue(`attributes[${attributeIndex}].name`);
      if(!attributeName) return;
      const upload = new FormData();
      upload.append('name', attributeName)

      let endpoint = '/products/attribute-categories';
        
      if(option === 'update') 
        endpoint = `${endpoint}/${attribute.id}?_method=PUT`;
      
      await api.post(endpoint, upload)
      setRegistered(true);
    } catch(e) {
      console.log('e', e);
    }
  }, [attribute, ref, attributeIndex]);

  const handleDeleteAttribute = useCallback(async () => {
    try {
      const { id } = attribute;
          
      setIsDeleting(id);
      
      await api.delete(`/products/attribute-categories/${id}`);

      // @ts-ignore
      removeCurrentAttribute(id);
    } catch(e) {
      console.log('e', e);
    } finally {
      setIsDeleting(-1);
      setCurrentDeletingAttribute('');
    }
  }, [attribute, removeCurrentAttribute]);

  const handleSubAttributeName = useCallback(async (id: number, value: string, index: number, option: 'create' | 'update') => {
    try {      
      if(!value) return;
      
      const upload = new FormData();
      upload.append('name', value)

      let endpoint = `/products/attribute-categories/${attribute.id}/attributes`;
        
      if(option === 'update') 
        endpoint = `${endpoint}/${id}?_method=PUT`;
      
      const {
        data: { data }
      } = await api.post(endpoint, upload)

      setSubAttributes(
        prev => prev.map(s => s.id === id ? ({...data, registered: true}) : s)
      );

    } catch(e) {
      console.log('e', e);
    }
  }, [attribute.id]);

  const handleDeleteSubAttribute = useCallback(
    async () => {
      try {
        const { id: attributeId } = attribute;
        const { id, registered } = currentDeletingSubAttribute;
        setIsDeleting(id);

        if(registered) { 
          await api.delete(`/products/attribute-categories/${attributeId}/attributes/${id}`);
        }

        setSubAttributes(prev => prev.filter(s => s.id !== id));
      } catch(e) {
        console.log('e', e);
      } finally {
        setIsDeleting(-1);
        setCurrentDeletingSubAttribute(null as unknown as CurrentSubAttribute);
      }
  }, [currentDeletingSubAttribute, attribute]);

  const handleSortingByField = useCallback(async (id: number) => {
    try {
      await api.post(`/products/attribute-categories/${attribute.id}/attributes/sort?_method=PUT`);
      
      // @ts-ignore
      sortSubAttributes(id, sortByField(subAttributes, 'name'))
    } catch (e) {
      console.log('e', e);
    }
  }, [attribute.id, subAttributes, sortSubAttributes]);

  return (
    <>
    <Container>
      <Header>
        <div>
          <strong>Mover</strong>
        </div>
        <div>
          <FormMaxCharactersInput
            name="name"
            title="name"
            defaultValue={attribute.name}
            noTitle
            width="13.75rem"
            maxLength={30}
            customOnBlur={() => handleAttributeName(registered ? 'update': 'create')}
          />
        </div>
        <div>
          <strong>Descrição do Atributo</strong>
        </div>
          <div>
            <FormInput
              name="products_count"
              title="products_count"
              defaultValue={`${attribute.products_count} produtos`}
              noTitle
              validated
              disabled
              width="6.375rem"
            />
          </div>
          <div>
            <ArrangeOrderButton          
              disabled={!subAttributes.length}
              onClick={() => handleSortingByField(attribute.id)}
            >
              <SortIcon />
            </ArrangeOrderButton>
          </div>
          <div>
            <TableActionButton
              disabled={!subAttributes.length}
              onClick={() => setIsOpen(s => !s)}
            >
              {isOpen ? <CollapseIcon /> : <ExpandIcon />}
            </TableActionButton>
            <TableActionButton
              onClick={() => {
                addNewSubAttribute();
                setIsOpen(true)
              }}
            >
              <PlusWhiteIcon />
            </TableActionButton>
            <TableActionButton
              onClick={() => setCurrentDeletingAttribute(attribute.name)}
              disabled={isDeleting === attribute.id}
            >
              <TrashWhiteIcon />
            </TableActionButton>
        </div>
      </Header>
      {isOpen &&
      subAttributes.map(({ id, name, registered, values }, idx) => 
        (<>
          <Content key={id}>
            <div>
              <MoveIcon />
            </div>
            <div>
              <FormMaxCharactersInput
                name={`attributes[${idx}].name`}
                title=""
                noTitle
                defaultValue={name}
                width="13.75rem"
                maxLength={30}
                customOnBlur={(value: string) =>
                  handleSubAttributeName(id, value, idx, registered ? 'update' : 'create')
                }
              />
            </div>
            <div>
              <FormTagInput
                name="tagInputTeste"
                title=""
                noTitle
                defaultValue={values}
                attributeId={attribute.id}
                id={id}
                updateSubAttributeValue={updateSubAttributeValue}
              />
            </div>
            <div>
              
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <TableActionButton
                  onClick={() => addNewSubAttribute()}
                >
                  <PlusIcon />
                </TableActionButton>
                <TableActionButton
                  disabled={isDeleting === id}
                  onClick={() =>
                    setCurrentDeletingSubAttribute({ id, name, registered, values })
                  }
                >
                  <TrashIcon />
                </TableActionButton>
              </div>
            </div>
          </Content>
        </>))
        }
    </Container>
      <ConfirmationModal
        category={currentDeletingAttribute}
        action={handleDeleteAttribute}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setCurrentDeletingAttribute('')
        }
      />
      <ConfirmationModal
        category={!!currentDeletingSubAttribute ? currentDeletingSubAttribute.name : ''}
        action={handleDeleteSubAttribute}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setCurrentDeletingSubAttribute(null as unknown as CurrentSubAttribute)
        }
      />
    </>
  );
});

