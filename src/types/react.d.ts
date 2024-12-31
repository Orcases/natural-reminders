/// <reference types="react" />

import * as React from 'react';

declare module 'react' {
  export = React;
  export as namespace React;

  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
  }

  export type FC<P = {}> = FunctionComponent<P>;

  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);

  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>,
    initializer?: (arg: React.ReducerState<R>) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useRef<T>(initialValue: T): React.RefObject<T>;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export const StrictMode: React.FC<{ children?: React.ReactNode }>;
}

declare module 'react/jsx-runtime' {
  interface JSXProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  export function jsx(
    type: React.ElementType,
    props: JSXProps,
    key?: React.Key
  ): React.ReactElement;

  export function jsxs(
    type: React.ElementType,
    props: JSXProps,
    key?: React.Key
  ): React.ReactElement;

  export const Fragment: React.ComponentType<{ children?: React.ReactNode }>;
}

declare module 'react-icons/hi2' {
  export const HiXMark: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

declare module 'react-icons/fa' {
  export const FaLeaf: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

declare module 'react-icons/io' {
  export const IoMdArrowDropdown: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

declare module 'react-icons/io5' {
  export const IoNotificationsOutline: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const IoNotificationsOffOutline: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

declare namespace React {
  interface HTMLAttributes<T> {
    style?: React.CSSProperties & {
      '--category-color'?: string;
    };
  }
} 