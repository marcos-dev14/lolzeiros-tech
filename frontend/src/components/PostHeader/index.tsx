import { useCallback, forwardRef, ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { useRegister } from '@/src/context/register';
import { CustomBlogPostData } from '~types/main';

import { Container, Button, GoBackButton } from './styles';

type Props ={
  data?: CustomBlogPostData;
  disabled?: boolean;
  children?: ReactNode;
}

export const PostHeader = forwardRef<{}, Props>(({ children, disabled = false, data: manualData = {} }, ref) => {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const { updateBlogPost } = useRegister();

  const handleGoBack = useCallback(() => 
    push('/blog/posts')
  , [push]);

  const handleNavigate = useCallback((route: string) => {
    if(!!ref) {
      // @ts-ignore
      const data = ref.current.getData();
      updateBlogPost({...manualData, ...data});
    }
    
    if(!disabled) push(route);
  }, [updateBlogPost, disabled, manualData, ref, push]);
  
  return (
    <Container>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/blog/post/edit")}
        selected={pathname.includes('blog/post/edit')}
      >
        Postagem
      </Button>
      <Button
        disabled={disabled}
        onClick={() => handleNavigate("/blog/post/seo")}
        selected={pathname.includes('blog/post/seo')}
      >
        Seo Google
      </Button>
      {!!children ? children : <></>}
      <GoBackButton
        onClick={handleGoBack}
        type="button"
        className="goBack"
      >
        <GoBackIcon />
        <p>Voltar</p>
      </GoBackButton>
    </Container>
  );
});
