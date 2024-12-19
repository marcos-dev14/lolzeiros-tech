import { useCallback, forwardRef, ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { CustomProductData } from '~types/main';

import { Container, Button, GoBackButton } from './styles';

type Props ={
  data?: CustomProductData;
  disabled?: boolean;
  children?: ReactNode;
}

export const ClientHeader = forwardRef<{}, Props>(({ children, disabled = false, data: manualData = {} }, ref) => {
  const { pathname } = useLocation();
  const { push } = useHistory();

  const handleGoBack = useCallback(() => {
    // const { name, id } = supplier;
    // push('/products/details', { name, id });
    push('/register/clients');

  // }, [push, supplier]);
  }, [push]);

  const handleNavigate = useCallback((route: string) => {
    if(!!ref) {
      // @ts-ignore
      // const data = ref.current.getData();
      // updateProduct({...manualData, ...data});
    }
    
    if(!disabled) push(route);
  }, [disabled, manualData, ref, push]);
  
  return (
    <Container hasChildren={!!children}>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/clients/new")}
        selected={pathname.includes('clients/new')}
      >
        Cliente
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/clients/order")}
        selected={pathname.includes('register/clients/order')}
      >
        Pedido
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/clients/accessed")}
        selected={pathname.includes('register/clients/accessed')}
        style={{ width: !!children ? '16rem' : '21rem' }}
      >
        Produtos que mais acessou
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/clients/support")}
        selected={pathname.includes('register/clients/support')}
      >
        Suporte
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/clients/basket")}
        selected={pathname.includes('register/clients/basket')}
      >
        Cesto
      </Button>
      {!!children ? children : <></>}
      <GoBackButton
        onClick={handleGoBack}
        type="button"
        className="goBack"
        style={{
          marginLeft: !!children ? '1.25rem' : 'auto'
        }}
      >
        <GoBackIcon />
        <p>Voltar</p>
      </GoBackButton>
    </Container>
  );
});
