/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="chrome" />

declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
    select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
    tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
    tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
    td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
    kbd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
  }
}

declare module 'react' {
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useReducer: typeof React.useReducer;
  export const createContext: typeof React.createContext;
  export const useContext: typeof React.useContext;
  export type FC<P = {}> = React.FC<P>;
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type RefObject<T> = React.RefObject<T>;
  export type Dispatch<A> = React.Dispatch<A>;
  export const StrictMode: typeof React.StrictMode;
}

declare module '@heroicons/react/24/outline';
declare module 'react-icons/io5';
declare module 'react-icons/fa';
declare module 'react-icons/hi2';

declare module 'react-icons/hi2' {
  import { IconType } from 'react-icons';
  export const HiXMark: IconType;
  export const HiPlus: IconType;
  export const HiTrash: IconType;
  export const HiCheck: IconType;
  export const HiSun: IconType;
  export const HiMoon: IconType;
  export const HiCog8Tooth: IconType;
  export const HiChevronDown: IconType;
  export const HiMagnifyingGlass: IconType;
  export const HiKey: IconType;
  export const HiArrowTopRightOnSquare: IconType;
  export const HiHome: IconType;
  export const HiBriefcase: IconType;
  export const HiDocument: IconType;
  export const HiShoppingCart: IconType;
  export const HiHeart: IconType;
  export const HiStar: IconType;
  export const HiBookmark: IconType;
  export const HiCalendar: IconType;
  export const HiGlobeAlt: IconType;
  export const HiLightBulb: IconType;
  export const HiCog: IconType;
  export const HiCodeBracket: IconType;
  export const HiCloud: IconType;
  export const HiBuildingLibrary: IconType;
  export const HiBuildingOffice: IconType;
}

declare module 'react-icons/fa' {
  import { IconType } from 'react-icons';
  export const FaLeaf: IconType;
}

declare module 'react-icons/io' {
  import { IconType } from 'react-icons';
  export const IoNotificationsOutline: IconType;
  export const IoNotificationsOffOutline: IconType;
  export const IoMdArrowDropdown: IconType;
}

declare module 'react-icons' {
  import * as React from 'react';
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
  }

  export type IconType = (props: IconBaseProps) => JSX.Element;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  import React = require('react');
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
}

// Add React JSX support
declare namespace React {
  interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
  
  interface FormEvent<T = Element> {
    currentTarget: T;
    preventDefault(): void;
  }
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
  type Key = string | number;
  
  class Component<P = {}, S = {}> {
    constructor(props: P);
    props: P;
    state: S;
    setState(state: S | ((prevState: S) => S)): void;
    render(): ReactElement | null;
  }

  // Additional React types
  interface Attributes {
    key?: Key;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: LegacyRef<T>;
  }

  type LegacyRef<T> = string | Ref<T>;
  type Ref<T> = RefCallback<T> | RefObject<T> | null;
  type RefCallback<T> = (instance: T | null) => void;
  interface RefObject<T> {
    readonly current: T | null;
  }
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> { }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    type LibraryManagedAttributes<C, P> = C extends React.JSXElementConstructor<infer R> ? R : P;
    interface IntrinsicAttributes extends React.Attributes { }
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react-router-dom' {
  import { ComponentType } from 'react';

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
  }

  export interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
  }

  export interface HashRouterProps {
    basename?: string;
    children?: React.ReactNode;
  }

  export const BrowserRouter: ComponentType<BrowserRouterProps>;
  export const HashRouter: ComponentType<HashRouterProps>;
  export const Routes: ComponentType<{ children?: React.ReactNode }>;
  export const Route: ComponentType<RouteProps>;
  export const Link: ComponentType<{ to: string; children?: React.ReactNode }>;
  export const useNavigate: () => (path: string) => void;
  export const useLocation: () => { pathname: string; search: string; hash: string };
  export const useParams: <T extends { [K in keyof T]: string }>() => T;
}

declare module 'keen-slider/react' {
  import { MutableRefObject } from 'react';

  export interface KeenSliderInstance {
    track: {
      details: {
        abs: number;
      };
    };
    container: HTMLElement;
  }

  export interface KeenSliderHooks {
    created?: (slider: KeenSliderInstance) => void;
    updated?: (slider: KeenSliderInstance) => void;
    slideChanged?: (slider: KeenSliderInstance) => void;
  }

  export interface KeenSliderOptions extends KeenSliderHooks {
    vertical?: boolean;
    selector?: string;
    slides?: {
      perView?: number;
      spacing?: number;
    };
    initial?: number;
    dragSpeed?: number;
    mode?: string;
    rubberband?: boolean;
    wheel?: boolean;
    wheelSpeed?: number;
    loop?: boolean;
  }

  export function useKeenSlider(
    options?: KeenSliderOptions
  ): [MutableRefObject<HTMLDivElement | null>];
} 