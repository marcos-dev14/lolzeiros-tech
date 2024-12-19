import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'

import { getCroppedImg } from '~utils/cropImage';

import { ReactComponent as Photo } from '~assets/photo.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

import { Input } from '~components/Input';
import { Modal } from '~components/Modal';

import { Container, Picture, SetPicture, DeleteSupplier, DropPicture } from './styles';
import { IBrand } from '~pages/Store/Brands';

import { CropImageButton } from '~styles/components';

import { isNotEmpty } from '~utils/validation';

type UpdateBrandProps = {
  name?: string;
  url?: string;
}

type Props = {
  brand: IBrand;
  remove: () => void;
  updateBrand: ({ name, url }: UpdateBrandProps) => void;
  deletingBrand: boolean;
}

export function Brand({
  brand,
  updateBrand,
  remove,
  deletingBrand,
  ...rest
}: Props) {
  const [name, setName] = useState(brand.name);
  const [picture, setPicture] = useState('');
  const [isValidated, setIsValidated] = useState(isNotEmpty(brand.name));

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
        setPicture(croppedImage);
        if((!!croppedImage && isNotEmpty(name))) 
          updateBrand({ name, url: croppedImage });
        
      } catch (e) {
        console.error(e)
      } finally{
        setCropping(false);
      }
  }, [name, picture, setPicture, updateBrand, croppedAreaPixels]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  const handleNameChange = useCallback((value: string) => {    
    if(!value || !isNotEmpty(value)) return;
    const formattedName = value.split(' ').filter(c => c !== '').join(' ');
    
    if(brand.name !== formattedName) 
      updateBrand({ name: formattedName, url: !!picture ? picture : '' });
  }, [brand, updateBrand, picture]);

  return (
    <>
      <Container {...rest} disabled={deletingBrand}>
        <Picture
          src={!!picture ? picture : brand.image.JPG}
          alt=""
          {...getRootProps()}
        />
        {!deletingBrand && <DropPicture {...getInputProps()} />}
        <Input
          name="Nome da Marca"
          style={{ marginTop: 'auto' }}
          defaultValue={brand.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => {
            handleNameChange(e.target.value);
            setIsValidated(isNotEmpty(e.target.value));
          }}
          validated={isValidated}
          fullW
        />
        <SetPicture onClick={open} disabled={deletingBrand}>
          <Photo />
        </SetPicture>
        <DeleteSupplier onClick={remove} disabled={deletingBrand}>
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
          // aspect={4 / 2}
          aspect={4 / 2.59}
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
