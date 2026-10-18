import { CurrencyCode } from './types';

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

function convertThreeDigitGroup(num: number): string {
  let result = '';
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    result += ONES[hundreds] + ' hundred';
    if (remainder > 0) {
      result += ' and ';
    }
  }

  if (remainder > 0) {
    if (remainder < 20) {
      result += ONES[remainder];
    } else {
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;
      result += TENS[ten];
      if (unit > 0) {
        result += '-' + ONES[unit];
      }
    }
  }

  return result;
}

export function numberToWords(amount: number, currency: CurrencyCode = 'KES'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const wholePart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - wholePart) * 100);

  if (wholePart === 0 && decimalPart === 0) {
    const zeroCurrency = currency === 'KES' ? 'zero shillings only' : `zero ${currency.toLowerCase()} only`;
    return capitalizeFirst(zeroCurrency);
  }

  const units = ['', ' thousand', ' million', ' billion', ' trillion'];
  let temp = wholePart;
  const chunks: string[] = [];
  let unitIndex = 0;

  while (temp > 0 && unitIndex < units.length) {
    const chunk = temp % 1000;
    if (chunk > 0) {
      const chunkStr = convertThreeDigitGroup(chunk);
      chunks.unshift(chunkStr + units[unitIndex]);
    }
    temp = Math.floor(temp / 1000);
    unitIndex++;
  }

  let words = chunks.join(', ');
  if (!words) {
    words = 'zero';
  }

  let currencyUnit = 'shillings';
  let decimalUnit = 'cents';

  if (currency === 'USD') {
    currencyUnit = wholePart === 1 ? 'dollar' : 'dollars';
    decimalUnit = decimalPart === 1 ? 'cent' : 'cents';
  } else if (currency === 'EUR') {
    currencyUnit = wholePart === 1 ? 'euro' : 'euros';
    decimalUnit = decimalPart === 1 ? 'cent' : 'cents';
  } else if (currency === 'GBP') {
    currencyUnit = wholePart === 1 ? 'pound' : 'pounds';
    decimalUnit = decimalPart === 1 ? 'pence' : 'pence';
  }

  let result = `${words} ${currencyUnit}`;

  if (decimalPart > 0) {
    const decWords = convertThreeDigitGroup(decimalPart);
    result += ` and ${decWords} ${decimalUnit}`;
  }

  result += ' only';

  if (isNegative) {
    result = 'negative ' + result;
  }

  return capitalizeFirst(result);
}

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatCurrency(amount: number | undefined | null, currency: CurrencyCode = 'KES'): string {
  const val = Number(amount) || 0;
  const formattedNumber = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

  switch (currency) {
    case 'KES':
      return `KES ${formattedNumber}`;
    case 'USD':
      return `$${formattedNumber}`;
    case 'EUR':
      return `€${formattedNumber}`;
    case 'GBP':
      return `£${formattedNumber}`;
    default:
      return `${currency} ${formattedNumber}`;
  }
}

export function formatDate(dateString: string | Date | undefined, format: 'short' | 'long' | 'standard' = 'standard'): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);

  if (format === 'short') {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (format === 'long') {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  }

  // standard e.g. "17 Oct 2026"
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function generateDocNumber(prefix: string = 'DOC', sequence: number = 1, date: Date = new Date()): string {
  const year = date.getFullYear();
  const seq = String(sequence).padStart(4, '0');
  return `${prefix}-${year}-${seq}`;
}
