import * as yup from 'yup';

const validate = (url, feeds = []) => {
  const schema = yup.string().required().url().notOneOf(feeds);
  // try {
  //   schema.validateSync(url);
  //   return true;
  // } catch {
  //   return false;
  // }
  return schema.validate(url);
};

export default validate;
