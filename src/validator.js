import * as yup from 'yup';

const validate = (url, feeds = []) => {
  yup.setLocale({
    mixed: { notOneOf: 'this url already exists' },
    string: {
      url: 'invalid url',
      min: 'url must not be empty',
    },
  });

  const schema = yup.string().min(1).url().notOneOf(feeds);
  return schema.validate(url);
};

export default validate;
