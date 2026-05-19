import { getTranslations } from 'next-intl/server';

const NotFound = async () => {
  const t = await getTranslations('common');
  return (
    <div style={{ padding: 24 }}>
      <h1>404</h1>
      <p>{t('error')}</p>
    </div>
  );
};

export default NotFound;
