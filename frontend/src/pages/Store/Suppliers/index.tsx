import { useCallback, useEffect, useState } from 'react';


import { ReactComponent as CloseIcon } from '~assets/close.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Input } from '~components/Input';
import { Supplier } from '~components/Supplier';

import {
  Container,
  OptionsHeader,
  DimensionsContainer,
  Button,
  SuppliersContainer
} from './styles';

import {
  MenuAndTableContainer,
  SectionTitle,
} from '~styles/components';

import { api } from '~api';
import { ErrorModal } from '@/src/components/ErrorModal';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';

export type ISupplier = {
  id: number;
  name: string;
  registered: boolean;
  image: {
    JPG: string;
    WEBP: string;
  };
}

export function Suppliers() {
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState<ISupplier[]>([] as ISupplier[]);
  const [deletingSupplier, setDeletingSupplier] = useState(-1);
  const [currentDeletingSupplier, setCurrentDeletingSupplier] = useState(null as unknown as ISupplier);

  const handleAddSupplier = useCallback(() => {
    setSuppliers(prev => [
      {
        id: Date.now() + prev.length + 1,
        name: '',
        image: { JPG: '', WEBP: ''},
        registered: false
      },
      ...prev]);
  }, []);

  const handleRemoveSupplier = useCallback(async () => {
    try{
      const { id, registered } = currentDeletingSupplier;
      const findIndex = suppliers.findIndex(s => s.id === id);
      
      if(findIndex > -1 ){
        setDeletingSupplier(id);

        if(registered)
          await api.delete(`/products/suppliers/${id}`);

        setSuppliers(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.log('e', e);
      setError('Erro ao deletar a representada.')
    } finally {
      setDeletingSupplier(-1);
      setCurrentDeletingSupplier(null as unknown as ISupplier)
    }
  }, [currentDeletingSupplier, suppliers])

  const handleSupplierData = useCallback(async (id, registered, name, url) => {
    try{
      const findIndex = suppliers.findIndex(s => s.id === id);
    
      if(findIndex > -1){
        const upload = new FormData();

        upload.append('name', name);

        if(!!url) {
          let image = await fetch(url).then(r => r.blob());
          upload.append('image', image);
        }

        const endpoint = registered ? 
          `/products/suppliers/${id}?_method=PUT` :
          '/products/suppliers'

        const {
          data: { data }
        } = await api.post(endpoint, upload);

        setSuppliers(prev => prev.map(s => s.id === id ? ({...data, registered: true }) : s))
      }
    } catch (e) {
      console.log('e', e);
      setError('Erro ao cadastrar/atualizar a representada.')
    }
  }, [suppliers])

  const fetchSuppliers = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.get('products/suppliers');

      setSuppliers(data.map((s: ISupplier) => ({ ...s, registered: true })));
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return (
    <>
      <Header route={['Loja Online', 'Representadas']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Adicione as Representadas
          </SectionTitle>
          <OptionsHeader>
            <DimensionsContainer>
              <Input
                name="Largura"
                width="3.75rem"
                validated
                value="200"
                disabled
              />
              <span>
                <CloseIcon />
              </span>
              <Input
                name="Altura"
                width="3.75rem"
                validated
                value="130"
                disabled
              />
            </DimensionsContainer>
            <Button
              type="button"
              onClick={handleAddSupplier}
            >
              Nova Representada
            </Button>
          </OptionsHeader>
            <SuppliersContainer>
              {suppliers.map((s) =>
                <Supplier
                  key={s.id}
                  supplier={s}
                  deletingSupplier={s.id === deletingSupplier}
                  updateSupplier={
                    ({ name, url = '' }) =>  handleSupplierData(s.id, s.registered, name, url)
                  }
                  remove={() => setCurrentDeletingSupplier(s)}
                />
              )}
            </SuppliersContainer>
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <ConfirmationModal
        category={!!currentDeletingSupplier ? currentDeletingSupplier.name : ''}
        action={handleRemoveSupplier}
        setIsModalOpen={() => {
          setCurrentDeletingSupplier(null as unknown as ISupplier)
        }}
      />
    </>
  );
}
