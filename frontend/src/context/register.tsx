import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode
} from 'react';

import {
  MainClient,
  MainClientGroup,
  MainSupplier,
  MainBlogPost,
  IAuthor,
  ISaleData,
  IShipping,
  IBanner,
  IBuyer
} from '~types/main';
import { api } from '~api';

type RegisterContextData = {
  client: MainClient;
  setClient: (client: MainClient) => void;
  clientGroup: MainClientGroup;
  setClientGroup: (clientGroup: MainClientGroup) => void;
  banner: IBanner;
  setBanner: (banner: IBanner) => void;
  updateClient: (client: Partial<MainClient>) => void;
  sale: ISaleData;
  setSale: (sale: ISaleData) => void;
  updateSale: (sale: Partial<ISaleData>) => void;
  shippingCompany: IShipping;
  setShippingCompany: (shippingCompany: IShipping) => void;
  updateShippingCompany: (shippingCompany: Partial<IShipping>) => void;
  supplier: MainSupplier;
  setSupplier: (supplier: MainSupplier) => void;
  updateSupplier: (supplier: Partial<MainSupplier>) => void;
  blogPost: MainBlogPost;
  setBlogPost: (blogPost: MainBlogPost) => void;
  updateBlogPost: (blogPost: Partial<MainBlogPost>) => void;
  author: IAuthor;
  setAuthor: (author: IAuthor) => void;
  updateAuthor: (author: Partial<IAuthor>) => void;
  buyer: IBuyer;
  setBuyer: (buyer: IBuyer) => void;
  updateBuyer: (buyer: Partial<IBuyer>) => void;

  // updateClient: (client: MainClient) => void;
}

const RegisterContext =
  createContext<RegisterContextData>({} as RegisterContextData);

type ProviderProps = {
  children: ReactNode;
}

