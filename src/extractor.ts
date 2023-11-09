import colors from 'tailwindcss/colors';
import { CSSRuleObject, ThemeConfig } from 'tailwindcss/types/config';

import { ExclusiveThemeVariable, Theme, ThemeVariables } from './';
import { camaelToKebab, getKeyAndValue, hexToRgb } from './utils';

type ThemeFunction = <
  TDefaultValue =
    | Partial<
        ThemeConfig & {
          extend: Partial<ThemeConfig>;
        }
      >
    | undefined
>(
  path?: string | undefined,
  defaultValue?: TDefaultValue | undefined
) => TDefaultValue;

export class Extractor {
  private _themeFn?: ThemeFunction;
  private _theme: Theme;

  private constructor(theme: Theme) {
    this._theme = theme;
  }

  public static create(theme: Theme): Extractor {
    return new Extractor(theme);
  }

  setThemeFunction(themeFn: ThemeFunction): void {
    this._themeFn = themeFn;
  }

  mapColor(themeVariable: ExclusiveThemeVariable | string): string {
    if (typeof themeVariable === 'string') {
      // map hex color
      if (themeVariable.startsWith('#')) {
        return themeVariable;
      }

      // map theme color e.g. colors.indigo.500
      return this._themeFn && this._themeFn(`colors.${themeVariable}`) || themeVariable;
    }

    // map themeVariable
    const { key, value } = getKeyAndValue(themeVariable);

    if(colors[key][value]) {
      return colors[key][value];
    }

    return colors[key as 'white' | 'black'];
  }

  private extract(variables: ThemeVariables): Record<string, string> {
    let extractThemeVariables: Record<string, string>  = {};

    for (const key in variables) {
      let value = variables[key];
      let formattedKey = camaelToKebab(key);

      try {
        let color = this.mapColor(value);
        extractThemeVariables[`--${formattedKey}`] = hexToRgb(color);
      } catch (e) {
        console.log(e);
      }
    }

    return extractThemeVariables;
  }

  private extractVariants(variants: { [key: string]: ThemeVariables }) {
    let extractThemeVariants: Record<string, Record<string, string>> = {};

    for (const variant in variants) {
      // add . to the beginning of the variant if it doesn't exist
      let variantClass = variant.startsWith('.') ? variant : `.${variant}`;

      extractThemeVariants[variantClass] = this.extract(variants[variant]);
    }

    return extractThemeVariants;
  }

  getBase(): CSSRuleObject {
    const { variables, variants } = this._theme;

    return {
      ':root': this.extract(variables),
      ...(variants && this.extractVariants(variants)),
    };
  }
}
