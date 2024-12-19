import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode
} from 'react';

import { ITemplate, MainProduct } from '~types/main';
import { ProductAttribute as IProductAttribute } from '~types/main';
import { api } from '~api';

type Supplier = {
  id: number;
  name: string;
}

type ProductContextData = {
  supplier: Supplier;
  setSupplier: (supplier: Supplier) => void;
  product: MainProduct;
  setProduct: (product: MainProduct) => void;
  updateProduct: (product: MainProduct) => void;
  attributes: IProductAttribute[];
  fetchAttributes: () => void;
  products: MainProduct[];
  fetchProducts: () => void;
  resetProductAttributes: () => void;
  currentImport: ITemplate;
  setCurrentImport: (template: ITemplate) => void;
}

const ProductContext = createContext<ProductContextData>({} as ProductContextData);

type ProviderProps = {
  children: ReactNode;
}

export function ProductProvider({ children }: ProviderProps) {
  // @ts-ignore
  const [supplier, setSupplier] = useState<Supplier>(() => {
    const supplier = localStorage.getItem('@auge:supplier');

    if(!!supplier) return JSON.parse(supplier);

    return {} as Supplier;
  });
  
  // @ts-ignore
  const [currentProduct, setCurrentProduct] = useState<MainProduct>(() => {
    const product = localStorage.getItem('@auge:product');

    if(!!product) return JSON.parse(product);

    return {} as MainProduct;
  });

  const [currentImport, setCurrentImport] = useState(() => {
    const template = localStorage.getItem('@auge:template');

    if(!!template) return JSON.parse(template);

    return {} as ITemplate;
  })

  const [attributes, setAttributes] = useState<IProductAttribute[]>([]);
  const [products, setProducts] = useState<MainProduct[]>([]);

  const fetchAttributes = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.get('/products/attribute-categories');

      setAttributes(data.map((a: IProductAttribute) => ({...a, registered: true})));
    } catch(e) {
      console.log('e', e);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const {
        data: {
          data: { data }
        }
      } = await api.get(`https://augeapp.com.br/products?by_supplier=${supplier.id}`);

      setProducts(data.map((p: MainProduct) => ({...p, registered: true})));
    } catch(e) {
      console.log('e', e);
    }
  }, [supplier]);
  
  const resetProductAttributes = useCallback(async () => {
    setProducts([]);
    setAttributes([]);
  }, []);

  const updateProduct = useCallback((product: MainProduct) => {
    let oldProduct = currentProduct;

    const newEntries = Object.entries(product);
    // @ts-ignore
    newEntries.forEach((e) => oldProduct[e[0]] = e[1]);
    // @ts-ignore
    // newEntries.forEach((e) => console.log(`${e[0]}`, e[1]));

    const updatedProduct = {...oldProduct, ...product};
    
    localStorage.setItem('@auge:product', JSON.stringify(updatedProduct));
    // @ts-ignore
    setCurrentProduct({});
    setCurrentProduct({...oldProduct, ...product});
  }, [currentProduct]);
  
  const handleSetProduct = useCallback((updatedProduct: MainProduct) => {
      // @ts-ignore
    setCurrentProduct({});
    localStorage.setItem('@auge:product', JSON.stringify(updatedProduct));
    setCurrentProduct(updatedProduct);
  }, []);
  
  const handleSetSupplier = useCallback((updatedSupplier: Supplier) => {
      // @ts-ignore
    localStorage.setItem('@auge:supplier', JSON.stringify(updatedSupplier));
    setSupplier(updatedSupplier);
  }, []);
  
  const handleSetTemplate = useCallback((updatedTemplate: ITemplate) => {
      // @ts-ignore
    localStorage.setItem('@auge:template', JSON.stringify(updatedTemplate));
    setCurrentImport(updatedTemplate);
  }, []);

  //useEffect(() => {
  //  console.log('updated product', currentProduct)
  //}, [currentProduct])

  return (
    <ProductContext.Provider
      value={{
        product: currentProduct,
        setProduct: handleSetProduct,
        updateProduct,
        supplier,
        setSupplier: handleSetSupplier,
        attributes,
        fetchAttributes,
        products,
        fetchProducts,
        resetProductAttributes,
        currentImport,
        setCurrentImport: handleSetTemplate,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);

  if(!context)
    throw new Error("Hook invoked outside context.");

  return context;
}