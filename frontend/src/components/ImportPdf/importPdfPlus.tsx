import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/src/services/api';

interface ImportPdfProps {
  invoiceId: number;
  onUploadSuccess: () => void;
}

export const ImportPdfPlus: React.FC<ImportPdfProps> = ({ invoiceId, onUploadSuccess }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const pdfFile = acceptedFiles[0];

      const formData = new FormData();
      formData.append('pdf_file', pdfFile);

      const x = await api.post(`invoices/pdf/import/${invoiceId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(x);
      

      setError(null);
      onUploadSuccess();
      window.location.reload();
    } catch (error) {
      console.error('Error uploading:', error);
      setError('Erro ao enviar o arquivo.');
    }
  }, [invoiceId, onUploadSuccess]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ['.pdf', 'image/*'],
    multiple: false,
    maxFiles: 1,
  });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #e0e0e0', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Importar Arquivo</p>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImportPdfPlus;
