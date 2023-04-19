export const FILTER_TAB = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  RANGE: 'range',
}

export const DEVICES = {
  MOBILE: 'mobile',
  WEB: 'web',
}

export function getRandomWord(sentence) {
  const words = sentence.split(' ')
  return words[Math.floor(Math.random() * words.length)]
}
