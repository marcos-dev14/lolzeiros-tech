import { forwardRef, RefObject, useCallback, useMemo, useEffect, useState } from 'react';

import { FormHandles } from '@unform/core';

import { ReactComponent as PlusWhiteIcon } from '~assets/plus_white.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as MoveIcon } from '~assets/move.svg'
import { ReactComponent as TrashWhiteIcon } from '~assets/trash_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_white.svg'
import { ReactComponent as SortIcon } from '~assets/sort_alphabetical.svg'

import { Container, Header, Content, ArrangeOrderButton, AttributeName } from './styles';

import { FormInput } from '~components/FormInput';
import { MaxCharactersInput } from '~components/MaxCharactersInput';
import { TableActionButton } from '~styles/components/tables';
import {
  ProductAttribute as IProductAttribute,
  AttributeCategory
} from '~types/main';

import { api } from '~api';

import { ProductFormTagInput } from '../ProductFormTagInput';
import { useProduct } from '@/src/context/product';

type Props = {
  attributes: IProductAttribute[];
}

export function ProductAttribute({
  attributes
}: Props) {
  const { product, updateProduct } = useProduct();
  const [isDeleting, setIsDeleting] = useState(-1);
  const [currentAttributes, setCurrentAttributes] = useState(attributes)

  const handleDeleteSubAttribute = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(id);

        await api.delete(`/products/${product.id}/attributes/${id}`);

        const tempAttributes = currentAttributes.filter(s => s.id !== id);
        
        setCurrentAttributes(tempAttributes);
        updateProduct({...product, attributes: tempAttributes })
      } catch(e) {
        console.log('e', e);
      } finally {
        setIsDeleting(-1);
      }
  }, [product, updateProduct, currentAttributes]);

  const updateSubAttributeValue = useCallback((id: number, values: string) => {
    const subAttributeIndex = currentAttributes.findIndex(a => a.id === id)
    
    let attributes = [...currentAttributes];
    
    const subAttribute = {
      ...attributes[subAttributeIndex],
      values
    };
    
    attributes[subAttributeIndex] = subAttribute;
    
    updateProduct({...product, attributes })
  }, [currentAttributes, updateProduct, product]);

  return (
    <Container>
      <Header>
        <div>
          <strong>Mover</strong>
        </div>
        <div>
          <AttributeName>
            <strong>Nome do Atributo</strong>
            <ArrangeOrderButton          
              disabled={!currentAttributes.length}
              style={{ width: 'auto' }}
            >
              <SortIcon />
            </ArrangeOrderButton>
          </AttributeName>
        </div>
        <div>
          <strong>Descrição do Atributo</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </Header>
      {currentAttributes.map((attr, idx) => 
        (<>
          <Content key={attr.id}>
            <div>
              <MoveIcon />
            </div>
            <div>
              <MaxCharactersInput
                name={`attributes[${idx}].name`}
                title=""
                noTitle
                defaultValue={attr.name}
                width="13.75rem"
                maxLength={30}
                disabled
              />
            </div>
            <div>
              <ProductFormTagInput
                name={attr.name}
                defaultValue={attr.values}
                attributeId={attr.id}
                productId={product.id}
                handleDeleteSubAttribute={
                  () => handleDeleteSubAttribute(attr.id)
                }
                updateSubAttributeValue={
                  (value: string) => updateSubAttributeValue(attr.id, value)
                }
              />
            </div>
            <div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <TableActionButton
                  disabled={isDeleting === attr.id}
                  onClick={() => handleDeleteSubAttribute(attr.id)}
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
};

