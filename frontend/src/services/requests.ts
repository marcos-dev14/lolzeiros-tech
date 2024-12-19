import { DefaultValueProps, DefaultValuePropsWithId, HighlightImage, IBanner, IBrand, ICategory, Supplier } from "../types/main";
import { api } from "./api";

type FetchSupplierResponse = {
  shippingOptions: DefaultValuePropsWithId[];
  leadTimesOptions: DefaultValuePropsWithId[];
  taxRegimesOptions: DefaultValuePropsWithId[];
  commissionRulesOptions: DefaultValuePropsWithId[];
  blogPostsOptions: DefaultValuePropsWithId[];
}

type ISet = {
  [key: number]: string;
}

type FetchRulesResponse = {
  countrySet: ISet;
  regionsSet: ISet;
  countryStatesOptions: DefaultValuePropsWithId[];
  regionsOptions: DefaultValuePropsWithId[];
}

type FetchProductsResponse = {
  suppliers: any[];
  suppliersOptions: DefaultValueProps[];
  brands: any[];
  brandsOptions: DefaultValueProps[];
  categories: any[];
  categoriesOptions: DefaultValueProps[];
  badges: any[];
  badgeOptions: DefaultValuePropsWithId[];
  availabilityOptions: string[];
  boxPackingOptions: string[];
  ageGroupOptions: string[];
  genderOptions: string[];
  originOptions: string[];
  packingTypeOptions: string[];
  releaseOptions: string[];
}

type FetchBlogResponse = {
  categoriesOptions: DefaultValuePropsWithId[];
  authorsOptions: DefaultValuePropsWithId[];
  blogPostsOptions: DefaultValuePropsWithId[];
}

type FetchBannersResponse = {
  desktop: IBanner[];
  mobile: IBanner[];
}

export async function fetchSupplierData(): Promise<FetchSupplierResponse>{ 
  try {
    const [
      shippingResponse,
      leadTimesResponse,
      taxRegimesResponse,
      commissionRulesResponse,
      blogPostsResponse,
    ] = await Promise.all([
      // api.get('/suppliers/shipping_companies'),
      api.get('/suppliers/shipping_types'),
      api.get('/suppliers/lead_times'),
      api.get('/tax_regimes'),
      api.get('/suppliers/commission_rules'),
      api.get('/blogs/posts')
    ])

    const {
      data: { data: shipping }
    } = shippingResponse;

    const {
      data: { data: leadTimes }
    } = leadTimesResponse;

    const {
      data: { data: taxRegimes }
    } = taxRegimesResponse;

    const {
      data: { data: commissionRules }
    } = commissionRulesResponse;

    const {
      data: {
        data: {
          data: blogPosts
        }
      }
    } = blogPostsResponse;

    // @ts-ignore
    const shippingOptions: DefaultValuePropsWithId[] = [{ id: -1, value: 'new', label: 'Novo Modelo' }, ...shipping.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))]
    
    // @ts-ignore
    const leadTimesOptions: DefaultValuePropsWithId[] = [{ id: -1, value: 'new', label: 'Novo Modelo' }, ...leadTimes.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))]  
    
    // @ts-ignore
    const taxRegimesOptions: DefaultValuePropsWithId[] = [{ id: -1, value: 'new', label: 'Novo Modelo' }, ...taxRegimes.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))]
    
    // @ts-ignore
    const commissionRulesOptions: DefaultValuePropsWithId[] = commissionRules.map((a: string) => ({ id: a.id, name: a.name, value: a.name, label: a.name }))
    
    // @ts-ignore
    const blogPostsOptions: DefaultValuePropsWithId[] = blogPosts.map((a) => ({ id: a.id, value: a.title, label: a.title })); 

    return {
      shippingOptions,
      leadTimesOptions,
      taxRegimesOptions,
      commissionRulesOptions,
      blogPostsOptions
    }
  }
  catch(e) {
    return {
      shippingOptions: [],
      leadTimesOptions: [],
      taxRegimesOptions: [],
      commissionRulesOptions: [],
      blogPostsOptions: []
    } 
  }
}

export async function fetchRulesData(): Promise<FetchRulesResponse> {
  try {    
    const [
      countryStatesResponse,
      regionsResponse
    ] = await Promise.all([
      api.get('/country_states'),
      api.get('/blocking_rules')
    ])

    const {
      data: { data: countryStates }
    } = countryStatesResponse;

    const {
      data: { data: regions }
    } = regionsResponse;

    let countrySet = {};
    let regionsSet = {};

    // @ts-ignore
    countryStates.forEach((s) => countrySet[s.id] = s.name);
    // @ts-ignore
    regions.forEach((s) => regionsSet[s.id] = s.name);

    // @ts-ignore
    const countryStatesOptions: DefaultValuePropsWithId[] = countryStates.map((a) => ({ id: a.id, value: a.code, label: a.code })); 
    
    // @ts-ignore
    const regionsOptions: DefaultValuePropsWithId[] = regions.map((a) => ({ id: a.id, value: a.name, label: a.name })); 

    return {
      countrySet,
      regionsSet,
      countryStatesOptions,
      regionsOptions
    }

  } catch (e) {
    return {
      countrySet: {},
      regionsSet: {},
      countryStatesOptions: [],
      regionsOptions: []
    }
  }
}

