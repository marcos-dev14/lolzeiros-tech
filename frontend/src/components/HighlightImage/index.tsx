import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'

import { getCroppedImg } from '~utils/cropImage';

import { Input } from '~components/Input';
import { Modal } from '~components/Modal';

import { ReactComponent as Photo } from '~assets/photo.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

import { CropImageButton } from '~styles/components';

import {
  Container,
  Picture,
  OverlayHighlightImage,
  SetPicture,
  DeleteSupplier,
  DropPicture
} from './styles';

import { isNotEmpty } from '~utils/validation';
import { HighlightImage as IHighlightImage } from '~types/main';

type UpdateHighlightImageProps = {
  name?: string;
  url?: string;
}

type Props = {
  picture: string;
  highlightImage: IHighlightImage;
  remove: () => void;
  updateHighlightImage: ({ name, url }: UpdateHighlightImageProps) => void;
  deletingHighlightImage: boolean;
}

export function HighlightImage({
  highlightImage,
  picture: backgroundPicture,
  remove,
  updateHighlightImage,
  deletingHighlightImage,
  ...rest
}: Props) {
  const [name, setName] = useState(highlightImage.name);
  const [picture, setPicture] = useState(() => 
    !!Object.values(highlightImage.image).length ? highlightImage.image.JPG : ''
  );
  const [isValidated, setIsValidated] = useState(isNotEmpty(highlightImage.name));

  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const validator = useCallback((file) => {
    const { type } = file;

    if(!type.includes('png')) {
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
      console.log('e', e)
    }
  }, [setPicture])

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    validator,
    accept: 'image/png'
  });

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        picture,
        croppedAreaPixels,
        'png'
      )

        await navigator.clipboard.writeText(croppedImage);
        setPicture(croppedImage);
        if((!!croppedImage && isNotEmpty(name))) 
          updateHighlightImage({ name, url: croppedImage });
        
      } catch (e) {
        console.error(e)
      } finally{
        setCropping(false);
      }
  }, [name, picture, setPicture, updateHighlightImage, croppedAreaPixels]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  const handleNameChange = useCallback((value: string) => {    
    if(!value || !isNotEmpty(value)) return;
    const formattedName = value.split(' ').filter(c => c !== '').join(' ');
    
    if(highlightImage.name !== formattedName) 
      updateHighlightImage({ name: formattedName, url: !!picture ? picture : '' });
  }, [highlightImage, updateHighlightImage, picture]);

  return (
    <>
      <Container {...rest} disabled={deletingHighlightImage}>
        <Picture
          src={backgroundPicture}
          alt=""
        />
        {!deletingHighlightImage && <DropPicture {...getInputProps()} />}
        <OverlayHighlightImage
          src={picture}
          alt=""
          {...getRootProps()}
        />
        <Input
          name="Nome da Imagem de Destaque"
          style={{ marginTop: 'auto' }}
          // defaultValue={highlightImage.name}
          value={name}
            onChange={({ target: { value } }) => setName(value)}
            onBlur={({ target: { value } }) => {
              handleNameChange(value);
              setIsValidated(isNotEmpty(value));
            }}
            validated={isValidated}
          fullW
        />
        <SetPicture onClick={open} disabled={deletingHighlightImage}>
          <Photo />
        </SetPicture>
        <DeleteSupplier onClick={remove} disabled={deletingHighlightImage}>
          <CloseIcon />
        </DeleteSupplier>
      </Container>
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
          aspect={5 / 5}
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
    </>
  );
}
