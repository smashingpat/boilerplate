// My css.d.ts file
import * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties extends CSS.Properties {
    '--c-background'?: string;
    '--c-text'?: string;
  }
}
