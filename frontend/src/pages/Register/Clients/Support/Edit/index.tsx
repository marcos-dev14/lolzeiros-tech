import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as AttachmentIcon } from '~assets/attachment.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container, Button, ReplyContainer, ReplyContainerInfo, AvatarContainer, Options, AttachmentContainer } from './styles';
import { MenuAndTableContainer, SectionTitle } from '~styles/components';

import { ErrorModal } from '@/src/components/ErrorModal';
import { ClientHeader } from '@/src/components/ClientHeader';
import { CustomSelect as Select } from '@/src/components/Select';
import { Message } from '@/src/components/Message';
import { Editor } from '@/src/components/Editor';
import { Input } from '@/src/components/Input';


export function EditSupport() {
  const { push } = useHistory();
      
  const [error, setError] = useState('');

  const handleInputFocus = useCallback((e: MouseEvent) => {
    // @ts-ignore
    const input = e.target.children[0];

    if(!!input) input.focus();
  }, [])

  const messages = useMemo(() => [
    {
      id: 1,
      content: "Meus produtos do pedido 738366B ainda não chegaram",
      user: {
        avatar: "https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg",
        name: "Diogo Santos"
      },
      sent: "24/06/2022 12:22",
      attachments: [
        {
          id: 1,
          name: 'attachment1',
          file: "https://media.gcflearnfree.org/content/55e078e2bae0135431cfdd49_09_06_2014/chat_messenger_lg_2.jpg"
        }
      ],
      sender: false
    },
    {
      id: 2,
      content: "Pode verificar junto com a sua transportadora?",
      user: {
        avatar: "https://i.pinimg.com/originals/c6/b7/08/c6b7083ab63c1054bbcd006c684cd46d.jpg",
        name: "Lúcio Costa"
      },
      sent: "24/06/2022 12:53",
      attachments: [],
      sender: true
    },
    {
      id: 3,
      content: "Sim, já falei com eles que me informaram que não identificaram o código da encomenda.",
      user: {
        avatar: "https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg",
        name: "Diogo Santos"
      },
      sent: "24/06/2022 14:20",
      attachments: [],
      sender: false
    },
  ], []);

  return (
    <>
      <Header route={['Cadastro', 'Cliente', 'Suporte']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <ClientHeader
            ref={null}
            disabled={false}
          />
          <SectionTitle
            style={{
              marginTop: '1.25rem',
              marginBottom: '2rem'
            }}
          >
            Ticket 943472
          </SectionTitle>
          {messages.map(m => 
            <Message
              message={m}
            />  
          )}
          <SectionTitle
            style={{
              margin: '1.25rem 0'
            }}
          >
            Responder
          </SectionTitle>
          <ReplyContainer>
            <Editor
              content=""
              setContent={() => {}}
              // @ts-ignore
              width={1104}
              // @ts-ignore
              height={282}
              style={{
                marginTop: 0
              }}
            />
            <ReplyContainerInfo>
              <AvatarContainer>
                <div>
                  <strong
                    title="Lúcio Costa"
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: 'bold'
                    }}
                  >
                    Lúcio Costa
                  </strong>
                  <small>
                    {new Date().toLocaleDateString("pt-BR", {
                      dateStyle: 'short'
                    })} 22:53
                  </small>
                </div>
                <img src="https://i.pinimg.com/originals/c6/b7/08/c6b7083ab63c1054bbcd006c684cd46d.jpg" alt="" />
              </AvatarContainer>
              <Select
                title="Template de Resposta"
                customWidth="100%"
                setValue={() => {}}
                style={{
                  marginTop: '2rem'
                }}
              />
              <Input
                name="Salvar Template de Resposta"
                width="100%"
                style={{
                  marginTop: '1.25rem'
                }}
              />
              <button>
                Salvar novo template
              </button>
            </ReplyContainerInfo>
          </ReplyContainer>
          <Options>
          <AttachmentContainer>
            <button
              onClick={() => {}}
            >
              <AttachmentIcon />
              Anexar Arquivo
            </button>
            <p>Máximo de 32MB</p>
            </AttachmentContainer>
            <button onClick={() => {}}>
              Enviar Resposta
            </button>
          </Options>
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
