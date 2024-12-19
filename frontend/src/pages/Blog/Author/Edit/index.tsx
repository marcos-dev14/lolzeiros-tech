import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ColorPicker, useColor } from "react-color-palette";
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '~utils/cropImage';

import { ReactComponent as Photo } from '~assets/photo.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as InstagramIcon } from '~assets/instagram-ico.svg';
import { ReactComponent as FacebookIcon } from '~assets/facebook-ico.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';
import { ReactComponent as TwitterIcon } from '~assets/twitter-ico.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import {
  Container,
  GoBackButton,
  SetPicture,
  PictureContainer,
  DropPicture,
  ButtonsContainer,
  Button,
  Badge
} from './styles';
import { CropImageButton, InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import { ErrorModal } from '@/src/components/ErrorModal';
import { FormInput } from '@/src/components/FormInput';
import { TextAreaInput } from '@/src/components/TextAreaInput';
import { SocialBox } from '@/src/components/SocialBox';
import { Editor } from '@/src/components/Editor';
import { RadioBox } from '@/src/components/RadioBox';
import { PrimaryColor } from '@/src/components/PrimaryColor';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Modal } from '@/src/components/Modal';
import { getUrl, isMailValid } from '@/src/utils/validation';
import { api } from '@/src/services/api';
import { SuccessModal } from '@/src/components/SuccessModal';
import { useRegister } from '@/src/context/register';
import { colorFormatting } from '@/src/utils/color';

