// @ts-nocheck
import { formatDistanceStrict } from 'date-fns';

export const emptyFieldRegex = new RegExp(/^(?=\w+).*$/);

const phoneRegex = new RegExp(/^(\([0-9]{2}\)\s([9][0-9]{4})\-[0-9]{4})$/);
const landlineRegex = new RegExp(/^(\([0-9]{2}\)\s[0-9]{4}\-[0-9]{4})$/);

const zipcodeRegex = new RegExp(/^([0-9]{5})([0-9]{3})$/);

const mailValidation = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

// @ts-ignore
export function cnpjValidation(value) {
  if (!value) return false

  // Aceita receber o valor como string, número ou array com todos os dígitos
  const isString = typeof value === 'string'
  const validTypes = isString || Number.isInteger(value) || Array.isArray(value)

  // Elimina valor em formato inválido
  if (!validTypes) return false

  // Filtro inicial para entradas do tipo string
  if (isString) {
    // Limita ao máximo de 18 caracteres, para CNPJ formatado
    if (value.length > 18) return false

    // Teste Regex para veificar se é uma string apenas dígitos válida
    const digitsOnly = /^\d{14}$/.test(value)
    // Teste Regex para verificar se é uma string formatada válida
    const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value)

    // Se o formato é válido, usa um truque para seguir o fluxo da validação
    // @ts-ignore
    // if (digitsOnly || validFormat) true
    if (!digitsOnly && !validFormat) return false
    // Se não, retorna inválido
    // else return false
  }

  // Guarda um array com todos os dígitos do valor
  const match = value.toString().match(/\d/g)
  const numbers = Array.isArray(match) ? match.map(Number) : []

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false
  
  // Elimina inválidos com todos os dígitos iguais
  // @ts-ignore
  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  // Cálculo validador
  // @ts-ignore
  const calc = (x) => {
    const slice = numbers.slice(0, x)
    let factor = x - 7
    let sum = 0

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i]
      sum += n * factor--
      if (factor < 2) factor = 9
    }

    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12)
  
  // Valida 1o. dígito verificador
  const digit0 = calc(12)
  if (digit0 !== digits[0]) return false

  // Valida 2o. dígito verificador
  const digit1 = calc(13)
  return digit1 === digits[1]
}

export const phoneIsValid = (phone: string) => phoneRegex.test(phone);

export const landlineIsValid = (landline: string) => landlineRegex.test(landline);

export const isNotEmpty = (value: string) => emptyFieldRegex.test(value) && value !== '';

export const isEmpty = (value: string) => !isNotEmpty(value);

export const isZipcodeValid = (value: string) => zipcodeRegex.test(value) && value !== '';

export const isMailValid = (value: string) => mailValidation.test(value) && value !== '';

// export const isCnpjValid = (value: string) => cnpjValidation.test(value) && value !== '';

// @ts-ignore
// export const formatDateISO = (date: string) => `${date.toISOString().split('.')[0]}.000Z`
export const formatDateISO = (date: string) => date.toISOString();

export const getUrl =
  async (image: string) => await fetch(image).then(r => r.blob());

export const isOnSafari =
  navigator.userAgent.includes("Safari");

export const formatUTCToLocale =
  (date: string) => new Date(date).toLocaleDateString("pt-BR")

export const calculateAge = (dateOfBirth: Date) => {
 
  // @ts-ignore
  const formattedDateOfBirth = dateOfBirth.toLocaleDateString('pt-BR');
  
  const [day, month, year] = formattedDateOfBirth.split('/');
  // @ts-ignore
  const [currentDay, currentMonth, currentYear] = new Date().toLocaleDateString('pt-BR').split('/'); // captura a data atual e armazena como string
 
  if (year === currentYear)
    return 0;
  if (+month > +currentMonth)
    return +currentYear - +year - 1;
  if (+month < +currentMonth)
    return +currentYear - +year;
  if (+day > +currentDay)
    return +currentYear - +year - 1;
  if (+day <= +currentDay)
    return +currentYear - +year;

  return 0;
}

export function capitalizeContent(value: string, separator?: string = ' ') {
  if(!value || !isNotEmpty(value)) return value;
  let words = value.split(separator)

  const prepositions = ['de', 'De', 'da', 'Da', 'do', 'Do', 'das', 'dos'];

  function capitalize(word: string) {
    const [i, ...rest] = word.toLowerCase();
    if(!i) console.log('aqui', word)
    
    return !!i ? [i.toUpperCase(), ...rest].join('') : '---';
  }

  return words.map(e => !prepositions.includes(e) ? capitalize(e) : e.toLowerCase()).join(' ')
}

export function capitalizeTags(value: string) {
  const formattedTags = capitalizeContent(value, ',');

  return formattedTags.split(' ').join(',')
}

export function validatePhone(value: string) {
  const formattedValue = value.replaceAll(' ', '').split('').filter(e => !isNaN(+e)).join('');

  if (formattedValue.length !== 11) return value;
  
  const ddd = formattedValue.substring(0, 2);
  const first = formattedValue.substring(2, 7);
  const last = formattedValue.substring(7);

  return `(${ddd}) ${first}-${last}`
}
