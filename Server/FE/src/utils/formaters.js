export const formatNumber = str => {
  let regExNumberCheck = /([a-zA-Z`~!@#$%^&*()_+=[\]|\\;:'",<>/?]|\..*\.|.-|-?0+\.0{2,}.*)/;
  let regExSpellingCheck = /(\.|,)(\.+|,+)/;
  let regExDecimalCheck = /(\.\d{2})(\d+)/;
  let regExSuperfluousCheck = /^(-?)(0+)(\d+)/;
  let pattern = /(-?\d+)(\d{3})/;

  if (str.toString() === '' || str.toString() === '0' || regExNumberCheck.test(str)) return 0;

  while (regExSpellingCheck.test(str)) str = str.replace(regExSpellingCheck, '$1');

  if (regExDecimalCheck.test(str)) str = str.replace(regExDecimalCheck, '$1');

  if (regExSuperfluousCheck.test(str)) str = str.replace(regExSuperfluousCheck, '$1$3');

  while (pattern.test(str)) str = str.replace(pattern, '$1,$2');

  return str;
}

export const unFormatMoney = str => {
  let signMonetary = /(\p{Sc}|đ)/;

  str = str.replaceAll(',', '');

  while (signMonetary.test(str)) str = str.replace(signMonetary, '');

  return str;
}

export const formatMoney = (str, signMonetary) => {
  if (signMonetary === undefined) signMonetary = 'đ';

  str = formatNumber(str) === 0 ? '0' : formatNumber(str) + signMonetary;

  return str;
}