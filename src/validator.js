import * as yup from 'yup';

const validate = (i18n, url, feeds = []) => {
  yup.setLocale({
    mixed: { notOneOf: i18n.t('feedback.alreadyExists') },
    string: {
      url: i18n.t('feedback.invalid'),
      min: i18n.t('feedback.shouldNotBeEmpty'),
    },
  });

  const schema = yup.string().min(1).url().notOneOf(feeds);
  return schema.validate(url);
};

export default validate;
