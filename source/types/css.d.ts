// My css.d.ts file
import 'csstype';

declare module 'csstype' {
    interface Properties {
        '--c-background'?: string;
        '--c-text'?: string;
    }
}
