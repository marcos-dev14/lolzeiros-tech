import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'

import { getCroppedImg } from '~utils/cropImage';

import { Modal } from '~components/Modal';

import { ReactComponent as Photo } from '~assets/photo.svg';

import { Container, Picture, SetPicture, DropPicture } from './styles';

import { MainSupplier } from '~types/main';

import { CropImageButton } from '~styles/components';
import { useRegister } from '@/src/context/register';
import { api } from '@/src/services/api';

type Props = {
  supplier: MainSupplier;
  remove: () => void;
}

export function AddSupplierPhoto({
  supplier,
  remove,
  ...rest
}: Props) {
  const { updateSupplier } = useRegister();

  const [picture, setPicture] = useState('');

  const [updating, setUpdating] = useState(false);

  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const noSupplier = useMemo(() => 
    !supplier || (!!supplier && !supplier.id)
  , [supplier])

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
      setUpdating(true);
      const croppedImage = await getCroppedImg(
        picture,
        croppedAreaPixels,
      )

        await navigator.clipboard.writeText(croppedImage);
        
        const upload = new FormData();
        let image = await fetch(croppedImage).then(r => r.blob());
        upload.append('image', image);

        const {
          data: { data }
        } = await api.post(`/products/suppliers/${supplier.id}?_method=PUT`, upload);

        setPicture(croppedImage);
        updateSupplier({
          image: data.image
        })
      } catch (e) {
        console.error(e)
      } finally{
        setCropping(false);
        setUpdating(false);
      }
  }, [picture, setPicture, supplier, updateSupplier, croppedAreaPixels]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  return (
    <>
      <Container // @ts-ignore
        hasPicture={!!supplier ? !!picture ? picture : !!supplier.image ? supplier.image.JPG : '' : ''}
        disabled={noSupplier || updating}
        {...rest}
      >
        <Picture // @ts-ignore
          src={!!supplier ? !!picture ? picture : !!supplier.image ? supplier.image.JPG : '' : ''}
          alt=""
          disabled={noSupplier}
          {...getRootProps()}
        />
        {!noSupplier && <DropPicture {...getInputProps()} />}
        <SetPicture onClick={open}  disabled={noSupplier}>
          <Photo />
        </SetPicture>
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
