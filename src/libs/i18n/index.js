import { createI18n } from 'vue-i18n';

function loadLocaleMessages() {
  const locales = import.meta.globEager('./languages/*.json');
  const messages = {};
  Object.keys(locales).forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales[key];
    }
  });
  return messages;
}

export const i18n = createI18n({
  legacy: false,
  locale: 'es', // set locale
  fallbackLocale: 'es', // set fallback locale
  messages: loadLocaleMessages()
});
