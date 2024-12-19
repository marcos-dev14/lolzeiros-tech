import { useCallback, forwardRef, ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { useRegister } from '@/src/context/register';
import { CustomSupplierData } from '~types/main';

import { Container, Button, GoBackButton } from './styles';

type Props ={
  data?: CustomSupplierData;
  disabled?: boolean;
  children?: ReactNode;
}

export const SupplierHeader = forwardRef<{}, Props>(({ children, disabled = false, data: manualData = {} }, ref) => {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const { updateSupplier } = useRegister();

  const handleGoBack = useCallback(() => {
    // const { name, id } = supplier;
    // push('/products/details', { name, id });
    push('/register/suppliers/all');

  // }, [push, supplier]);
  }, [push]);

  const handleNavigate = useCallback((route: string) => {
    if(!!ref) {
      // @ts-ignore
      // const data = ref.current.getData();

      updateSupplier({...manualData});
    }
    
    if(!disabled) push(route);
  }, [updateSupplier, disabled, manualData, ref, push]);
  
  return (
    <Container>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/suppliers/new")}
        selected={pathname.includes('register/suppliers/new')}
      >
        Representada
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/suppliers/rules")}
        selected={pathname.includes('register/suppliers/rules')}
      >
        Regras
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/suppliers/sales")}
        selected={pathname.includes('register/suppliers/sales')}
      >
        Vendas
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/register/suppliers/media")}
        selected={pathname.includes('register/suppliers/media')}
        style={{
          width: '17.75rem'
        }}
      >
        Fotos, PDF e Vídeos
      </Button>
      {!!children ? children : <></>}
      <GoBackButton
        onClick={handleGoBack}
        type="button"
        className="goBack"
        style={{
          marginLeft: !!children ? '1rem' : 'auto',
          width: !!children ? '8rem' : '6.25rem'
        }}
      >
        <GoBackIcon />
        <p>Voltar</p>
      </GoBackButton>
    </Container>
  );
});
