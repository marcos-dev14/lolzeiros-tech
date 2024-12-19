import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { api } from '~api';

import defaultAvatar from '~assets/avatar.png';

type User = {
  id: number;
  name: string;
  email: string;
  avatar: {
    JPG: string;
    WEBP: string;
  };
  created_at: string;
  updated_at: string;
}

type SignInProps = {
  email: string;
  password: string;
}


type AuthState = {
  user: User;
  token: string;
}

type AuthContextData = {
  user: User;
  token: string;
  setUser: (user: User) => void;
  avatar: string;
  signed: boolean;
  signIn: (user: SignInProps) => Promise<void>;
  signOut: () => void;
}

type Props = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: Props) {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@auge:token');
    const user = localStorage.getItem('@auge:user');

    if (token && user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return { token: '', user: {} } as AuthState;
  });

  const signed = useMemo(() => 
    !!data.token
  , [data.token])

  const signIn = useCallback(async (userData: SignInProps) => {
    try {
      const {
        data: { data }
      } = await api.post('/login', userData);
      
      const { token, ...user } = data;

      setData({ token, user })

      localStorage.setItem('@auge:token', token);
      localStorage.setItem('@auge:user', JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.log('e', err)
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@auge:token');
    localStorage.removeItem('@auge:user');

    delete api.defaults.headers.common.Authorization;

    setData({} as AuthState);
  }, []);

  const avatar = useMemo(() => {
    if(!Object.values(data).length || !data.token)
      return defaultAvatar;

    const { user: { avatar } } = data;
    const hasAvatar = !!Object.values(avatar).length;

    return hasAvatar ? avatar.JPG : defaultAvatar;
    // return defaultAvatar;
  }, [data]);

  const setUser = useCallback((user: User) => {
    setData(prev => ({ ...prev, user }))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        setUser,
        avatar,
        signed,
        signIn,
        signOut
        }}
      >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if(!context) {
    throw new Error('This hook must be invoked inside an Modal Provider.')
  }

  return context;
}