import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { brand } from '@/shared/config';
import { Link } from '@/shared/lib/i18n/navigation';
import { ThemeToggle } from '@/shared/ui';

import styles from './Footer.module.scss';

const NAV_GROUPS = [
  {
    title: 'aboutCompany',
    links: [
      { href: '/about/company', labelKey: 'aboutCompany' },
      { href: '/about/public_offer', labelKey: 'public' },
      { href: '/about/organizations', labelKey: 'organizeshion' },
    ],
  },
  {
    title: 'howBuy',
    links: [
      { href: '/about/howtobuy', labelKey: 'purchaseinstructions' },
      { href: '/about/faq', labelKey: 'questionfooter' },
      { href: '/about/termsconditions', labelKey: 'foydalanishShartlari' },
      { href: '/about/etickets', labelKey: 'etickets' },
    ],
  },
] as const;

export const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <span className={styles.brandName}>{brand.appName}</span>
            <p className={styles.tagline}>{t('title')}</p>

            <div className={styles.socials}>
              {brand.instagram ? (
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Instagram"
                >
                  {}
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              ) : null}
              {brand.telegram ? (
                <a
                  href={brand.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Telegram"
                >
                  <Send size={18} aria-hidden />
                </a>
              ) : null}
              {brand.support ? (
                <a
                  href={brand.support}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Support"
                >
                  <MessageCircle size={18} aria-hidden />
                </a>
              ) : null}
            </div>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.title} className={styles.col}>
              <h3 className={styles.colTitle}>{t(group.title)}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.col}>
            <h3 className={styles.colTitle}>{t('contacts')}</h3>
            <ul className={styles.linkList}>
              {brand.address ? (
                <li className={styles.contactItem}>
                  <MapPin size={16} aria-hidden />
                  <span>{brand.address}</span>
                </li>
              ) : null}
              <li className={styles.contactItem}>
                <Phone size={16} aria-hidden />
                <a href={`tel:${brand.phone.replace(/\s+/g, '')}`} className={styles.link}>
                  {brand.phone}
                </a>
              </li>
              <li className={styles.contactItem}>
                <Mail size={16} aria-hidden />
                <a href={`mailto:${brand.email}`} className={styles.link}>
                  {brand.email}
                </a>
              </li>
            </ul>
            <div className={styles.themeWrapper}>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            &copy; {brand.copyright} {year}
          </span>
        </div>
      </div>
    </footer>
  );
};
