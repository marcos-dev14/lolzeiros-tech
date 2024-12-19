import { useCallback, useEffect, useState } from 'react';

import { ReactComponent as PlusWhiteIcon } from '~assets/plus_white.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as MoveIcon } from '~assets/move.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as TrashWhiteIcon } from '~assets/trash_white.svg'
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_white.svg'
import { ReactComponent as SortIcon } from '~assets/sort_alphabetical.svg'

import { Container, Header, Content, ArrangeOrderButton } from './styles';

import { FormInput } from '~components/FormInput';
import { MaxCharactersInput } from '~components/MaxCharactersInput';
import { UrlBox } from '~components/UrlBox';
import { TableActionButton } from '~styles/components/tables';
import { ISupplier } from '~pages/Store/Categories';

import { ICategory, IBlogCategory } from '~types/main';
import { api } from '~api';

interface CurrentCategory extends ICategory {
  registered: boolean;
}

type Props = {
  category: IBlogCategory;
  editCategory: (subCategoryId: string, categoryName: string, categoryId: string) => void;
}

export function BlogCategory({ category, editCategory }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState<IBlogCategory[]>(() => 
    category.categories
  );
  const [isDeleting, setIsDeleting] = useState(-1);

  const formatUrl = useCallback((name) => 
    `${category.name}/${name.replaceAll(' ','-')}`.toLowerCase()
  , [category.name]);

  const handleUpdateCategoryName = useCallback(async (name: string) => {
    try {                  
      setUpdating(true);       
      
      const request = {
        name
      };

      await api.post(`/blogs/categories/${category.id}?_method=PUT`, request);

    
    } catch(e) {
      console.log('e', e);
    } finally {
      setUpdating(false);
    }
  }, [category]);

  const handleDeleteCategory = useCallback(
    async (id: number, registered: boolean) => {
      try {
        const { id: supplierId } = category;
        setIsDeleting(id);

        if(registered) { 
          await api.delete(`/products/suppliers/${supplierId}/categories/${id}`);
        }

        // setCategories(prev => prev.filter(s => s.id !== id));
      } catch(e) {
        console.log('e', e);
      } finally {
        setIsDeleting(-1);
      }
  }, [category]);

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

  // useEffect(() => {
  //   fetchCategories();
  // }, [])

  return (
    <Container>
      <Header>
        <div>
          <strong>Mover</strong>
        </div>
        <div>
          <MaxCharactersInput
            name="name"
            title=""
            defaultValue={category.name}
            noTitle
            width="13.75rem"
            maxLength={30}
            disabled={updating}
            validated
            customOnBlur={(value: string) =>
              value !== category.name && handleUpdateCategoryName(value)
            }
          />
        </div>
        <div>
          <FormInput
            name="products_count"
            title=""
            defaultValue={`${category.posts_count ?? 0} posts`}
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
            // onClick={addNewCategory}
            onClick={() => {}}
          >
            <PlusWhiteIcon />
          </TableActionButton>
          <TableActionButton
            onClick={() => {}}
            disabled={false}
          >
            <TrashWhiteIcon />
          </TableActionButton>
        </div>
      </Header>
      {isOpen &&
        categories.map((c) =>
        <>
          <Content key={c.id}>
            <div
              onClick={() => editCategory(String(c.id), String(category.name), String(category.id))}
            >
              <MoveIcon />
            </div>
            <div>
              <MaxCharactersInput
                name="name"
                title=""
                defaultValue={c.name}
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
                width="32.5rem"
                defaultValue={c.slug}
                disabled
                validated
              />
            </div>
            <div>
              <div>
                <TableActionButton
                  onClick={() => {}}
                >
                  <PlusIcon />
                </TableActionButton>
                <TableActionButton
                  onClick={() => {}}
                  // disabled={isDeleting === attr.id}
                >
                  <TrashIcon />
                </TableActionButton>
              </div>
            </div>
          </Content>
          </>
        )}
    </Container>
  );
}

