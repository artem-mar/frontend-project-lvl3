import * as yup from 'yup';

const validate = (i18n, url, feeds = []) => {
  yup.setLocale({
    mixed: { notOneOf: i18n.t('feedback.alreadyExists') },
    string: { url: i18n.t('feedback.invalid') },
  });

  const schema = yup.string().required().url().notOneOf(feeds);
  return schema.validate(url);
};

export default validate;
