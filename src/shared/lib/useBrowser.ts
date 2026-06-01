import { useEffect, useState } from 'react';

export interface BrowserInfo {
  name: string;
  isInstagram: boolean;
  isInApp: boolean;
}

const UNKNOWN: BrowserInfo = { name: 'unknown', isInstagram: false, isInApp: false };

const detectBrowser = (ua: string): BrowserInfo => {
  const isInstagram = /instagram/i.test(ua);
  const isInApp =
    isInstagram ||
    /FBAN|FBAV|FB_IAB|Twitter|Line\/|TikTok|musical_ly|Snapchat|VKClient|OKApp|Telegram/i.test(ua);

  let name = 'unknown';
  if (isInstagram) name = 'instagram';
  else if (/FBAN|FBAV|FB_IAB/i.test(ua)) name = 'facebook';
  else if (/Edg\//i.test(ua)) name = 'edge';
  else if (/OPR\/|Opera/i.test(ua)) name = 'opera';
  else if (/SamsungBrowser/i.test(ua)) name = 'samsung';
  else if (/YaBrowser/i.test(ua)) name = 'yandex';
  else if (/Firefox\//i.test(ua)) name = 'firefox';
  else if (/CriOS|Chrome\//i.test(ua)) name = 'chrome';
  else if (/Safari\//i.test(ua)) name = 'safari';

  return { name, isInstagram, isInApp };
};

export const useBrowser = (): BrowserInfo => {
  const [info, setInfo] = useState<BrowserInfo>(UNKNOWN);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      setInfo(detectBrowser(navigator.userAgent));
    }
  }, []);

  return info;
};
