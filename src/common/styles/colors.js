export default {
  primary: '#4967FF',
  blue: '#778DFC',
  blue2: '#ADBAFE',
  blue3: '#788DFC',
  black: '#000000',
  black2: '#1F1F22',
  black3: '#2A292E',
  black4: '#04070D',
  black5: '#101010',
  green: '#0EBF9A',
  green2: '#38C08A',
  green3: '#32D5B5',
  green4: '#02D7B1',
  gray: '#B3B3BE',
  gray2: '#B4B4BE',
  gray3: '#36363E',
  gray4: '#585867',
  gray5: '#35353E',
  gray6: '#92929D',
  gray7: '#29292E',
  gray8: '#ABB2C2',
  gray9: '#585868',
  white: '#FFFFFF',
  white2: '#F2F2F7',
  white3: '#d0d6e2',
  yellow: '#FFB300',
  yellow2: '#F0BA31',
  red: '#F05E6F',
  red2: '#FF6868'
}

export function hexToRgb(hex, opacity = 1.0) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `rgba(
        ${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)},
        ${opacity}
      )`
    : null
}
