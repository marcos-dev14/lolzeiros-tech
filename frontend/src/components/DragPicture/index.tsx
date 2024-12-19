import { CSSProperties, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'

import { Container, DeletePhoto, Toast } from './styles';

import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

import { getCroppedImg } from '~utils/cropImage';
import { CropImageButton } from '~styles/components';

type Props = {
  file: string;
  action?: string;
  format?: string;
  resolution?: string;
  accept?: string;
  setFile: (value: string) => void;
  deletePicture?: () => void;
  style?: CSSProperties;
  noCrop?: boolean;
  canDelete?: boolean;
}

export function DragPicture({
  file,
  setFile,
  style = {},
  action = 'Arraste a imagem principal do produto ou clique aqui',
  format = 'JPG',
  noCrop = false,
  canDelete = true,
  resolution = '',
  deletePicture = () => {},
  accept = 'image/jpeg, image/jpg'
}: Props) {
  const [error, setError] = useState('');
  const [cropping, setCropping] = useState(false);

  const validator = useCallback((file) => {
    const { type } = file;
    const acceptedExtensions = ['jpeg', 'jpg', 'png'];

    const[, extension] = type.split('/')

    if(!acceptedExtensions.includes(extension)) {
      setError('Apenas imagens em JPEG/JPG ou PNG.');
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
      setCropping(true);
      const url = URL.createObjectURL(acceptedFiles[0]);
      setFile(url);
    } catch(e) {
      console.log('e', e)
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator,
    accept
  });

  useEffect(() => {
    if(!!error) {
      setTimeout(() => setError(''), 3000);
    }
  }, [error])

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        file,
        croppedAreaPixels,
      )

        await navigator.clipboard.writeText(croppedImage);
        setFile(croppedImage);
      } catch (e) {
        console.error(e)
      } finally{
        setCropping(false);
      }
  }, [file, setFile, croppedAreaPixels])

  return (
    <Container {...getRootProps()} file={file} style={style}>
      {!noCrop && cropping ?
        <>
          <Cropper
            image={file}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={5 / 5}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { borderRadius: '1rem' }}
            }
          />
          <CropImageButton onClick={handleCrop}>
            Cortar Imagem
          </CropImageButton>
        </>
          :
      <>
        <p>{action}<br />{!!resolution && <b>{resolution}<br/></b>}( {format} )</p>
        <input {...getInputProps()} />
      </>
      }
      <Toast hasError={!!error}>
        {error}
      </Toast>
      {canDelete &&
        <DeletePhoto
          onClick={(e) => {
            e.stopPropagation();
            deletePicture()
          }}
        >
          <CloseIcon />
        </DeletePhoto>}
    </Container>
  )
}

