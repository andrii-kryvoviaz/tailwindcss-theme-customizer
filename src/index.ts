import plugin from 'tailwindcss/plugin';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

import { Extractor } from './extractor';

export type AllowedColorKeys = Exclude<
  keyof DefaultColors,
  'inherit' | 'current' | 'transparent' | 'warmGray' | 'trueGray' | 'coolGray' | 'blueGray' | 'lightBlue'
>;

export type ExclusiveThemeVariable = {
  [K in AllowedColorKeys]: Record<K, number> &
    Partial<Record<Exclude<AllowedColorKeys, K>, never>>;
}[AllowedColorKeys];

export type ThemeVariables = Record<string, ExclusiveThemeVariable | string>;

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
