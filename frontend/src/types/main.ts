import { number, string } from 'prop-types';
import {
  FunctionComponent,
  SVGProps,
  InputHTMLAttributes,
  ReactNode,
  CSSProperties,
  RefObject,
  TextareaHTMLAttributes
} from 'react';

import ReactInputMask from 'react-input-mask';
import { MainAttribute } from '../pages/Store/Attributes';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  validated?: boolean;
  width?: string;
  style?: CSSProperties;
  fullW?: boolean;
  noTitle?: boolean;
  ref?: RefObject<HTMLInputElement>;
}

export interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  validated: boolean;
  width?: string;
  mask?: string;
  style?: CSSProperties;
  fullW?: boolean;
  noTitle?: boolean;
  ref?: RefObject<ReactInputMask>;
}

export interface FormInputProps extends InputProps {
  title: string;
  fontSize?: string;
  showCharsWord?: boolean;
  customOnBlur?: Function;
}

export interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disabled?: boolean;
  validated?: boolean;
  width?: string;
  style?: CSSProperties;
  fullW?: boolean;
  noTitle?: boolean;
  title: string;
  type?: string;
  fontSize?: string;
  showCharsWord?: boolean;
  customOnBlur?: Function;
  ref?: RefObject<HTMLTextAreaElement>;
}

export type Badge = FunctionComponent<SVGProps<SVGSVGElement> & {title?: string | undefined;}>;

export type Component = {
  children?: ReactNode;
  style?: CSSProperties;
}

export type ITag = {
  id: string;
  value: string;
}

export type Supplier = {
  id: number;
  name: string;
  title?: string;
  slug: string;
  image: string[] | {
    JPG: string;
    WEBP: string;
  };
  is_available: boolean;
  categories_count: number;
  categories: ICategory[];
  products_count: number;
  products_available_count: number;
  created_at: string;
  updated_at: string;
  last_imported_at: string;
}

export type ICategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
  products_count: number;
}

export type IBlogCategory = {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  seo_description: string;
  seo_keywords: string;
  seo_title: string;
  slug_path: string;
  order: number;
  posts_count: number;
  depth: number;
  categories: IBlogCategory[];
}

export type IBrand = {
  id: number;
  name: string;
  slug: string;
  image: {
    JPG: string;
    WEBP: string;
  };
}

export type HighlightImage = {
  id: number;
  name: string;
  registered: boolean;
  image: {
    JPG: string;
    WEBP: string;
  };
}

export type IProductsDetailsProduct = {
  ref: string;
  product: string;
  category: string;
  available: boolean;
  image: string;
  viewed: number;
  purchased: number;
  brands: {
    name: string;
    image: string;
  }[]
}

export interface DefaultValueProps {
  label: string;
  value: string;
}

export interface DefaultValuePropsWithId {
  id: number;
  label: string;
  value: string;
}

export type LocationState = {
  name: string;
  id: number;
  t: ITemplate;
}

export type PDFFile = {
  ​name: string;
  fileUrl: string;
  type: string;
  size: number;
  lastModified: number;
  webkitRelativePath: string;
}

export type IProduct = {
  id: number;
  slug: string;
  reference: string;
  ean13: string;
  seo_title: string;
  created_at: string;
  updated_at: string;
}

export type Image = {
  id: number;
  name: string;
  label: string;
  dimensions: string;
  order: number;
  image: {
    JPG: string;
    WEBP: string;
  };
}

export type ProductAttribute = {
  id: number;
  name: string;
  order: number;
  values: string
}

export type AttributeCategory = {
  id: number;
  name: string;
  products_count: number;
}

export type MainProduct = {
  id: number;
  supplier: Supplier;
  supplier_id: string;
  slug: string;
  invisible_title: string;
  reference: string;
  ean13: string;
  title: string;
  seo_title: string;
  description: string;
  created_at: string;
  updated_at: string;
	searcheable: string;
	image: string;
	published_at: string;
	featured_until: string;
	use_video: 0;
	youtube_link: string;
	primary_text: string;
	secondary_text: string;
	inner_code: string;
	dun14: string;
	expiration_date: string;
	origin: string;
	release_year: string;
	catalog_name: string;
	catalog_page: string;
	gender: string;
	size_height: string;
	size_width: string;
	size_length: string;
	size_cubic: string;
	size_weight: string;
	packing_type: string;
	box_height: string;
	box_width: string;
	box_length: string;
	box_cubic: string;
	box_weight: string;
	box_packing_type: string;
	unit_price: string;
	unit_price_promotional: string;
	unit_minimal: string;
	unit_subtotal: string;
	availability: string;
	expected_arrival: string;
	box_price: string;
	box_price_promotional: string;
	box_minimal: string;
	box_subtotal: string;
	ipi: string;
	ncm: string;
	cst: string;
	icms: string;
	certification: string;
	age_group: string;
	seo_tags: string;
	seo_description: string;
	qrcode_color: string;
	qrcode_custom_title: string;
	qrcode_title: string;
	qrcode_image1: string;
	qrcode_image2: string;
	views: string;
	sales: string;
	category: ICategory;
	category_id: string;
	brand: IBrand;
	brand_id: string;
	badge: string;
  tags: ITag[];
  seoTags: ITag[];
  certificationTags: ITag[];
  images: Image[];
  pictures: Image[];
  file: string;
  highlightImage: DefaultValueProps;
  qrCustomTitle: string;
  related: MainProduct[];
  variations: MainProduct[];
  embed: MainProduct;
  embed_title: string;
  embed_type: string;
  embed_id: number;
  embedded_product: string;
  pdf: PDFFile;
  url: string;
  full_url: string;
  attribute_category: AttributeCategory | null;
  attributes: ProductAttribute[];
  enable_fractional_box: number;
  main_image: Image;
}

