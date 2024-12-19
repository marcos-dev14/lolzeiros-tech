import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { ReactComponent as Photo } from '~assets/photo.svg';
import { ReactComponent as HelpIcon } from '~assets/help-circle.svg'
import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as InstagramIcon } from '~assets/instagram-ico.svg';
import { ReactComponent as FacebookIcon } from '~assets/facebook-ico.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';
import { ReactComponent as TwitterIcon } from '~assets/twitter-ico.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as AugeLogo } from '~assets/auge-logo.svg';

import { ReactComponent as TtIcon } from '~assets/social/tt.svg';
import { ReactComponent as IgIcon } from '~assets/social/ig.svg';
import { ReactComponent as InIcon } from '~assets/social/in.svg';
import { ReactComponent as FbIcon } from '~assets/social/fb.svg';
import { ReactComponent as YtIcon } from '~assets/social/yt.svg';

import { ReactComponent as MobileIcon } from '~assets/info/mobile.svg';
import { ReactComponent as PhoneIcon } from '~assets/info/phone.svg';
import { ReactComponent as WhatsappIcon } from '~assets/info/whatsapp.svg';
import { ReactComponent as AtIcon } from '~assets/info/at.svg';
import { ReactComponent as WebsiteIcon } from '~assets/info/website.svg';
import { ReactComponent as MapIcon } from '~assets/info/map.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import {
  AugePictureContainer,
  Button,
  ButtonsContainer,
  ColumnInputContainer,
  Container,
  CustomSectionTitle,
  DownloadVCardGrid,
  GoBackButton,
  PictureContainer,
  QRCodeContainer,
  SetPicture,
  SignatureContainer,
  SignatureInfo,
  SignatureProfile
} from './styles';

import { FormInput } from '~components/FormInput';
import { FormSelect } from '~components/FormSelect';


import { capitalizeContent, phoneIsValid } from '~utils/validation';

import { api } from '~api';

import { SocialBox } from '@/src/components/SocialBox';
import { MultiplePhoneBox } from '@/src/components/MultiplePhoneBox';
import { SiteBox } from '@/src/components/SiteBox';

import { useHistory } from 'react-router';
import { useQRCode } from 'next-qrcode';
import { PrimaryColor } from '@/src/components/PrimaryColor';