export function RegisterProvider({ children }: ProviderProps) { 
  // @ts-ignore
  const [currentClient, setCurrentClient] = useState<MainClient>(() => {
    const client = localStorage.getItem('@auge:client');

    if(!!client) return JSON.parse(client);

    return {} as MainClient;
  });
  // @ts-ignore
  const [currentClientGroup, setCurrentClientGroup] = useState<MainClientGroup>(() => {
    const clientGroup = localStorage.getItem('@auge:ClientGroup');

    if(!!clientGroup) return JSON.parse(clientGroup);

    return {} as MainClientGroup;
  });
  // @ts-ignore
  const [currentSale, setCurrentSale] = useState<ISaleData>(() => {
    const sale = localStorage.getItem('@auge:sale');

    if(!!sale) return JSON.parse(sale);

    return {} as ISaleData;
  });
  // @ts-ignore
  const [currentShippingCompany, setCurrentShippingCompany] = useState<IShipping>(() => {
    const shippingCompany = localStorage.getItem('@auge:shippingCompany');

    if(!!shippingCompany) return JSON.parse(shippingCompany);

    return {} as IShipping;
  });
  // @ts-ignore
  const [currentSupplier, setCurrentSupplier] = useState<MainSupplier>(() => {
    const supplier = localStorage.getItem('@auge:supplier');

    if(!!supplier) return JSON.parse(supplier);

    return {} as MainClient;
  });
  // @ts-ignore
  const [currentBlogPost, setCurrentBlogPost] = useState<MainBlogPost>(() => {
    const blogPost = localStorage.getItem('@auge:post');

    if(!!blogPost) return JSON.parse(blogPost);

    return {} as MainBlogPost;
  });
  // @ts-ignore
  const [currentAuthor, setCurrentAuthor] = useState<IAuthor>(() => {
    const author = localStorage.getItem('@auge:author');

    if(!!author) return JSON.parse(author);

    return {} as IAuthor;
  });
  // @ts-ignore
  const [currentBanner, setCurrentBanner] = useState<IBanner>(() => {
    const banner = localStorage.getItem('@auge:banner');

    if(!!banner) return JSON.parse(banner);

    return {} as IBanner;
  });
  // @ts-ignore
  const [currentBuyer, setCurrentBuyer] = useState<IBuyer>(() => {
    const buyer = localStorage.getItem('@auge:buyer');

    if(!!buyer) return JSON.parse(buyer);

    return {} as IBuyer;
  });
  
  const updateClient = useCallback((client: Partial<MainClient>) => {
    let oldClient = currentClient ?? {};
    const newEntries = Object.entries(client);
    // @ts-ignore
    newEntries.forEach((e) => oldClient[e[0]] = e[1]);

    const updatedClient = {...oldClient, ...client};

    localStorage.setItem('@auge:client', JSON.stringify(updatedClient));
    // @ts-ignore
    setCurrentClient({});
    setCurrentClient({...oldClient, ...client});
  }, [currentClient]);

  const updateSale = useCallback((sale: Partial<ISaleData>) => {
    let oldSale = currentSale ?? {};
    const newEntries = Object.entries(sale);
    // @ts-ignore
    newEntries.forEach((e) => oldSale[e[0]] = e[1]);

    const updatedSale = {...oldSale, ...sale};

    localStorage.setItem('@auge:sale', JSON.stringify(updatedSale));
    // @ts-ignore
    setCurrentSale({});
    setCurrentSale({...oldSale, ...sale});
  }, [currentSale]);

  const updateShippingCompany = useCallback((shippingCompany: Partial<IShipping>) => {
    let oldShippingCompany = currentShippingCompany ?? {};
    const newEntries = Object.entries(shippingCompany);
    // @ts-ignore
    newEntries.forEach((e) => oldShippingCompany[e[0]] = e[1]);

    const updatedShippingCompany = {...oldShippingCompany, ...shippingCompany};
    
    localStorage.setItem('@auge:shippingCompany', JSON.stringify(updatedShippingCompany));
    // @ts-ignore
    setCurrentShippingCompany({});
    setCurrentShippingCompany({...oldShippingCompany, ...shippingCompany});
  }, [currentShippingCompany]);

  const updateSupplier = useCallback((supplier: Partial<MainSupplier>) => {
    let oldSupplier = currentSupplier ?? {};
    const newEntries = Object.entries(supplier);
    // @ts-ignore
    newEntries.forEach((e) => oldSupplier[e[0]] = e[1]);

    const updatedSupplier = {...oldSupplier, ...supplier};
    
    localStorage.setItem('@auge:supplier', JSON.stringify(updatedSupplier));
    // @ts-ignore
    setCurrentSupplier({});
    setCurrentSupplier({...oldSupplier, ...supplier});
  }, [currentSupplier]);
  
  const updateBlogPost = useCallback((blogPost: Partial<MainBlogPost>) => {
    let oldBlogPost = currentBlogPost ?? {};
    const newEntries = Object.entries(blogPost);
    // @ts-ignore
    newEntries.forEach((e) => oldBlogPost[e[0]] = e[1]);

    const updatedBlogPost = {...oldBlogPost, ...blogPost};
    
    localStorage.setItem('@auge:post', JSON.stringify(updatedBlogPost));
    // @ts-ignore
    setCurrentBlogPost({});
    setCurrentBlogPost({...oldBlogPost, ...blogPost});
  }, [currentBlogPost]);

  const updateAuthor = useCallback((author: Partial<IAuthor>) => {
    let oldAuthor = currentAuthor ?? {};
    const newEntries = Object.entries(author);
    // @ts-ignore
    newEntries.forEach((e) => oldAuthor[e[0]] = e[1]);

    const updatedAuthor = {...oldAuthor, ...author};
    
    localStorage.setItem('@auge:author', JSON.stringify(updatedAuthor));
    // @ts-ignore
    setCurrentAuthor({});
    setCurrentAuthor({...oldAuthor, ...author});
  }, [currentAuthor]);

  const updateBuyer = useCallback((buyer: Partial<IBuyer>) => {
    let oldBuyer = currentBuyer ?? {};
    const newEntries = Object.entries(buyer);
    // @ts-ignore
    newEntries.forEach((e) => oldBuyer[e[0]] = e[1]);

    const updatedBuyer = {...oldBuyer, ...buyer};
    
    localStorage.setItem('@auge:buyer', JSON.stringify(updatedBuyer));
    // @ts-ignore
    setCurrentBuyer({});
    setCurrentBuyer({...oldBuyer, ...buyer});
  }, [currentBuyer]);

  const handleSetClient = useCallback((updatedClient: MainClient) => {
    // @ts-ignore
    setCurrentClient({});
    localStorage.setItem('@auge:client', JSON.stringify(updatedClient));
    setCurrentClient(updatedClient);
  }, []);

  const handleSetClientGroup = useCallback((updatedClientGroup: MainClientGroup) => {
    // @ts-ignore
    setCurrentClientGroup({});
    localStorage.setItem('@auge:clientGroup', JSON.stringify(updatedClientGroup));
    setCurrentClientGroup(updatedClientGroup);
  }, []);

  const handleSetSale = useCallback((updatedSale: ISaleData) => {
    // @ts-ignore
    setCurrentSale({});
    localStorage.setItem('@auge:sale', JSON.stringify(updatedSale));
    setCurrentSale(updatedSale);
  }, []);

  const handleSetShippingCompany = useCallback((updatedShippingCompany: IShipping) => {
    // @ts-ignore
    setCurrentShippingCompany({});
    localStorage.setItem('@auge:shippingCompany', JSON.stringify(updatedShippingCompany));
    setCurrentShippingCompany(updatedShippingCompany);
  }, []);

  const handleSetBlogPost = useCallback((updatedBlogPost: MainBlogPost) => {
    // @ts-ignore
    setCurrentBlogPost({});
    localStorage.setItem('@auge:post', JSON.stringify(updatedBlogPost));
    setCurrentBlogPost(updatedBlogPost);
  }, []);

  const handleSetAuthor = useCallback((updatedAuthor: IAuthor) => {
    // @ts-ignore
    setCurrentAuthor({});
    localStorage.setItem('@auge:author', JSON.stringify(updatedAuthor));
    setCurrentAuthor(updatedAuthor);
  }, []);
  
  const handleSetSupplier = useCallback((updatedSupplier: MainSupplier) => {
    setCurrentSupplier({} as unknown as MainSupplier);
    localStorage.setItem('@auge:supplier', JSON.stringify(updatedSupplier));
    setCurrentSupplier(updatedSupplier);
  }, []);
  
  const handleSetBanner = useCallback((updatedBanner: IBanner) => {
    setCurrentBanner({} as unknown as IBanner);
    localStorage.setItem('@auge:banner', JSON.stringify(updatedBanner));
    setCurrentBanner(updatedBanner);
  }, []);
  
  const handleSetBuyer = useCallback((updatedBanner: IBuyer) => {
    setCurrentBuyer({} as unknown as IBuyer);
    localStorage.setItem('@auge:buyer', JSON.stringify(updatedBanner));
    setCurrentBuyer(updatedBanner);
  }, []);
  
  return (
    <RegisterContext.Provider
      value={{
        client: currentClient,
        setClient: handleSetClient,
        clientGroup: currentClientGroup,
        setClientGroup: handleSetClientGroup,
        sale: currentSale,
        setSale: handleSetSale,
        shippingCompany: currentShippingCompany,
        setShippingCompany: handleSetShippingCompany,
        supplier: currentSupplier,
        setSupplier: handleSetSupplier,
        blogPost: currentBlogPost,
        setBlogPost: handleSetBlogPost,
        author: currentAuthor,
        setAuthor: handleSetAuthor,
        banner: currentBanner,
        setBanner: handleSetBanner,
        buyer: currentBuyer,
        setBuyer: handleSetBuyer,
        updateClient,
        updateSale,
        updateShippingCompany,
        updateSupplier,
        updateBlogPost,
        updateAuthor,
        updateBuyer,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);

  if(!context)
    throw new Error("Hook invoked outside context.");

  return context;
}