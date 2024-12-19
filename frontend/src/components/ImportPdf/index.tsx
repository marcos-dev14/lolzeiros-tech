import { ButtonHTMLAttributes, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { Container, Toast } from './styles';

import { PDFFile } from '~types/main';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  file: PDFFile;
  setFile: (value: PDFFile) => void;
}

export function ImportPdf({
  file,
  setFile,
  ...rest
}: Props) {
  const [error, setError] = useState('');

  const validator = useCallback((file) => {
    const { type } = file;
    const acceptedExtensions = ['pdf'];

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
      const url = URL.createObjectURL(acceptedFiles[0]);
      const file =
        await fetch(url).then(r => r.blob() as unknown as PDFFile);

      if(file.size/10**6 > 3) {
        alert("Arquivo excede o limite de 3MB.");
        throw new Error('File size exceeded.')
      }

      file.fileUrl = url;
      // await navigator.clipboard.writeText(file);

      setFile(file);
    } catch(e) {
      console.log('e', e)
    }
  }, [setFile])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator,
    accept: 'application/pdf'
  });

  useEffect(() => {
    if(!!error) {
      setTimeout(() => setError(''), 3000);
    }
  }, [error])

  return (
    <Container {...getRootProps()} {...rest}>
      <input {...getInputProps()} />
      Importar PDF
    </Container>
  )
}

