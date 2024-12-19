import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'

import { getCroppedImg } from '~utils/cropImage';

import { Input } from '~components/Input';
import { Modal } from '~components/Modal';

import { ReactComponent as Photo } from '~assets/photo.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

import { Container, Picture, SetPicture, DeleteSupplier, DropPicture } from './styles';

import { ISupplier } from '~pages/Store/Suppliers';
import { isNotEmpty } from '~utils/validation';

import { CropImageButton } from '~styles/components';

type UpdateSupplierProps = {
  name?: string;
  url?: string;
}

type Props = {
  supplier: ISupplier;
  remove: () => void;
  updateSupplier: ({ name, url }: UpdateSupplierProps) => void;
  deletingSupplier: boolean;
}

export function Supplier({
  supplier,
  updateSupplier,
  remove,
  deletingSupplier,
  ...rest
}: Props) {
  const [name, setName] = useState(supplier.name);
  const [picture, setPicture] = useState('');
  const [isValidated, setIsValidated] = useState(isNotEmpty(supplier.name));

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
          updateSupplier({ name, url: croppedImage });
        
      } catch (e) {
        console.error(e)
      } finally{
        setCropping(false);
      }
  }, [name, picture, setPicture, updateSupplier, croppedAreaPixels]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  const handleNameChange = useCallback((value: string) => {    
    if(!value || !isNotEmpty(value)) return;
    const formattedName = value.split(' ').filter(c => c !== '').join(' ');
    
    if(supplier.name !== formattedName) 
      updateSupplier({ name: formattedName, url: !!picture ? picture : '' });
  }, [supplier, updateSupplier, picture]);

  return (
    <>
      <Container {...rest} disabled={deletingSupplier}>
        <Picture
          src={!!picture ? picture : supplier.image.JPG}
          alt=""
          {...getRootProps()}
        />
        {!deletingSupplier && <DropPicture {...getInputProps()} />}
        <Input
          name="Nome da Representada"
          style={{ marginTop: 'auto' }}
          defaultValue={supplier.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => {
            handleNameChange(e.target.value);
            setIsValidated(isNotEmpty(e.target.value));
          }}
          validated={isValidated}
          fullW
        />
        <SetPicture onClick={open} disabled={deletingSupplier}>
          <Photo />
        </SetPicture>
        <DeleteSupplier onClick={remove} disabled={deletingSupplier}>
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
