import { useCallback, useEffect, useState } from 'react';

import { ReactComponent as PlusWhiteIcon } from '~assets/plus_white.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as MoveIcon } from '~assets/move.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_white.svg'
import { ReactComponent as SortIcon } from '~assets/sort_alphabetical.svg'

import { Container, Header, Content, ArrangeOrderButton } from './styles';

import { FormInput } from '~components/FormInput';
import { FormMaxCharactersInput } from '~components/FormMaxCharactersInput';
import { UrlBox } from '~components/UrlBox';
import { TableActionButton } from '~styles/components/tables';
import { ISupplier } from '~pages/Store/Categories';

import { ICategory } from '~types/main';
import { api } from '~api';

interface CurrentCategory extends ICategory {
  registered: boolean;
}

type Props = {
  supplier: ISupplier;
}

export function Category({ supplier }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CurrentCategory[]>([]);
  
  const [isDeleting, setIsDeleting] = useState(-1);

  const formatUrl = useCallback((name) => 
    `${supplier.name}/${name.replaceAll(' ','-')}`.toLowerCase()
  , [supplier.name]);

  const fetchCategories = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get(`products/suppliers/${supplier.id}/categories`);
  
      setCategories(data.map((c: CurrentCategory) => ({ ...c, registered: true })));
    } catch (error) {
      console.log('error', error)
      // if(error.response) - verifique sua conexão com a internet
    }
  }, [supplier]);

  const addNewCategory = useCallback(() => {
    const newCategory = {
      id: Date.now() + categories.length + 1,
      name: '',
      slug: '',
      order: 1,
      products_count: 0,
      registered: false
    }
    setCategories(prev => [...prev, newCategory]);
    setIsOpen(true)
  }, [categories]);

  const handleCategoryName = useCallback(async (id: number, value: string, index: number, option: 'create' | 'update') => {
    try {      
      if(!value) return;
      
      const upload = new FormData();
      upload.append('name', value)

      let endpoint = `/products/suppliers/${supplier.id}/categories`;
        
      if(option === 'update') 
        endpoint = `${endpoint}/${id}?_method=PUT`;
      
      const { data: { data } } = await api.post(endpoint, upload)

      const tempCategories = [...categories];
    
      const updatedCategory: CurrentCategory = {
        ...data,
        registered: true
      }

      tempCategories[index] = updatedCategory;
      setCategories(tempCategories);

    } catch(e) {
      console.log('e', e);
    }
  }, [supplier, categories]);

  const handleDeleteCategory = useCallback(
    async (id: number, registered: boolean) => {
      try {
        const { id: supplierId } = supplier;
        setIsDeleting(id);

        if(registered) { 
          await api.delete(`/products/suppliers/${supplierId}/categories/${id}`);
        }

        setCategories(prev => prev.filter(s => s.id !== id));
      } catch(e) {
        console.log('e', e);
      } finally {
        setIsDeleting(-1);
      }
  }, [supplier]);

  // const handleDeleteAttribute = useCallback(async () => {
  //   try {
  //     const { id } = attribute;
  //     setIsDeleting(id);
      
  //     await api.delete(`/products/attribute-categories/${id}`);

  //     removeCurrentAttribute(id);
  //   } catch(e) {
  //     console.log('e', e);
  //   } finally {
  //     setIsDeleting(-1);
  //   }
  // }, [attribute, removeCurrentAttribute]);

  useEffect(() => {
    fetchCategories();
  }, [])

  return (
    <Container>
      <Header>
        <div>
          <strong>Mover</strong>
        </div>
        <div>
          <FormMaxCharactersInput
            name="name"
            title=""
            defaultValue={supplier.name}
            noTitle
            width="13.75rem"
            maxLength={30}
            disabled
            validated
          />
        </div>
        <div>
          <UrlBox
            name="slug"
            width="26.625rem"
            defaultValue={supplier.slug}
            disabled
            validated
          />
        </div>
        <div>
          <FormInput
            name="products_count"
            title=""
            defaultValue={`${supplier.products_count} produtos`}
            noTitle
            validated
            disabled
            width="6.375rem"
            // onBlur={(e) => formatUrl}
          />
        </div>
        <div>
          <ArrangeOrderButton
            disabled={!categories.length}
          >
            <SortIcon />
          </ArrangeOrderButton>
        </div>
        <div>
          <TableActionButton
            disabled={!categories.length}
            onClick={() => setIsOpen(s => !s)}
          >
            {isOpen ? <CollapseIcon /> : <ExpandIcon />}
          </TableActionButton>
          <TableActionButton
            onClick={addNewCategory}
          >
            <PlusWhiteIcon />
          </TableActionButton>
        </div>
      </Header>
      {isOpen &&
      categories.map((attr, idx) => 
        (<>
          <Content key={attr.id}>
            <div>
              <MoveIcon />
            </div>
            <div>
              <FormMaxCharactersInput
                name={`categories[${idx}].name`}
                title=""
                defaultValue={attr.name}
                noTitle
                width="13.75rem"
                maxLength={30}
                customOnBlur={(value: string) =>
                  handleCategoryName(attr.id, value, idx, attr.registered ? 'update' : 'create')
                }
              />
            </div>
            <div>
              <UrlBox
                name={`categories[${idx}].slug`}
                defaultValue={!attr.slug ? formatUrl(attr.name) : attr.slug}
                // width="39.5rem"
                width="27.5rem"
                validated
              />
              <FormInput
                name="products_count"
                title=""
                defaultValue={`${attr.products_count} produtos`}
                noTitle
                validated
                disabled
                width="12.125rem"
              />
              <div>
                <TableActionButton
                  onClick={addNewCategory}
                >
                  <PlusIcon />
                </TableActionButton>
                <TableActionButton
                  onClick={() => handleDeleteCategory(attr.id, attr.registered)}
                  disabled={isDeleting === attr.id}
                >
                  <TrashIcon />
                </TableActionButton>
              </div>
            </div>
          </Content>
        </>))
        }
    </Container>
  );
}
