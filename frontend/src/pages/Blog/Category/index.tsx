import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ReactComponent as SortIcon } from '~assets/sort_alphabetical.svg'
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Form } from '@unform/web';
import { Scope, FormHandles } from '@unform/core';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { CustomSearchBox } from '~components/CustomSearchBox';
import { BlogCategory as BlogCategoryComponent } from '~components/BlogCategory';
import { Input } from '@/src/components/Input';
import { CustomSelect as Select } from '@/src/components/Select';

import { Container, CustomHeader, Button } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { DefaultValuePropsWithId, IBlogCategory } from '~types/main';

import { api } from '~api';
import { Modal } from '@/src/components/Modal';
import { TitleInput } from '@/src/components/TitleInput';
import { SiteBox } from '@/src/components/SiteBox';
import { isNotEmpty } from '@/src/utils/validation';

export type Attribute = {
  id: number;
  name: string;
  slug: string;
}

export function BlogCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [link, setLink] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [parentCategories, setParentCategories] = useState<DefaultValuePropsWithId[]>([] as DefaultValuePropsWithId[]);
  
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [editParentCategory, setEditParentCategory] = useState('');
  const [oldParentCategoryId, setOldParentCategoryId] = useState('');
  
  const [categories, setCategories] = useState<IBlogCategory[]>([]);
  
  const filteredCategories = useMemo(() => isNotEmpty(search) ?
     categories.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())) :
     categories
  , [categories, search]);

  const formRef = useRef<FormHandles>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('blogs/categories');

      setCategories(data);
      // const currentSuppliers = data.map((c: ISupplier) => ({ ...c, attributes: [] }));

      // @ts-ignore
      setParentCategories(data.map(e => ({ id: e.id, value: e.name, label: e.name })));
      // setFilteredCategories(currentSuppliers);
    } catch (error) {
      console.log('error', error)
    }
  }, []);

  const handleAddCategory = useCallback(async () => {
    try {
      setAddingCategory(true);
      
      let request = {
        name: categoryName
      }

      if(!!parentCategory) //@ts-ignore
        request = {...request, parent_id: parentCategory};

      const {
        data: {
          data
        }
      } = await api.post('/blogs/categories', request);

      if(!parentCategory)
        setCategories(prev => [data, ...prev]);
      else {
        const currentCategoryIndex = categories.findIndex(c => c.id === +parentCategory);
        const tempCategories = [...categories];

        let currentCategory = tempCategories[currentCategoryIndex];

        currentCategory = {
          ...currentCategory,
          categories: [...currentCategory.categories, data]
        };

        tempCategories[currentCategoryIndex] = currentCategory;

        setCategories([]);
        setCategories(tempCategories);
      }


      setIsNewCategoryModalOpen(false);
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingCategory(false);
    }
  }, [categories, categoryName, parentCategory])
  
  const handleUpdateCategory = useCallback(async () => {
    try {
      setUpdatingCategory(true);
      
      const request = {
        parent_id: editParentCategory
      }

      const {
        data: {
          data
        }
      } = await api.post(`/blogs/categories/${editingCategoryId}?_method=PUT`, request);
      
      const tempCategories = [...categories];
      
      const oldCategoryIndex = categories.findIndex(c => c.id === +oldParentCategoryId);
      let oldCategory = tempCategories[oldCategoryIndex];

      oldCategory = {
        ...oldCategory, 
        categories: [...oldCategory.categories.filter(c => c.id !== data.id)]
      };

      tempCategories[oldCategoryIndex] = oldCategory;

      const currentCategoryIndex = categories.findIndex(c => c.id === +editParentCategory);
      let currentCategory = tempCategories[currentCategoryIndex];

      currentCategory = {
        ...currentCategory,
        categories: [...currentCategory.categories, data]
      };

      tempCategories[currentCategoryIndex] = currentCategory;

      setCategories([]);
      setCategories(tempCategories);

      setIsEditCategoryModalOpen(false);
    } catch (e) {
      console.log('e', e);
    } finally {
      setUpdatingCategory(false);
    }
  }, [categories, oldParentCategoryId, editParentCategory, editingCategoryId])

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsEditCategoryModalOpen(!!editingCategoryId);
  }, [editingCategoryId])

  return (
    <>
      <Header route={['Blog', 'Categoria da Postagem']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <CustomHeader>
            <CustomSearchBox
              search={search}
              setSearch={setSearch}
              onClear={() => {}}
            />
            <Button
              className="filter"
              onClick={() => {}}
            >
              <SortIcon />
            </Button>
            <Button
              onClick={() => setIsNewCategoryModalOpen(true)}
            >
              Nova Categoria de Postagem
            </Button>
          </CustomHeader>
          <Form ref={formRef} onSubmit={() => {}}>
            {filteredCategories.map((a, index) =>
              // @ts-ignore
              <Scope key={a.id} path={`suppliers[${index}]`}>
                <BlogCategoryComponent
                  // @ts-ignore
                  category={a}
                  // @ts-ignore
                  editCategory={(id, parentName, parentId) => {
                    setEditingCategoryId(id);
                    setOldParentCategoryId(parentId);
                    setEditParentCategory(parentName);
                  }}
                />
              </Scope>
            )}
          </Form>
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Nova Categoria de Postagem"
        isModalOpen={isNewCategoryModalOpen}
        setIsModalOpen={setIsNewCategoryModalOpen}
        customOnClose={() => {
          setCategoryName('');
          setParentCategory('');
        }}
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
            data={parentCategories}
            setValue={(value: string, id: string) => setParentCategory(id)}
          />
        </InputContainer>
        <Button
          onClick={handleAddCategory}
          type="button"
          style={{ marginTop: '1.875rem', width: '100%' }}
          disabled={!categoryName}
        >
          {addingCategory ?
            <LoadingIcon className="load" /> :
            'Adicionar'
          }
        </Button>
      </Modal>
      <Modal
        title="Editar Categoria de Postagem"
        isModalOpen={isEditCategoryModalOpen}
        setIsModalOpen={setIsEditCategoryModalOpen}
        customOnClose={() => {
          setEditingCategoryId('');
          setEditParentCategory('');
        }}
        style={{
          width: '31.25rem'
        }}
      >
        <InputContainer style={{ marginTop: '1.875rem' }}>
          <Select
            title="Categoria Superior"
            customWidth="26.25rem"
            data={parentCategories}
            defaultValue={{
              value: editParentCategory,
              label: editParentCategory,
            }}
            setValue={(value: string, id: string) => setEditParentCategory(id)}
          />
        </InputContainer>
        <Button
          onClick={handleUpdateCategory}
          type="button"
          style={{ marginTop: '1.875rem', width: '100%' }}
        >
          {updatingCategory ?
            <LoadingIcon className="load" /> :
            'Atualizar'
          }
        </Button>
      </Modal>
    </>
  );
}