export type IAuthor = {
  id: number;
  name: string;
  email: string;
  image: {
    JPG: string;
    WEBP: string;
  };
  biography: string;
  card_color: string;
  facebook: string;
  instagram: string;
  resume: string;
  twitter: string;
  use_card_on_post: boolean;
  youtube: string;
  qr_code_color: string;
}


export type MainBlogPost = {
  id: number;
  title: string;
  slug: string;
  searcheable: string;
  published_at: string;
  featured_until: null,
  use_video: number;
  youtube_link: string | null;
  primary_text: string;
  secondary_text: string;
  seo_title: string;
  seo_tags: string;
  seo_description: string;
  url: string;
  embed: {
    id: number;
    title: string;
    slug: string;
    published_at: string;
    updated_at: string;
    category_name: string;
  };
  embed_title: string;
  embed_type: string;
  embed_id: number;
  main_image: Image;
  images: Image[];
  pictures: Image[];
  file: string;
  tags: ITag[];
  seoTags: ITag[];
  category: IBlogCategory;
	category_id: string;
  author: IAuthor;
	author_id: string;
  qrcode_image1: string;
	qrcode_image2: string;
	qrcode_color: string;
	full_url: string;
	api_reference: string;
  created_at: string;
  updated_at: string;
}

export type IRelatedProduct = {
  availability: string;
  badge: string;
  box_minimal: string;
  box_price: string;
  box_price_promotional: string;
  box_subtotal: string;
  brand: string;
  created_at: string;
  id: number;
  reference: string;
  title: string;
  unit_minimal: number;
  unit_price: string;
  unit_price_promotional: string;
  unit_subtotal: string;
  updated_at: string;
}


export type CustomProductData = {
  primary_text?: string;
  secondary_text?: string;
  gender?: string;
  tags?: ITag[];
  seoTags?: ITag[];
  pictures?: Image[];
  file?: string;
  highlightImage?: DefaultValueProps;
  qrcode_color?: string;
  qrcode_image1?: string;
  qrcode_image2?: string;
  qrCustomTitle?: string;
  pdf?: PDFFile[];
  certificationTags?: ITag[];
  qrCodeCustomTitle?: string;
}

export type CustomBlogPostData = {
  primary_text?: string;
  secondary_text?: string;
  // gender?: string;
  tags?: ITag[];
  seoTags?: ITag[];
  pictures?: Image[];
  file?: string;
  // highlightImage?: DefaultValueProps;
  qrcode_color?: string;
  qrcode_image1?: string;
  qrcode_image2?: string;
  // pdf?: PDFFile;
  // certificationTags?: ITag[];
}

export type IReport = {
  line: string;
	column_reference: string;
	column_name: string;
	product_reference: string | null;
	status: "SUCESSO" | "ERRO";
	message: string;
}

export type ITemplate = {
  id: number;
  name: string;
  supplier: Supplier;
  updated_at: string;
  value: string;
  user: {
    name: string;
  };
  products_count: number;
  errors: number;
  initial_line: number;
  new_register: string;
  reports: IReport[];
}

export type InstallmentRule = {
  id: number;
  name: string;
  min_value: string;
  installments: string;
  installment_discount_value: number;
  discount_value: number;
  installment_additional_value: number;
  additional_value: number;
  in_cash: string;
  in_cash_discount_value: string;
  in_cash_additional_value: string;
  client: string | null;
  client_group: string | null;
}

export type IBaseType = {
  id: number;
  name: string;
}

export interface IState extends IBaseType {
  code: string;
}

export type MainClientSupplier = {
  name: string;
  commercial_commission: string;
  profile_discount: string;
  fractional_box: number;
  is_available: number;
  icms: string;
  last_order: string;
}

