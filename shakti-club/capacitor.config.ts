import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sgfshakti.shakticlub',
  appName: 'Shakti Club',
  webDir: 'dist',
  // The dealer app is served from bundled assets; the same build still works
  // as a plain web app (hash routing, no server rewrites needed).
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
