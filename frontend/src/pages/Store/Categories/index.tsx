import { useCallback, useEffect, useRef, useState } from 'react';

import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Form } from '@unform/web';
import { Scope, FormHandles } from '@unform/core';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { SearchBox } from '~components/SearchBox';
import { Category } from '~components/Category';
import { CustomSelect as Select } from '~components/Select';

import { Container, CustomHeader, Button } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { Supplier } from '~types/main';

import { api } from '~api';
import { Modal } from '@/src/components/Modal';
import { TitleInput } from '@/src/components/TitleInput';
import { SiteBox } from '@/src/components/SiteBox';

export type Attribute = {
  id: number;
  name: string;
  slug: string;
}

export interface ISupplier extends Supplier {
  attributes: Attribute[];
}

export function Categories() {
  const [categoryName, setCategoryName] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([] as ISupplier[]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<ISupplier[]>([] as ISupplier[]);

  const handleRemoveAttribute = useCallback((value) => {
    setSuppliers(ctr => ctr.filter(a => a.name !== value));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilteredSuppliers(suppliers.filter(
      (r) => r.name.toLowerCase().includes(search.toLowerCase())
    ));
  }, [suppliers]);

  // const handleAddNewSubAttribute = useCallback((name: string) => {
  //   const currentAttributeIndex = suppliers.findIndex(a => a.name === name);
    
  //   if(currentAttributeIndex < 0) return;
    
  //   const tempSuppliers = [...suppliers];
  //   const currentAttribute: ISupplier = tempSuppliers[currentAttributeIndex];
    
  //   const id = currentAttribute.attributes.length + 1 + Date.now();
    
  //   const newAttribute: ISupplier = {
  //     ...currentAttribute,
  //     attributes: [...currentAttribute.attributes, { id, name: '', slug: '' }]
  //   }
    
  //   tempSuppliers[currentAttributeIndex] = newAttribute;
    
  //   setSuppliers(tempSuppliers)
  // }, [suppliers]);

  const handleRemoveSubAttribute = useCallback((name: string, subAttribute: number) => {
    const currentAttributeIndex = suppliers.findIndex(a => a.name === name);
        
    if(currentAttributeIndex < 0) return;
        
    const tempSuppliers = [...suppliers];
    const currentAttribute: ISupplier = tempSuppliers[currentAttributeIndex];
    
    const subAttributes = currentAttribute.attributes.map(({ id, slug }, idx) => ({
      id, slug, name: formRef.current?.getFieldValue(`suppliers[${currentAttributeIndex}].suppliers[${idx}].name`)
    })).filter(a => a.id !== subAttribute);

    const updatedAttribute: ISupplier = {
      ...currentAttribute,
      attributes: subAttributes
    }

    tempSuppliers[currentAttributeIndex] = updatedAttribute;
    setSuppliers(tempSuppliers);

    // subAttributes.forEach((value, idx) => 
    //   formRef.current?.setFieldValue(`suppliers[0].suppliers[${idx}].name`, value.name)
    // );

    // @ts-ignore
    // formRef.current?.setData(data);
  }, [suppliers]);

  const formRef = useRef<FormHandles>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('products/suppliers');

      const currentSuppliers = data.map((c: ISupplier) => ({ ...c, attributes: [] }));

      setSuppliers(currentSuppliers);
      setFilteredSuppliers(currentSuppliers);
    } catch (error) {
      console.log('error', error)
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [])

  return (
    <>
      <Header route={['Loja Online', 'Categoria do Produto']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <CustomHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => setFilteredSuppliers(suppliers)}
            />
            <Button
              onClick={() => setIsNewCategoryModalOpen(true)}
            >
              Nova Categoria do Produto
            </Button>
          </CustomHeader>
          <Form ref={formRef} onSubmit={() => {}}>
            {filteredSuppliers.map((a, index) =>
              <Scope key={a.id} path={`suppliers[${index}]`}>
                <Category
                  supplier={a}
                />
              </Scope>
            )}
          </Form>
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Nova Categoria do Produto"
        isModalOpen={isNewCategoryModalOpen}
        setIsModalOpen={setIsNewCategoryModalOpen}
        style={{
          width: '31.25rem'
        }}
      >
        <InputContainer style={{ marginTop: '1.875rem' }}>
          <TitleInput
            title="Nome da Categoria (30 caracteres)"
            width="26.25rem"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Select
            title="Categoria Superior"
            customWidth="26.25rem"
            setValue={() => {}}
          />
        </InputContainer>
        <InputContainer>
          <SiteBox
            name="Link Personalizado"
            validated={false}
            // @ts-ignore
            value={link}
            // @ts-ignore
            onChange={(e) => setLink(e.target.value)}
            width="22.375rem"
          />
        </InputContainer>
        <Button
          onClick={() => {}}
          type="button"
          style={{ marginTop: '1.875rem', width: '100%' }}
        >
          {loading ? <LoadingIcon className="load" /> : 'Adicionar'}
        </Button>
      </Modal>
    </>
  );
}
