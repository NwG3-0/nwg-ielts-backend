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

export function generateRedeemCode() {
  let redeemCode = ''
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      redeemCode += String.fromCharCode(Math.floor(Math.random() * 26) + 65) // generates random uppercase letter
    }
    if (i < 3) {
      redeemCode += '-'
    }
  }
  return redeemCode
}
