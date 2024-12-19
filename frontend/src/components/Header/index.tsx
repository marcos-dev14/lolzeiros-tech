import { useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ReactComponent as LogoIcon } from '~assets/auge-logo.svg';
import { ReactComponent as LogoIconMinimal } from '~assets/auge-ico.svg';
import { ReactComponent as MenuIcon } from '~assets/menu.svg';
import { ReactComponent as HelpIcon } from '~assets/help.svg';
import { ReactComponent as SupportIcon } from '~assets/support-top.svg';
import { ReactComponent as SignOutIcon } from '~assets/sign_out.svg';

import {
  Background,
  BreadCrumb,
  Container,
  Menu,
  HelpMeButton,
  Inbox,
  Profile,
  Separator
} from './styles';

import { useAuth } from '~context/auth';

type Props = {
  minimal?: boolean;
  route?: string[];
}

export function Header({ minimal = false, route = [''] }: Props) {
  const { push } = useHistory();
  const { user, avatar, signOut } = useAuth();
  
  const breadCrumb = useMemo(() => 
    route.map(
      (r, index) => !!r ? index !== 0 ?
        <p key={r}> / <b>{r}</b></p> :
        <p key={r}>{r}</p> :
      '')
  , [route])

  return (
    <Background>
      <Container>
        <Link to="/store/products">
          {minimal ? <LogoIconMinimal /> : <LogoIcon />}
        </Link>
        <Menu minimal={minimal}>
          <MenuIcon />
        </Menu>
        <BreadCrumb>
          {breadCrumb}
        </BreadCrumb>
        <HelpMeButton>
          <HelpIcon />
          <p>Tem dúvidas nesta tela?<br />Assista um vídeo de 1 minuto</p>
        </HelpMeButton>
        <Inbox>
          <SupportIcon />
        </Inbox>
        <Profile onClick={() => push('/profile')}>
          <img src={avatar} alt="Avatar" />
          <p>{user.name}</p>
        </Profile>
        <Separator />
        <SignOutIcon 
          onClick={signOut}
          style={{
            width: '1.375rem',
            height: '1.375rem',
            cursor: 'pointer'
          }}
        />
      </Container>
    </Background>
  );
}