type MainClientOrder = {
  count_orders: number;
  last_order: {
    created_at: string;
    formated_date_time: string;
    seller_name: string;
    supplier_name: string;
    count_products: number;
    total_value: string;
    total_value_with_ipi: string;
  }
  created_at: string;
  formated_date_time: string;
}

type MainClientCart = {
  last_update: string;
  products_count: string;
  subtotal_with_ipi: string;
}

export type MainClient = {
  id: number;
  name: string;
  company_name: string;
  document: string;
  state_registration: string;
  joint_stock: string;
  created_at: string;
  status: string;
  commercial_status: string;
  website: string;
  pdv_type: IBaseType;
  group: IBaseType;
  profile: IBaseType;
  region: IBaseType;
  last_login: string;
  main_address: {
    state: IBaseType;
  }
  tax_regime: IBaseType;
  buyer_id: number;
  seller: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  updated_at: string;
  activity_start: string;
	phones: IPhone[];
  newsletter_tags: string;
  blocked_suppliers: IBaseType[];
  regions: IBaseType[];
  has_ecommerce: boolean;
  order_schedule: boolean;
  order_balance: boolean;
  enter_price_on_order: boolean;
  can_migrate_service: boolean;
  hasEcommerce?: string;
  orderSchedule?: string;
  orderBalance?: string;
  enterPriceOnOrder?: string;
  canMigrateService?: string;
  contacts: IContact[];
  addresses: IAddress[];
  bank_accounts: IBankAccount[];
  cart: MainClientCart;
  suppliers: MainClientSupplier[];
  orders: MainClientOrder;
  count_clients: number;
  buyer: {
    id: number;
    email: string;
    name: string;
  }
}

export type MainClientGroup = {
  id: number;
  name: string;
  count_clients: number;
  buyer: {
    id: number;
    email: string;
    name: string;
  }
  clients: {
    id: number
    name: string;
    company_name: string;
    document: string;
    main_address: {
      city: {
        id: number;
        name: string;
      }
      complement: string;
      district: string;
      full_address: string;
      number: number;
      state: {
        id: number;
        name: string;
        code: string;
      };
      street: string;
      type: {
        id: number;
        name: string;
      }
      zipcode: string;
    }
  }[]
  created_at: string;
  updated_at: string;
  orders: MainClientOrder;
}

export type IPaymentPromotion = {
  id: number;
  order_deadline: string;
	min_value: string;
	payment_term_start: string;
}

export type IStateDiscount = {
  id: number;
  discount_value: string;
	additional_value: string;
	states: ICountryState[];
}

export type IProfileDiscount = {
  id: number;
  profile: IBaseType;
	fractional_box: number;
	discount_value: string;
	auge_commission: string;
	commercial_commission: string;
  categories: ICategory[];
}

export interface IProfileDiscountProps extends Omit<IProfileDiscount, 'profile'> {
  client_profile_id: number;
}


export type IFractionation = {
  id: number;
  enable: number;
  profile: IBaseType;
}

export interface IFractionationProps extends Omit<IFractionation, 'profile'> {
  client_profile_id: number;
}

export type IPhone = {
  id: number;
	type: string;
	country_code: string;
	number: string;
}

export type MainSupplier = {
  id: number;
	name: string;
	slug: string;
	company_name: string;
	document: string;
	document_status: string;
	state_registration: string;
	code: string;
	activity_start: string;
	age: string;
	status: string;
	auge_register: string;
	corporate_email: string;
	website: string;
	instagram: string;
	facebook: string;
	youtube: string;
	twitter: string;
	commercial_status: string;
	order_schedule: string;
	order_balance: string;
	enter_price_on_order: string;
	can_migrate_service: string;
	auto_observation_order: string;
	min_ticket: string;
	min_order: string;
	discount_in_cash: string;
	fractional_box: number;
	allows_reservation: number;
	client_mei_value: string;
	client_vip_value: string;
	client_premium_value: string;
	client_platinum_value: string;
	discount_type: string;
	lead_time: IBaseType;
	shipping_company: IBaseType;
	tax_regime: IBaseType;
	phones: IPhone[];
	commission_rules: IBaseType[];
	blocked_regions: IBaseType[];
	blocking_rules: IBaseType[];
	blocked_states: IState[];
	payment_promotions: IPaymentPromotion[];
	promotions: IPromotion[];
  profile_discounts: IProfileDiscount[];
	installment_rules: InstallmentRule[];
	state_discounts: IStateDiscount[];
	is_available: boolean;
	categories_count: number;
	products_count: number;
	products_available_count: number;
	last_imported_at: string;
	created_at: string;
	updated_at: string;
  suspend_sales: boolean;
  suspendSales?: string;
  orderSchedule?: string;
  orderBalance?: string;
  enterPriceOnOrder?: string;
  canMigrateService?: string;
  fractionalBox?: number;
  allowReservation?: string;
  newsletterTags?: ITag[];
  contacts: IContact[];
  addresses: IAddress[];
  bank_accounts: IBankAccount[];
  profile_fractionations: IFractionation[];
  image: {
    JPG: string;
    WEBP: string;
  };
} 

