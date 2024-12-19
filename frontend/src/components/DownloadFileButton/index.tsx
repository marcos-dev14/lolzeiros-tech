import { useState } from 'react';
import { Button } from './styles';
import { api } from '@/src/services/api';

type Props = {
  route: string;
};

export default function DownloadFileButton({ route }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDownloadModel = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`${route}`, {
        responseType: 'blob', // para lidar com o retorno do arquivo
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modelo.xlsx');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o arquivo modelo:', error);
      setError(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setError(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        style={
          error
            ? {
                backgroundColor: '#ff7373',
                color: 'white',
                padding: '0.6rem 6.2rem',
                height: 'initial',
                whiteSpace: 'nowrap',
              }
            : {
                backgroundColor: '#3699CF',
                color: 'white',
                padding: '0.6rem 6.2rem',
                height: 'initial',
                whiteSpace: 'nowrap',
              }
        }
        onClick={handleDownloadModel}
      >
        {error ? 'Erro ao baixar arquivo!' : loading ? 'Download...' : 'Download'}
      </Button>
    </>
  );
}
