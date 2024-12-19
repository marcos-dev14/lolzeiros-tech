import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as AttachmentIcon } from '~assets/attachment.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { TagInput } from '~components/TagInput';

import { Container, Button, GoBackButton, AttachmentContainer } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { ErrorModal } from '@/src/components/ErrorModal';
import { ITag } from '@/src/types/main';
import { Editor } from '@/src/components/Editor';
import { Input } from '@/src/components/Input';
import { CustomSelect as Select } from '@/src/components/Select';

export function NewEmail() {
  const { goBack } = useHistory();
      
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [saveAsNewTemplate, setSaveAsNewTemplate] = useState('');
  
  const [secondaryContent, setSecondaryContent] = useState('');
  const [secondaryContentReadingTime, setSecondaryContentReadingTime] = useState(0);

  const [destination, setDestination] = useState<ITag[]>([]);

  return (
    <>
      <Header route={['Email', 'Compor Novo Email']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <InputContainer style={{ marginTop: 0 }}>
            <TagInput
              title="Enviar email para"
              tags={destination}
              setTags={setDestination}
              width="48.75rem"
              validated={false}
            />
            <Button onClick={() => {}}>
              Enviar Email
            </Button>
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
            <Input
              name="Assunto"
              width="48.75rem"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Select
              title="Template"
              disabled
              customWidth="20rem"
              setValue={() => {}}
            />
          </InputContainer>
          <Editor
            content={secondaryContent}
            setContent={setSecondaryContent}
          />
          <InputContainer style={{ justifyContent: 'space-between' }}>
            <AttachmentContainer>
              <Button
                className="attach"
                onClick={() => {}}
              >
                <AttachmentIcon />
                Anexar Arquivo
              </Button>
              <p>Máximo de 32MB</p>
            </AttachmentContainer>
            <Input
              name="Salvar como novo template de email"
              width="17.1875rem"
              value={saveAsNewTemplate}
              onChange={(e) => setSaveAsNewTemplate(e.target.value)}
            />
          </InputContainer>
          <InputContainer style={{ justifyContent: 'flex-end' }}>
            <Button
              className="new"
              onClick={() => {}}
            >
              Salvar novo template
            </Button>
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
