const hexToRgb = (hex: string) => // @ts-ignore
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

function rgb2hsv(r: number, g: number, b: number) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
  return [60*(h<0?h+6:h), v&&c/v, v];
}

export function colorFormatting(hex: string) {
  const [r, g, b] = // @ts-ignore
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i ,(m, r, g, b) => '#' + r + r + g + g + b + b)
       .substring(1).match(/.{2}/g)
       .map(x => parseInt(x, 16));

  let v= Math.max(r,g,b), c=v-Math.min(r,g,b);
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c));
  const [finalH, finalS, finalV] = [60*(h<0?h+6:h), v&&c/v, v];

  return {
    hex,
    rgb: { r, g, b },
    hsv: { h: finalH, s: finalS, v: finalV }
  }
}