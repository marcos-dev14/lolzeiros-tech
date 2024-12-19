import { useCallback, forwardRef, ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { useProduct } from '~context/product';
import { CustomProductData } from '~types/main';

import { Container, Button, GoBackButton } from './styles';

type Props ={
  data?: CustomProductData;
  disabled?: boolean;
  children?: ReactNode;
}

export const ProductHeader = forwardRef<{}, Props>(({ children, disabled = false, data: manualData = {} }, ref) => {
  const { pathname } = useLocation();
  const { push } = useHistory();

  const { updateProduct, supplier } = useProduct();

  const handleGoBack = useCallback(() => {
    // const { name, id } = supplier;
    // push('/products/details', { name, id });
    push('/store/products/details');

  // }, [push, supplier]);
  }, [push]);

  const handleNavigate = useCallback((route: string) => {
    if(!!ref) {
      // @ts-ignore
      const data = ref.current.getData();
      updateProduct({...manualData, ...data});
    }
    
    if(!disabled) push(route);
  }, [disabled, manualData, updateProduct, ref, push]);
  
  return (
    <Container>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/store/product")}
        selected={pathname === '/store/product'}
      >
        Preço + Atributos
      </Button>
      <Button
        onClick={() => handleNavigate("/store/product/attributes")}
        selected={pathname.includes('attributes')}
        width="13.75rem"
      >
        Produto
        
      </Button>
      <Button
        onClick={() => handleNavigate("/store/product/seo")}
        selected={pathname.includes('seo')}
      >
        Seo Google
      </Button>
      <Button
        onClick={() => handleNavigate("/store/product/related")}
        selected={pathname.includes('related')}
        width="16.25rem"
      >
        Produtos Relacionados
      </Button>
      {!!children ? children : <></>}
      {/* {pathname === '/store/product' &&  */}
        <GoBackButton
          onClick={handleGoBack}
          type="button"
          className="goBack"
        >
          <GoBackIcon />
          <p>Voltar</p>
        </GoBackButton>
      {/* } */}
    </Container>
  );
});
