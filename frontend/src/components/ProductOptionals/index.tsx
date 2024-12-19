import { useCallback, useState } from 'react';

import { ReactComponent as MoveIcon } from '~assets/move.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Content } from './styles';

import { MeasureBox } from '~components/TableMeasureBox';
import { NoTitleSelect } from '~components/NoTitleSelect';
import { FormMaxCharactersInput } from '~components/FormMaxCharactersInput';
import { TableActionButton } from '~styles/components/tables';

import { api } from '~api';

import { MainProduct } from '~types/main';
import { Input } from '../Input';

type Props = {
  product: MainProduct;
  productId: number;
  productIndex: number;
  onDelete: (id: number) => void;
}

export function ProductOptionals({ product, productId, productIndex, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(-1);

  const handleDeleteSubAttribute = useCallback(async () => {
    try {
      setIsDeleting(product.id);

      await api.delete(`/products/${productId}/variations/${product.id}`);
      onDelete(product.id);
    } catch(e) {
      console.log('e', e);
    } finally {
      setIsDeleting(-1);
    }
  }, [productId, product, onDelete]);

  return (
      <Content key={product.id}>
        <div>
          <MoveIcon />
         </div>
        <div>
         <FormMaxCharactersInput
           name={`optionals[${productIndex}].name`}
           title=""
           noTitle
           defaultValue={product.title}
           width="27.125rem"
           maxLength={30}
           disabled
         />
       </div>
       <div>
        <Input
          name=""
          noTitle
          disabled
          width="100%"
          fullW
          value={product.reference ?? ''}
          validated
        />
      </div>
      <div>
        <Input
          name=""
          noTitle
          disabled
          width="100%"
          fullW
          value={product.ean13 ?? ''}
          validated
        />
      </div>
      <div>
        <Input
          name=""
          noTitle
          disabled
          width="100%"
          fullW
          value={product.dun14 ?? ''}
          validated
        />
      </div>
      <div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <TableActionButton
            disabled={isDeleting === product.id}
            onClick={handleDeleteSubAttribute}
          >
            <TrashIcon />
          </TableActionButton>
        </div>
      </div>
    </Content>
  );
}

