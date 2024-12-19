import { DefaultValueProps, IProductsDetailsProduct } from '~types/main';
import { ResultsData } from '~pages/Store/Import/New';

const customRelatedProducts: IProductsDetailsProduct[] = [
  {
    ref: '8373625',
    product: 'Caminhão 2 carros Hulk e Capitão América',
    category: 'Veículos',
    available: true,
    viewed: 126,
    purchased: 78,
    image: 'https://a-static.mlcdn.com.br/1500x1500/carro-avengers-racer-hulk-capitao-america-homem-de-ferro-roma-brinquedos/toyslandia/1935rm-hk/004950f25ad407a2e455843a75678036.jpg',
    brands: [
      {
        name: 'Avengers',
        image: 'https://i0.wp.com/black-zeus.com/wp-content/uploads/2020/12/AvEnGeRs-WhItE-lOgO-Black-Zeus-14sd1at3.png?fit=1200%2C1200&ssl=1'
      },
      {
        name: 'Avengers',
        image: 'https://i0.wp.com/black-zeus.com/wp-content/uploads/2020/12/AvEnGeRs-WhItE-lOgO-Black-Zeus-14sd1at3.png?fit=1200%2C1200&ssl=1'
      }
    ]
  },
  {
    ref: '8373626',
    product: 'Fender Stratocaster Custom Shop',
    category: 'Instrumentos',
    available: true,
    viewed: 1026,
    purchased: 2,
    image: 'https://i.ebayimg.com/images/g/vBIAAOSwd4pe9jLg/s-l400.jpg',
    brands: [
      {
        name: 'Fender',
        image: 'https://afropunk.com/wp-content/uploads/2019/04/fender-logo.jpg'
      },
      {
        name: 'Fender',
        image: 'https://afropunk.com/wp-content/uploads/2019/04/fender-logo.jpg'
      }
    ]
  }
];

// const customImportTemplates = [
//   {
//     template: 'Fun 2022',
//     supplier: 'Fun Brinquedos',
//     date: new Date(1360900090000),
//     products: 255,
//     errors: 42,
//     user: 'Tyler Durden',
//   },
//   {
//     template: 'Barão Natal',
//     supplier: 'Barão Distribuidor',
//     date: new Date(1574900080000),
//     products: 1.898,
//     errors: 78,
//     user: 'Tyler Durden',
//   },
//   {
//     template: 'Kids Zone',
//     supplier: 'Kids Zone World',
//     date: new Date(1560900090000),
//     products: 446,
//     errors: 0,
//     user: 'Tyler Durden',
//   },
// ];

const customReports: ResultsData[] = [
  {
    line: "0",
    column_reference: "B",
    column_name: "Categoria",
    product_reference: null,
    status: "ERRO",
    message: "O campo Categoria não pode estar vazio."
  },
  {
    line: "1",
    column_reference: "B",
    column_name: "Categoria",
    product_reference: null,
    status: "ERRO",
    message: "O campo Categoria não pode estar vazio."
  },
  {
    line: "2",
    column_reference: "B",
    column_name: "Categoria",
    product_reference: "Tabela de Precos - Fora SP (06\/01\/2022 01:04)",
    status: "ERRO",
    message: "O campo Categoria não pode estar vazio."
  },
  {
    line: "3",
    column_reference: "A",
    column_name: "Título",
    product_reference: "Cod",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  },
  {
    line: "4",
    column_reference: "A",
    column_name: "Título",
    product_reference: "F0063-1",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  },
  {
    line: "5",
    column_reference: "A",
    column_name: "Título",
    product_reference: "F0063-0",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  },
  {
    line: "6",
    column_reference: "A",
    column_name: "Título",
    product_reference: "F0063-2",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  },
  {
    line: "7",
    column_reference: "A",
    column_name: "Título",
    product_reference: "F0051-6",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  },
  {
    line: "8",
    column_reference: "A",
    column_name: "Título",
    product_reference: "F0051-7",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  },
  {
    line: "9",
    column_reference: "A",
    column_name: "Título",
    product_reference: "F0000-2",
    status: "ERRO",
    message: "O campo Título não pode estar vazio"
  }
];

const baseColumnOptions: DefaultValueProps[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "H", label: "H" },
  { value: "I", label: "I" },
  { value: "J", label: "J" },
  { value: "K", label: "K" },
  { value: "L", label: "L" },
  { value: "M", label: "M" },
  { value: "N", label: "N" },
  { value: "O", label: "O" },
  { value: "P", label: "P" },
  { value: "Q", label: "Q" },
  { value: "R", label: "R" },
  { value: "S", label: "S" },
  { value: "T", label: "T" },
  { value: "U", label: "U" },
  { value: "V", label: "V" },
  { value: "W", label: "W" },
  { value: "X", label: "X" },
  { value: "Y", label: "Y" },
  { value: "Z", label: "Z" }
]

export { customRelatedProducts, customReports, baseColumnOptions }