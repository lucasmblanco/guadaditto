import translations from "./translations";

export const locale = $state({ lang: "en" });
export const locales = Object.keys(translations);

function translate(locale, key, vars) {
  if (!key) throw new Error("no key provided to $t()");
  if (!locale.lang) throw new Error(`no translation for key "${key}"`);

  let text = translations[locale.lang]?.[key];

  if (!text) throw new Error(`no translation found for ${locale.lang}.${key}`);

  Object.keys(vars).forEach((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return text;
}

export function t(key, vars = {}) {
  return translate(locale, key, vars);
}