export type CustomSupplierData = {
  suspendSales?: string;
  orderSchedule?: string;
  orderBalance?: string;
  enterPriceOnOrder?: string;
  canMigrateService?: string;
  website?: string;
  fractionalBox?: number;
  allowReservation?: string;
  newsletterTags?: ITag[];
}

export type ICountryState = {
  id: number;
  name: string;
  code: string;
}

export type IPromotion = {
  id: number;
  name: string;
  code: string;
  discount_value: string;
  min_quantity: string;
  max_quantity: string;
  valid_until: string;
  type: string;
  items: string;
  products: MainProduct[];
  categories: ICategory[];
}

export type IPromotionProps = {
	id: number;
	min_quantity: string;
  discount_value: string;
	max_quantity: string;
	valid_until: string;
	type: string;
	items: string;
}

export interface IProductPromotionProps extends IPromotionProps {
  products: MainProduct[];
}

export type IContact = {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  phone: string;
  phone_branch: string;
  whatsapp: string;
}

export type IAddress = {
  id: number;
  zipcode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  country_state_id: string;
  type_id: string;
}

export type IBankAccount = {
  id: number;
  owner_name: string;
  document: string;
  bank_id: number;
  account_number: string;
  agency: string;
  operation: string;
  pix_key: string;
  paypal: string;
}

export type IBuyer = {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  group: IBaseType;
  client_group_id: string;
  role_name: string;
  role: IBaseType;
  created_at: string;
  updated_at: string;
  active: number;
  can_be_deleted: number;
  clients: {
    id: 9
    name: string
    document: string;
    status: string
    main_address: {
      full_address: string;
    }
    addresses: string[];
    company_name: string;
    created_at: string;
    updated_at: string;
  }[];
}

export type ISaleProduct = {
  discount: number;
  discount_percentage: string;
  getUnitPriceWithIpi: number;
  getUnitPrice: number;
  getSubtotalWithIpi: number;
  fractionated: false;
  image: {
    JPG: string;
    WEBP: string;
  };
  original_price: number;
  qty: number;
  reference: string;
  subtotal: number;
  thumb: {
    JPG: string;
    WEBP: string;
  };
  title: string;
  unit_price: number;
}

export type ISale = {
  id: number;
  address_city: string | null;
  client_name: string | null;
  code: string | null;
  current_status: 'Todos' | 'Novo' | 'Recebido' | 'Transmitido' | 'Faturado' | 'Pausado' | 'Cancelado';
  date: string;
  formated_date: string;
  supplier_name: string | null;
  total_value: string;
  products: ISaleProduct[];
}

export type ISeller = {
  id: number;
  name: string;
  email: string;
  phone: string;
  cellphone: string;
}

export type ISaleData = {
  address_city: string;
  address_complement: string | null;
  coupon: string;
  address_district: string;
  address_number: string;
  address_state: string;
  address_street: string;
  coupon_discount_value: string;
  installment_discount_value: string;
  external_created_at: string;
  address_zipcode: string;
  buyer_cellphone: string;
  order_type: string;
  buyer_email: string;
  buyer_name: string;
  client_activity_start: string;
  client_code: string;
  client_document: string;
  client_email: string | null;
  client_formated_activity_start: string;
  client_group: string;
  client_name: string;
  client_state_registration: string;
  client_last_order: string;
  code: string;
  current_status: string;
  date: string;
  formated_date: string;
  installments: string | null;
  origin: string;
  products: ISaleProduct[];
  quantities: string;
  sale_channel: IBaseType;
  seller: ISeller;
  shipping_company: string;
  fractional_box: string;
  statuses: IBaseType[];
  supplier_name: string;
  total_value: string;
  voucher: string | null;
  voucher_discount: string | null;
  download: string | undefined;
}

export type IShipping = {
  id: number;
  company_name: string;
  name: string;
  document: string;
  phone: string;
  cellphone: string | null;
  whatsapp: string;
  email: string;
  country_state_id: number;
  country_state: {
    id: number;
    name: string;
    code: string;
  }
}

export type IBannerImage = {
  id: string;
  name: string;
  label: string;
  order: number;
  link: string;
  imageping: string;
  url: string;
}

export type IBanner = {
  id: number;
  name: string;
  desktop_images_count: number;
  mobile_images_count: number;
  desktop_images: IBannerImage[];
  mobile_images: IBannerImage[];
}