import Toast from 'react-native-toast-message';

/**
 * @param {string} message Primary line (`text1`)
 * @param {object} [options]
 * @param {'success'|'error'|'info'} [options.type='success']
 * @param {string} [options.text2] Secondary line
 * @param {object} [options.props] Custom toast props (`AppToastCustomProps` + arbitrary keys)
 */
export const showToast = (message, options = {}) => {
  const {type = 'success', text2, props} = options;
  Toast.show({
    type,
    text1: message ? message : 'Toast Message',
    ...(text2 != null && text2 !== '' ? {text2: String(text2)} : {}),
    ...(props != null && typeof props === 'object' ? {props} : {}),
  });
};
