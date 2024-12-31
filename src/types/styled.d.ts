import 'styled-components';
import { Theme } from '@natural/styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 