import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Photo } from '~assets/photo.svg';
import { ReactComponent as StarIcon } from '~assets/Star1.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container, StarsContainer, GoBackButton, PictureContainer, SetPicture, ButtonsContainer, Button } from './styles';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { TextAreaInput } from '@/src/components/TextAreaInput';
import { capitalizeContent } from '@/src/utils/validation';

export function EditTestimonials() {
  const { goBack } = useHistory();

  const [name, setName] = useState('');
  const [socialName, setSocialName] = useState('');
  const [location, setLocation] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [error, setError] = useState('');

  return (
    <>
      <Header route={['Cadastro', 'Testemunho', 'Editar Testemunho']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <SectionTitle>
            vCard
          </SectionTitle>
          <InputContainer>
            <Input
              name="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              width="9.375rem"
              onBlur={e =>
                setName(capitalizeContent(e.target.value))
              }
            />
            <Input
              name="Razão Social"
              value={socialName}
              onChange={(e) => setSocialName(e.target.value)}
              width="9.375rem"
              onBlur={e =>
                setSocialName(capitalizeContent(e.target.value))
              }
            />
            <Input
              name="Localidade"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              width="12.5rem"
              onBlur={e =>
                setLocation(capitalizeContent(e.target.value))
              }
            />
            <StarsContainer>
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </StarsContainer>
            <GoBackButton
              onClick={goBack}
              type="button"
              className="goBack"
            >
              <GoBackIcon />
              <p>Voltar</p>
            </GoBackButton>
          </InputContainer>
          <InputContainer>
            <TextAreaInput
              name="Testemunho"
              title="Testemunho"
              max={300}
              fullW
              width="100%"
              value={testimonial}
              // @ts-ignore
              onChange={(value) => setTestimonial(value)}
            />
          </InputContainer>
          <InputContainer style={{ justifyContent: 'space-between' }}>
            <PictureContainer>
              <img src="https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg" alt="Picture" />
              <SetPicture onClick={() => {}}>
                <Photo />
              </SetPicture>
              <p>500x500px</p>
            </PictureContainer>
            <ButtonsContainer>
              <Button
                className="save"
                onClick={() => {}}
              >
                Salvar Testemunho
              </Button>
              <Button
                className="delete"
                onClick={() => {}}
              >
                Excluir Testemunho
              </Button>
            </ButtonsContainer>
          </InputContainer>
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
