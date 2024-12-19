import { useCallback, useEffect, useRef, useState } from 'react';

import { Form } from '@unform/web';
import { Scope, FormHandles } from '@unform/core';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { SearchBox } from '~components/SearchBox';
import { Attribute } from '~components/Attribute';

import { Container, CustomHeader, Button } from './styles';
import { MenuAndTableContainer } from '~styles/components';
import { api } from '~api';

export type SubAttribute = {
  id: number;
  name: string;
  values: string;
}

export type MainAttribute = {
  id: number;
  name: string;
  registered: boolean;
  products_count: number;
  attributes: SubAttribute[];
}

export function Attributes() {
  const [attributes, setAttributes] = useState<MainAttribute[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<MainAttribute[]>([]);

  const handleSearch = useCallback((search: string) => {
    setFilteredAttributes(attributes.filter(
      (r) => r.name.toLowerCase().includes(search.toLowerCase())
    ));
  }, [attributes]);

  const handleAddNewAttribute = useCallback(() => {
    const newAttribute: MainAttribute = {
      id: Date.now() + attributes.length + 1,
      name: '',
      products_count: 0,
      registered: false,
      attributes: [ { id: Date.now(), name: '', values: '' }]
    }
    setFilteredAttributes(attr => [...attr, newAttribute])
  }, [attributes]);

  const handleRemoveAttribute = useCallback(async (value: number) => {      
    setFilteredAttributes(attr => attr.filter(({ id }) => id !== value));
  }, []);
  
  const handleSortSubAttributes = useCallback(
    (value: number, attributes: SubAttribute[]) => {      
      setFilteredAttributes(a =>
        a.map((a) => a.id === value ? ({...a, attributes }) : a)
      );
  }, []);

  // const handleAddNewSubAttribute = useCallback((id: number) => {
  //   const currentAttributeIndex = attributes.findIndex(a => a.id === id);
    
  //   if(currentAttributeIndex < 0) return;
    
  //   const tempAttributes = [...attributes];
  //   const currentAttribute: MainAttribute = tempAttributes[currentAttributeIndex];
    
  //   const newId = currentAttribute.attributes.length + 1 + Date.now();

  //   const newAttribute: MainAttribute = {
  //     ...currentAttribute,
  //     attributes: [...currentAttribute.attributes, { id: newId, name: '' }]
  //   }

  //   tempAttributes[currentAttributeIndex] = newAttribute;

  //   setAttributes(tempAttributes)
  // }, [attributes]);

  // const handleRemoveSubAttribute = useCallback((name: string, subAttribute: number) => {
  //   const currentAttributeIndex = attributes.findIndex(a => a.name === name);
    
  //   if(currentAttributeIndex < 0) return;
        
  //   const tempAttributes = [...attributes];
  //   let currentAttribute: MainAttribute = tempAttributes[currentAttributeIndex];

  //   const subAttributes = currentAttribute.attributes.map(({ id }, idx) => ({
  //     id, name: formRef.current?.getFieldValue(`attributes[${currentAttributeIndex}].attributes[${idx}].name`)
  //   })).filter(a => a.id !== subAttribute);

  //   const updatedAttribute: MainAttribute = {
  //     ...currentAttribute,
  //     attributes: subAttributes
  //   }
     
  //   tempAttributes[currentAttributeIndex] = updatedAttribute;
  //   setAttributes(tempAttributes);
  // }, [attributes]);

  const formRef = useRef<FormHandles>(null);

  const fetchAttributes = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.get('/products/attribute-categories');

      const currentAttributes = data.map((a: MainAttribute) => ({...a, registered: true}));
      
      setAttributes(currentAttributes);
      setFilteredAttributes(currentAttributes);
    } catch(e) {
      console.log('e', e);
    }
  }, []);

  useEffect(() => {
    fetchAttributes();
  }, []);

  return (
    <>
      <Header route={['Loja Online', 'Atributos']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <CustomHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => setFilteredAttributes(attributes)}
            />
            <Button
              onClick={handleAddNewAttribute}
            >
              Novo Atributo
            </Button>
          </CustomHeader>
          <Form ref={formRef} onSubmit={() => {}}>
            {filteredAttributes.map((a, index) =>
              <Scope key={a.id} path={`attributes[${index}]`}>
                <Attribute
                  attribute={a}
                  attributeIndex={index}
                  ref={formRef}
                  sortSubAttributes={handleSortSubAttributes}
                  removeCurrentAttribute={handleRemoveAttribute}
                />
              </Scope>
            )}
          </Form>
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
