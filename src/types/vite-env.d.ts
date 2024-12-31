/// <reference types="vite/client" />

declare module 'vite' {
  export interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    optimizeDeps?: {
      include?: string[];
    };
    server?: {
      port?: number;
      host?: boolean | string;
      strictPort?: boolean;
      watch?: {
        usePolling?: boolean;
      };
      fs?: {
        strict?: boolean;
      };
      middlewareMode?: boolean;
    };
    preview?: {
      port?: number;
      strictPort?: boolean;
    };
    build?: {
      rollupOptions?: {
        input?: Record<string, string>;
      };
      outDir?: string;
      assetsDir?: string;
      emptyOutDir?: boolean;
    };
  }

  export function defineConfig(config: UserConfig): UserConfig;
}

declare module '@vitejs/plugin-react' {
  import { UserConfig } from 'vite';
  export default function react(options?: {
    jsxRuntime?: 'classic' | 'automatic';
    jsxImportSource?: string;
    fastRefresh?: boolean;
    babel?: {
      babelrc?: boolean;
      configFile?: boolean;
      plugins?: any[];
      presets?: any[];
    };
  }): { name: string; config?: (config: UserConfig) => Partial<UserConfig> };
}

declare module '@crxjs/vite-plugin' {
  import { UserConfig } from 'vite';
  export function crx(options: { manifest: any }): {
    name: string;
    config?: (config: UserConfig) => Partial<UserConfig>;
  };
} 