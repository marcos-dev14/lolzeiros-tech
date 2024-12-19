import 'styled-components';
import theme from './theme';

declare module 'styled-components' {
  type ThemeType = typeof theme;

  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      icon: string;
      green: string;
      dark_green: string;
      text: string;
      white: string;
      gray: string;
      medium_gray: string;
      placeholder: string;
      disabledBg: string;
      validatedBorder: string;
      invalidatedBadge: string;
    };
  }
}