export function EditAuthor() {
  const { goBack } = useHistory();
  const { author } = useRegister();
  const formRef = useRef<FormHandles>(null);

  const hasAuthor = useMemo(() => !!author, [author]);

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [color, setColor] = useColor("hex", "#3798CD");

  const [currentAction, setCurrentAction] = useState('');

  const [biography, setBiography] = useState(() => 
    !!author ? 
      !!author.biography ? author.biography : ''
    : ''
  );
  const [useCard, setUseCard] = useState('Não');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [picture, setPicture] = useState(() => 
    !!author ?
      !!author.image ? author.image.JPG : '' :
    ''
  );
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const validator = useCallback((file) => {
    const { type } = file;
    const acceptedExtensions = ['jpeg', 'jpg', 'png'];

    const[, extension] = type.split('/')

    if(!acceptedExtensions.includes(extension)) {
      return {
        code: "name-too-large",
        message: `Name is larger than characters`
      };
    }

    return null;
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    try{
      const url = URL.createObjectURL(acceptedFiles[0]);
      setPicture(url);
      setCropping(true);
    } catch(e) {
      console.log('err', e)
    }
  }, [setPicture]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    validator,
    accept: 'image/jpeg, image/jpg, image/png'
  });

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        picture,
        croppedAreaPixels,
      )

        await navigator.clipboard.writeText(croppedImage);
        // const formattedFile = await getUrl(croppedImage);
        
        setPicture(croppedImage);
      } catch (e) {
        console.error(e)
      } finally{
        setCropping(false);
      }
  }, [picture, setPicture, croppedAreaPixels]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setCurrentAction('saving');
      // @ts-ignore
      const data = formRef.current.getData();

      if(!isMailValid(data.email)) {
        setError('Preencha um email válido.');
        return;
      }

      const endpoint = hasAuthor ?
        `/blogs/authors/${author.id}?_method=PUT` :
        '/blogs/authors';

      if(!!picture && picture.includes('blob:')) {
        const image = await getUrl(picture);
        const requestData = new FormData();
        
        Object.entries(data).forEach(e => requestData.append(e[0], e[1]));

        requestData.append('biography', biography);
        // @ts-ignore
        requestData.append('use_card_on_post', useCard === 'Sim' ? 1 : 0);
        requestData.append('card_color', color.hex);
        requestData.append('image', image);

        await api.post(endpoint, requestData);

        setMessage('Autor atualizado com sucesso');

        return;
      }

      const requestData = {
        ...data,
        biography,
        use_card_on_post: useCard === 'Sim' ? 1 : 0,
        card_color: color.hex
      }

      await api.post(endpoint, requestData);
     
      setMessage('Autor adicionado com sucesso');
    } catch (e) {
      // @ts-ignore
      setError(e.response.data.message)

      console.log("e", e);
    } finally {
      setCurrentAction('');
    }
  }, [biography, useCard, color, picture, author, hasAuthor]);

  const handleDeleteAuthor = useCallback(async () => {
    try {
      if(!author) return;
      setCurrentAction('deleting');
      await api.delete(`blogs/authors/${author.id}`);

      setMessage('Autor deletado com sucesso');
      goBack();
    } catch (e) {
      console.log("e", e);
    } finally {
      setCurrentAction('');
    }
  }, [author, goBack]);

  return (
    <>
      <Header route={['Blog', 'Autor da Postagem', 'Editar Autor da Postagem']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => {}} initialData={author}>
          <Container>
            <SectionTitle>
              Autor da Postagem
            </SectionTitle>
            <InputContainer>
              <FormInput
                name="name"
                title="Nome do autor da Postagem"
                width="15.625rem"
              />
              <FormInput
                name="resume"
                title="Descritivo"
                width="15.625rem"
              />
              <SocialBox
                name="email"
                type="social"
                title="Email"
                badge={EmailIcon}
                inputStyle={{ textTransform: 'lowercase' }}
                width="17.5rem"
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
            <InputContainer>
              <SocialBox
                name="instagram"
                title="Instagram"
                type="social"
                badge={InstagramIcon}
                width="16.125rem"
              />
              <SocialBox
                name="facebook"
                title="Facebook"
                type="social"
                badge={FacebookIcon}
                width="16.125rem"
              />
              <SocialBox
                name="youtube"
                title="YouTube"
                type="social"
                badge={YoutubeIcon}
                width="16.125rem"
              />
              <SocialBox
                name="twitter"
                title="Twitter"
                type="social"
                badge={TwitterIcon}
                width="16.125rem"
              />
            </InputContainer>
            <SectionTitle style={{ marginTop: '1.25rem' }}>
              Biografia 200 Caracteres
            </SectionTitle>
            <InputContainer
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: 795
              }}
            >
              <Editor
                content={biography}
                setContent={setBiography}
                // @ts-ignore
                width={795}
                height={211}
                style={{
                  marginTop: '0rem'
                }}
              />
              {biography.length > 200 &&
                <p
                  style={{
                    marginTop: '0.5rem',
                    fontWeight: 'bold',
                    color: "#cd3737"
                  }}
                >
                  Você ultrapassou o limite de 200 caracteres.
                </p>
              }
            </InputContainer>
            <SectionTitle style={{ marginTop: '1.25rem' }}>
              Card do Autor
            </SectionTitle>
            <InputContainer>
              <RadioBox
                value={useCard}
                setValue={setUseCard}
                title="Usar card do autor no post"
              />
            </InputContainer>
            <InputContainer style={{ alignItems: 'flex-start' }}>
              <PrimaryColor
                color={color.hex}
                onClick={() => setOpenColorPicker(true)}
                squared
              />
              <PictureContainer
                style={{ marginLeft: '3.75rem' }}
                {...getRootProps()}
              >
                <DropPicture {...getInputProps()} />
                <img src={!!picture ? picture : "https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg"} alt="Picture" />
                <SetPicture onClick={open}>
                  <Photo />
                </SetPicture>
                <p>500x500px</p>
              </PictureContainer>
              <Badge
                style={{
                  marginLeft: '3.75rem'
                }}
              >
                <img src={!!picture ? picture : "https://sm.ign.com/ign_br/screenshot/default/fortnite-darth-vader_14k2.jpg"} alt="Picture" />
                <div>
                  <strong>
                    {!!author ? author.name : 'Nome do Autor'}
                  </strong>
                  <p>
                    {/* {!!author ? author.resume : 'Nome do Autor'} */}
                    Advogado
                  </p>
                  <div>
                    <button onClick={() => {}} />
                    <button onClick={() => {}} />
                    <button onClick={() => {}} />
                    <button onClick={() => {}} />
                    <button onClick={() => {}} />
                  </div>
                </div>
              </Badge>
              <ButtonsContainer
                style={{ 
                  marginLeft: 'auto'
                }}
              >
                <Button
                  className="save"
                  onClick={handleSubmit}
                  disabled={!!currentAction}
                >
                  {currentAction === 'saving' ? 'Salvando...' : 'Salvar Autor'}
                </Button>
                {hasAuthor && 
                  <Button
                    className="delete"
                    onClick={handleDeleteAuthor}
                    disabled={!author || !!currentAction}
                  >
                    {currentAction === 'deleting' ? 'Excluindo...' : 'Excluir Autor'}
                  </Button>
                }
              </ButtonsContainer>
            </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        isModalOpen={cropping}
        setIsModalOpen={() => setCropping(false)}
        style={{ position: 'relative', margin: 'auto 0', width: 450, height: 450 }}
      >
        <Cropper
          image={picture}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          // aspect={4 / 2}
          aspect={1 / 1}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              borderRadius: '1rem',
            }
          }}
        />
        <CropImageButton
          type="button"
          onClick={handleCrop}
        >
          Cortar Imagem
        </CropImageButton>
      </Modal>
      <Modal
        isModalOpen={openColorPicker}
        setIsModalOpen={setOpenColorPicker}
        style={{ height: 450 }}
      >
        <ColorPicker
          width={250}
          height={180}
          color={color}
          onChange={setColor}
          hideHSV
          hideRGB
          dark
        />
        <CropImageButton
          type="button"
          onClick={() => setOpenColorPicker(false)}
          style={{ width: '80%' }}
        >
          Selecionar Cor
        </CropImageButton>
      </Modal>
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
