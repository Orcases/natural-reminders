import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import manifest from './src/manifest.json'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      fastRefresh: true,
      babel: {
        babelrc: false,
        configFile: false,
        plugins: [],
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
              development: process.env.NODE_ENV === 'development',
              importSource: 'react'
            }
          ]
        ]
      }
    }),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@natural': resolve(__dirname, './src'),
      '@natural/assets': resolve(__dirname, './src/assets'),
      '@natural/static': resolve(__dirname, './static'),
      
      '@natural/ui': resolve(__dirname, './src/ui'),
      '@natural/layouts': resolve(__dirname, './src/ui/layouts'),
      '@natural/styles': resolve(__dirname, './src/ui/styles'),
      '@natural/components': resolve(__dirname, './src/components'),
      
      '@natural/pages': resolve(__dirname, './src/pages'),
      '@natural/services': resolve(__dirname, './src/services'),
      '@natural/hooks': resolve(__dirname, './src/hooks'),
      '@natural/context': resolve(__dirname, './src/context'),
      
      '@natural/types': resolve(__dirname, './src/types'),
      '@natural/utils': resolve(__dirname, './src/utils'),
      '@natural/constants': resolve(__dirname, './src/constants'),
      
      '@natural/config': resolve(__dirname, './src/config'),
      '@natural/env': resolve(__dirname, './src/env')
    },
  },
  optimizeDeps: {
    include: ['date-fns', 'react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173,
    host: true, // Needed for Docker
    strictPort: true,
    watch: {
      usePolling: true,
    },
    fs: {
      strict: true,
    },
    middlewareMode: false,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'src/pages/Popup/index.html',
        options: 'src/pages/Options/index.html',
        popout: 'src/pages/Popout/index.html',
        standup: 'src/pages/Standup/index.html',
        main: 'index.html'
      },
    },
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});
