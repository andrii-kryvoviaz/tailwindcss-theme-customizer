export const hexToRgb = (hex: string): string => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Expand shorthand hex code (3 digits) to full code (6 digits), if necessary
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Parse the hex color to get the RGB components
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return `${r} ${g} ${b}`;
};

export const camaelToKebab = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export const getKeyAndValue = function (obj: { [key: string]: any }): {
  key: any;
  value: any;
} {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  return { key: keys[0], value: values[0] };
};