// @ts-ignore
export async function fetchProductsData({ queryKey }): Promise<FetchProductsResponse>{ 
  try {

    const id = queryKey[1];
    const [
      suppliersResponse,
      categoriesResponse,
      brandsResponse,
      badgesResponse,
      configurationsResponse,
      // productsResponse
    ] = await Promise.all([
      api.get('products/suppliers'),
      api.get(`products/suppliers/${id}/categories`),
      api.get('products/brands'),
      api.get('products/badges'),
      api.get('/configurations'),
      // api.get(`products?by_supplier=${id}&paginated=false`)
    ]);

    const {
      data: {
        data: suppliers
      }
    } = suppliersResponse;
    
    const {
      data: {
        data: categories 
      }
    } = categoriesResponse;

    const {
      data: {
        data: brands 
      }
    } = brandsResponse;
    
    const {
      data: {
        data: badges 
      }
    } = badgesResponse;

    const { 
      data: { 
        data: { products: config }
      }
    } = configurationsResponse;

    const {
      availability,
      box_packing,
      gender,
      origin,
      packing_type,
      release,
      age_group
    } = config;

    const suppliersOptions: DefaultValueProps[] = suppliers.map((s: Supplier) => ({ value: s.name, label: s.name }));
    const brandsOptions: DefaultValueProps[] = brands.map((b: IBrand) => ({ value: b.name, label: b.name }));
    const categoriesOptions: DefaultValueProps[] = categories.map((c: ICategory) => ({ value: c.name, label: c.name }));
    const badgeOptions: DefaultValuePropsWithId[] = badges.map((b: HighlightImage) => ({ id: b.id, value: b.image.JPG, label: b.name }));

    const availabilityOptions = availability.map((a: string) => ({ value: a, label: a }));
    const boxPackingOptions = box_packing.map((b: string) => ({ value: b, label: b }));
    const ageGroupOptions = age_group.map((c: string) => ({ value: c, label: c }));
    const genderOptions = gender;
    const originOptions = origin.map((o: string) => ({ value: o, label: o }));
    const packingTypeOptions = packing_type.map((p: string) => ({ value: p, label: p }));
    const releaseOptions = release.map((r: string) => ({ value: r, label: r })).reverse();

    return {
      suppliers,
      suppliersOptions,
      brands,
      brandsOptions,
      categories,
      categoriesOptions,
      badges,
      badgeOptions,
      availabilityOptions,
      boxPackingOptions,
      ageGroupOptions,
      genderOptions,
      originOptions,
      packingTypeOptions,
      releaseOptions  
    }
  }
  catch(e) {
    return {
      suppliers: [],
      suppliersOptions: [],
      brands: [],
      brandsOptions: [],
      categories: [],
      categoriesOptions: [],
      badges: [],
      badgeOptions: [],
      availabilityOptions: [],
      boxPackingOptions: [],
      ageGroupOptions: [],
      genderOptions: [],
      originOptions: [],
      packingTypeOptions: [],
      releaseOptions: []
    } 
  }
}

// @ts-ignore
export async function fetchBlogData(): Promise<FetchBlogResponse>{ 
  try {
    const [
      categoriesResponse,
      authorsResponse,
      postsResponse
    ] = await Promise.all([
      api.get('blogs/categories'),
      api.get('blogs/authors'),
      api.get('blogs/posts?paginated=false'),
    ]);

    const {
      data: {
        data: categories
      }
    } = categoriesResponse;

    const {
      data: {
        data: authors
      }
    } = authorsResponse;

    const {
      data: {
        data: blogPosts 
      }
    } = postsResponse;

    // @ts-ignore
    const categoriesOptions: DefaultValuePropsWithId[] = categories.map(e => ({ id: e.id, value: e.name, label: e.name }));
    
    // @ts-ignore
    const authorsOptions: DefaultValuePropsWithId[] = authors.map(e => ({ id: e.id, value: e.name, label: e.name }));
    
    // @ts-ignore
    const blogPostsOptions: DefaultValuePropsWithId[] = blogPosts.map(b => ({ id: b.id, value: b.title, label: b.title }));

    return {
      categoriesOptions,
      authorsOptions,
      blogPostsOptions
    }
  }
  catch(e) {
    return {
      categoriesOptions: [],
      authorsOptions: [],
      blogPostsOptions: []
    } 
  }
}
