# TailwindCSS Theme Customizer
This is a simple TailwindCSS plugin that allows you to create custom themes for your TailwindCSS project.
In a nutshell, the plugin generates CSS variables based on configuration and allows you to reference them in your TailwindCSS theme.

## Why?
TailwindCSS is a great utility-first CSS framework, but it lacks a way to create custom themes. This plugin aims to solve that problem.
The way TailwindCSS promotes using [CSS Variable](https://tailwindcss.com/docs/customizing-colors#using-css-variables) is not very flexible in terms of working with colors:

```css
/* For rgb(255 115 179 / <alpha-value>) */
--color-primary: 255 115 179;

/* Using theme() function which returns hex, 
    but it's not possible to use alpha value */
--color-primary: theme('colors.indigo.500');
```

The plugin automatically generates CSS variables in the format, which supports alpha as in the first example from above, while mantaing the ability to get type hints.

## Installation
```bash
npm install tailwindcss-theme-customizer
```

## Usage
Add the plugin to your `tailwind.config.ts` file:
```ts

import { ThemeCustomizerPlugin } from 'tailwindcss-theme-customizer';

const defaultTheme: Theme = {
  variables: {
    // Define theme variables as TailwindCSS (supports type hints)
    bgButtonPrimary: {
      blue: 600,
    },
    colorBlack: '#000', // Define color as hex
    colorIndigo: 'indigo.500', // Define color as TailwindCSS color
  },

  // Add custom variants here to override default variables
  // e.g. below will override bgButtonPrimary for dark mode
  variants: {
    dark: {
      bgButtonPrimary: {
        teal: 500,
      },
    },
  },
};

export default {
  // ...
  plugins: [ThemeCustomizerPlugin(defaultTheme)],
} satisfies Config;
```

The above configuration will generate the following CSS variables:
```css
:root {
  --bg-button-primary: 37 99 235;
  --color-black: 0 0 0;
  --color-indigo: 99 102 241;
}

.dark {
  --bg-button-primary: 20 184 166;
}
```

So, now you can use the variables in your TailwindCSS theme:
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-button-primary)',
        black: 'var(--color-black)',
        indigo: 'var(--color-indigo)',
      },
    },
  },
} satisfies Config;
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.