import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bigjump: {
          blue: '#0d47a1',
          red: '#ef5350',
          yellow: '#ffeb3b'
        }
      },
      backgroundImage: {
        'invite-template': "url('/template/convite-base.png')"
      }
    }
  },
  plugins: []
};

export default config;