export function EditVCard() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [website, setWebsite] = useState('');

  const [loading, setLoading] = useState(true);
  const [editingNumber, setEditingNumber] = useState(-1);
  const [phone, setPhone] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const { goBack } = useHistory();
  const { Canvas } = useQRCode();

  const formRef = useRef<FormHandles>(null)

  const handleAddPhone = useCallback(async (type: string, number: string) => {
    try {
      const data = {
        type,
        country_code: '+55',
        number,
      }

      const {
        data: {
          data: phoneData
        }
      } = await api.post(`/products/suppliers/$id/phones`, data);
      
      // const phones = [...supplier.phones, phoneData]
      // @ts-ignore
      const phones = []
      
      // updateSupplier({ phones });
      setMessage('Telefone adicionado.');

      switch (type) {
        case 'phone':
          setPhone('');
          break;
        case 'cellphone':
          setCellphone('');
          break;
        case 'whatsapp':
          setWhatsapp('');
          break;
        default: 
      } 
      
    } catch (e) {
      console.log('e', e);
       // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
       'Houve um erro ao salvar o telefone.';

      setError(errorMessage);
    }
  }, []);

  const handleEditPhone = useCallback(async (type: string, id: number, number: string) => {
    try {
      if (!phoneIsValid(number) && !!number) return;
      setEditingNumber(id);

      const data = {
        number,
      }

      // let updatedPhones = supplier.phones;
      // @ts-ignore
      let updatedPhones = [];

      if(!!number) {
        const {
          data: { data: phoneData }
        } = await api.post(`/products/suppliers/$id/phones/$id?_method=PUT`, data);
        
        // @ts-ignore
        updatedPhones = updatedPhones.map(p => p.id === id ? phoneData : p);
      }
      else {
        await api.delete(`/products/suppliers/$id/phones/$id`);
        
        // @ts-ignore
        updatedPhones = updatedPhones.filter(p => p.id !== id);
      }

      // updateSupplier({ phones: updatedPhones })
      
      // atualizar o supplier
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
       'Houve um erro ao atualizar o telefone.';

      setError(errorMessage);
    } finally {
      setEditingNumber(-1);
    }
  }, []);

  const handleUpdate = useCallback((field: string, value: string) => {    
    const updatedValue = capitalizeContent(value);
    formRef.current?.setFieldValue(field, updatedValue)
  }, []);

  return (
    <>
      <Header minimal route={['Cadastro', 'vCard', 'Editar vCard']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => {}}>
        <Container>
          <CustomSectionTitle>
            VCard
          </CustomSectionTitle>
            <InputContainer>
              <FormInput
                name="name"
                title="Nome"
                width="9.375rem"
                validated={false}
                onBlur={e => handleUpdate('name', e.target.value)}
              />
              <FormInput
                name="last_name"
                title="Sobrenome"
                width="9.375rem"
                validated={false}
                onBlur={e => handleUpdate('last_name', e.target.value)}
              />
              <FormInput
                name="role"
                title="Função"
                width="12.5rem"
                validated={false}
                onBlur={e => handleUpdate('role', e.target.value)}
              />
              <FormInput
                name="cnpj"
                title="CNPJ"
                width="16.25rem"
                validated={false}
              />
              <SocialBox
                name="personal_email"
                title="Email Pessoal"
                type="social"
                validated
                badge={EmailIcon}
                width="15.5rem"
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <GoBackButton
                onClick={goBack}
                type="button"
                className="goBack"
              >
                <GoBackIcon />
                <p>Voltar</p>
              </GoBackButton>
            </InputContainer>
            <CustomSectionTitle>
              Contatos
            </CustomSectionTitle>
            <InputContainer style={{ alignItems: 'flex-start' }}>
              <ColumnInputContainer>
                {/* {!!supplier && cellphoneData.map(p =>
                  <MultiplePhoneBox
                    name="Celular"
                    title="Celular"
                    onBlur={({ target: { value } }) =>
                      value !== p.number && handleEditPhone('cellphone', p.id, value)}
                    width="7.625rem"
                    defaultValue={p.number}
                    disabled={editingNumber === p.id}
                  />
                  )} */}
                <MultiplePhoneBox
                  name="Celular"
                  title="Celular"
                  // disabled={noSupplier}
                  value={cellphone}
                  onChange={(e) => setCellphone(e.target.value)}
                  // onBlur={({ target: { value } }) =>
                    // phoneIsValid(value) && handleAddPhone('cellphone', value)}
                  width="7.625rem"
                />
              </ColumnInputContainer>
              <ColumnInputContainer>
                {/* {!!supplier && phoneData.map(p =>
                  <MultiplePhoneBox
                    name="Telefone Fixo"
                    title="Telefone Fixo"
                    onBlur={({ target: { value } }) =>
                      value !== p.number && handleEditPhone('phone', p.id, value)}
                    width="7.625rem"
                    defaultValue={p.number}
                    disabled={editingNumber === p.id}
                    mask="(99) 9999-9999"
                  />
                  )} */}
                <MultiplePhoneBox
                  name="Telefone Fixo"
                  title="Telefone Fixo"
                  // disabled={noSupplier || editingNumber !== -1}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  // @ts-ignore
                  // onBlur={({ target: { value } }) =>
                    // phoneIsValid(value) && handleAddPhone('phone', value)}
                  width="7.625rem"
                />
              </ColumnInputContainer>
              <ColumnInputContainer>
                {/* {!!supplier && whatsappData.map(p =>
                  <MultiplePhoneBox
                    name="WhatsApp"
                    title="WhatsApp"
                    onBlur={({ target: { value } }) =>
                      value !== p.number && handleEditPhone('whatsapp', p.id, value)}
                    width="7.625rem"
                    defaultValue={p.number}
                    disabled={editingNumber === p.id}
                  />
                  )} */}
                <MultiplePhoneBox
                  name="WhatsApp"
                  title="WhatsApp"
                  // disabled={noSupplier}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  // onBlur={({ target: { value } }) =>
                    // phoneIsValid(value) && handleAddPhone('whatsapp', value)}
                  width="7.625rem"
                />
              </ColumnInputContainer>
              <SocialBox
                name="corporate_email"
                title="Email Corporativo"
                type="social"
                validated
                badge={EmailIcon}
                width="15.5rem"
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <SiteBox
                name="Site"
                validated={false}
                width="17.75rem"
                // @ts-ignore
                value={website}
                // @ts-ignore
                onChange={(e) => setWebsite(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <SocialBox
                name="instagram"
                title="Instagram"
                type="social"
                validated
                badge={InstagramIcon}
                width="16.125rem"
                // @ts-ignore 
                // onBlur={(e) => handleShouldUpdate('instagram', e.target.value)}
              />
              <SocialBox
                name="facebook"
                title="Facebook"
                type="social"
                validated
                badge={FacebookIcon}
                width="16.125rem"
                // @ts-ignore 
                // onBlur={(e) => handleShouldUpdate('facebook', e.target.value)}
              />
              <SocialBox
                name="youtube"
                title="YouTube"
                type="social"
                validated
                badge={YoutubeIcon}
                width="16.125rem"
                // @ts-ignore 
                // onBlur={(e) => handleShouldUpdate('youtube', e.target.value)}
              />
              <SocialBox
                name="twitter"
                title="Twitter"
                type="social"
                validated
                badge={TwitterIcon}
                width="16.125rem"
                // @ts-ignore 
                // onBlur={(e) => handleShouldUpdate('twitter', e.target.value)}
              />
            </InputContainer>
            <CustomSectionTitle>
              Endereço
            </CustomSectionTitle>
            <InputContainer>
              <FormInput
                name="zipcode"
                title="Código Postal"
                width="6.25rem"
                validated={false}
                disabled
              />
              <FormInput
                name="role"
                title="Função"
                width="18.875rem"
                validated={false}
                disabled
              />
              <FormInput
                name="number"
                title="Número"
                width="3.75rem"
                validated={false}
                disabled
              />
              <FormInput
                name="floor"
                title="Andar"
                width="6.25rem"
                validated={false}
                disabled
              />
              <FormInput
                name="location"
                title="Localidade"
                width="12.5rem"
                validated={false}
                disabled
              />
              <FormInput
                name="city"
                title="Cidade"
                width="12.5rem"
                validated={false}
                disabled
              />
              <FormSelect
                name="country"
                title="País"
                placeholder="Selecione..."
                customWidth="14rem"
              />
            </InputContainer>
            <CustomSectionTitle>
              Download QRCode e VCard
            </CustomSectionTitle>
            <InputContainer>
              <SiteBox
                name="Site"
                validated={false}
                width="13.375rem"
                // @ts-ignore
                value={website}
                // @ts-ignore
                onChange={(e) => setWebsite(e.target.value)}
              />
              <Button
                onClick={() => {}}
                className="vCard"
              >
                Download vCard
              </Button>
            </InputContainer>
            <DownloadVCardGrid>
              <QRCodeContainer>
                <Canvas
                  text="augeapp.com.br"
                  options={{
                    type: 'image/jpeg',
                    quality: 1,
                    level: 'M',
                    margin: 1,
                    scale: 4,
                    width: 210,
                  }}
                />
                <button
                  onClick={() => {}}
                >
                  Download QRCode
                </button>
              </QRCodeContainer>
              <PictureContainer>
                <img src="https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg" alt="Picture" />
                <SetPicture onClick={() => {}}>
                  <Photo />
                </SetPicture>
                <p>500x500px</p>
              </PictureContainer>
              <AugePictureContainer>
                <div>
                  <AugeLogo />
                </div>
                <SetPicture onClick={() => {}}>
                  <Photo />
                </SetPicture>
                <p>150x420px</p>
              </AugePictureContainer>
            </DownloadVCardGrid>
            <CustomSectionTitle>
              Assinatura para o Email
            </CustomSectionTitle>
            <SignatureContainer>
              <PrimaryColor
                color="#3798CD"
                onClick={() => {}}
                squared
                title="Cor da Assinatura"
              />
              <SignatureProfile>
                <img src="https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg" alt="Picture" />
                <AugeLogo />
                <div>
                  <a><FbIcon /></a>
                  <a><IgIcon /></a>
                  <a><YtIcon /></a>
                  <a><TtIcon /></a>
                  <a><InIcon /></a>
                </div>
              </SignatureProfile>
              <SignatureInfo>
                <strong>
                  Claudino dos Santos
                </strong>
                <span>Operador de Marketing</span>
                <span>Auge APP LDA.</span>
                <span>claudinosantos@augeapp.com</span>
                <hr />
                <span>
                  <MobileIcon />
                  (31) 99318 2412
                </span>
                <span>
                  <PhoneIcon />
                  (31) 3213 2204
                </span>
                <span>
                  <WhatsappIcon />
                  (31) 99318 2412 WhatsApp
                </span>
                <span>
                  <AtIcon />
                  contato@augeapp.com
                </span>
                <span>
                  <WebsiteIcon />
                  https://www.augeapp.com
                </span>
                <span>
                  <MapIcon />
                  Rua Tabaiares, 12, Sala 406<br/>Floresta, Belo Horizonte, MG, Brasil
                </span>
                <button>
                  Adicionar Claudino nos seus contatos
                </button>
              </SignatureInfo>
              <ButtonsContainer>
                <button
                  onClick={() => {}}
                >
                  <HelpIcon />
                  Como adicionar a Assinatura no Email?
                </button>
                <button
                  onClick={() => {}}
                >
                  Copiar HTML da Assinatura
                </button>
                <button
                  className="save"
                  onClick={() => {}}
                >
                  Salvar vCard
                </button>
                <button
                  className="delete"
                  onClick={() => {}}
                >
                  Excluir vCard
                </button>
              </ButtonsContainer>
            </SignatureContainer>
           
        </Container>
        </Form>
      </MenuAndTableContainer>
    </>
  );
}
