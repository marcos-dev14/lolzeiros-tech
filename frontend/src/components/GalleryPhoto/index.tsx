import { Image } from '@/src/types/main';
import { getUrl } from '@/src/utils/validation';
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { ReactComponent as AddPhotoIcon } from '~assets/add_photo.svg';

import { Container } from './styles';

type Props = {
  addPictures: (pictures: Image[]) => void;
}

export function GalleryPhoto({ addPictures }: Props) {
  const validator = useCallback((file) => {
    const { type } = file;
    const acceptedExtensions = ['jpeg', 'jpg'];

    const[, extension] = type.split('/')

    if(!acceptedExtensions.includes(extension)) {
      return {
        code: "name-too-large",
        message: `Name is larger than characters`
      };
    }

    return null;
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    try{
      const pictures: Image[] =
        acceptedFiles.map((p: File, index: number) => {
          const url = URL.createObjectURL(p);

          return {
            id: `${Date.now()}-${url}-${index}`,
            name: url,
            label: url,
            dimensions: url,
            order: -1,
            image: {
              JPG: url,
              WEBP: url,
            },
          }
        });

      addPictures(pictures);
    } catch(e) {
      console.log('e', e)
    }
  }, [addPictures])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator,
    accept: 'image/jpeg, image/jpg'
  });

  return (
    <Container {...getRootProps()}>
      <div />
      <input {...getInputProps()} />
      <AddPhotoIcon />
    </Container>
  )
}

