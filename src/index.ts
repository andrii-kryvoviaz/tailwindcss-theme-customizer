import plugin from 'tailwindcss/plugin';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

import { Extractor } from './extractor';

type ExcludedColorKeys = 'inherit' | 'current' | 'warmGray' | 'trueGray' | 'coolGray' | 'blueGray' | 'lightBlue';

export type AllowedColorKeys = Exclude<
  keyof DefaultColors,
  ExcludedColorKeys
>;

export type AllowedColors = Omit<DefaultColors, ExcludedColorKeys>;

export type ExclusiveThemeVariable = {
  [K in AllowedColorKeys]: Record<K, number> &
    Partial<Record<Exclude<AllowedColorKeys, K>, never>>;
}[AllowedColorKeys];

export type ColorVariants<T> = {
  [P in keyof T]-?: T[P] extends Record<any, any>
    ? 
      {
        [K in keyof T[P]]: `${string & P}.${string & K}`;
      }[keyof T[P]]
    : Exclude<P, ExcludedColorKeys>;
}[keyof T];

export type DefaultColorNames = ColorVariants<AllowedColors>;

export type HexColor = `#${string}`;

export type ThemeVariables = Record<string, ExclusiveThemeVariable | DefaultColorNames | HexColor>;

export type Theme = {
  variables: ThemeVariables;
  variants?: {
    [key: string]: ThemeVariables;
  };
};

export const ThemeCustomizerPlugin = plugin.withOptions((options: Theme) => {
  return ({ addBase, theme }) => {
    const extractor = Extractor.create(options);

    extractor.setThemeFunction(theme);

    addBase(extractor.getBase());
  };
});
