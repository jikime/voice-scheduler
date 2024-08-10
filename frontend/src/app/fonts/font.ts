import localFont from 'next/font/local';
import { Inter, Roboto, Noto_Sans_KR, Roboto_Mono } from 'next/font/google';

export const nanumSquareRegular = localFont({
  src: [
    {
      path: './NanumSquareNeoTTF-bRg.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--nanum-square-regular',
});

export const nanumSquareBold = localFont({
  src: [
    {
      path: './NanumSquareNeoTTF-cBd.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
  display: 'swap',
  variable: '--nanum-square-bold',
});

export const nanumSquareLight = localFont({
  src: [
    {
      path: './NanumSquareNeoTTF-aLt.woff2',
      weight: '300',
      style: 'light',
    },
  ],
  display: 'swap',
  variable: '--nanum-square-light',
});

export const nanumBarunGothic = localFont({
  src: [
    {
      path: './NanumBarunGothic.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--nanum-barun-gothic',
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--inter',
});

export const notoSansKr = Noto_Sans_KR({
  preload: false,
  weight: ['100', '400', '700', '900'],
  variable: '--noto-sans-kr',
});

export const roboto = Roboto({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['100', '400', '700'],
  variable: '--roboto',
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--roboto-mono',
  display: 'swap',
});

