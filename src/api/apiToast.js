import Toast from 'react-native-toast-message';

/**
 * Normalizes RTK Query / fetchBaseQuery `args` (string URL or object).
 * @param {string | object | undefined} args
 */
export function normalizeFetchArgs(args) {
  if (typeof args === 'string') {
    return { url: args };
  }
  return args && typeof args === 'object' ? args : {};
}

function messageFromUnknown(m) {
  if (m == null) {
    return null;
  }
  if (Array.isArray(m)) {
    return m.map(String).join(', ');
  }
  if (typeof m === 'string' || typeof m === 'number') {
    return String(m);
  }
  return null;
}

function pickMessageFromObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  const direct = messageFromUnknown(obj.message);
  if (direct) {
    return direct;
  }
  if (obj.data != null && typeof obj.data === 'object') {
    const nested = messageFromUnknown(obj.data.message);
    if (nested) {
      return nested;
    }
  }
  if (obj.error != null) {
    if (typeof obj.error === 'string') {
      return obj.error;
    }
    if (typeof obj.error === 'object') {
      return pickMessageFromObject(obj.error);
    }
  }
  return null;
}

/**
 * Human-readable message from RTK Query SerializedError-style object.
 * @param {{ status?: unknown, data?: unknown, error?: string }} error
 */
export function getApiErrorMessage(error) {
  if (!error) {
    return 'Something went wrong';
  }
  const { data, status, error: errField } = error;

  if (status === 'FETCH_ERROR') {
    return 'Network request failed';
  }
  if (status === 'PARSING_ERROR') {
    return 'Invalid response from server';
  }
  if (status === 'NO_INTERNET' && data && typeof data === 'object' && data.message) {
    return String(data.message);
  }

  if (data != null && typeof data === 'object') {
    const fromData = pickMessageFromObject(data);
    if (fromData) {
      return fromData;
    }
  }
  if (typeof data === 'string' && data.length) {
    return data;
  }
  if (typeof errField === 'string' && errField.length) {
    return errField;
  }
  return 'Something went wrong';
}

/**
 * Global toasts for RTK Query `fetchBaseQuery` results.
 * - Errors: shown unless skipped by meta. 401/403 are skipped by default (logout flow);
 *   set `meta.showUnauthorizedErrorToast` for calls like login where the body message should show.
 * - Success: only when `meta.showGlobalSuccessToast` is true (avoid toasting every GET).
 *
 * @param {*} result Return value from fetchBaseQuery
 * @param {string | object} args Same args passed to baseQuery
 * @param {object} [args.meta.toastProps] Merged into custom toast `props` (see `AppToastCustomProps`).
 */
export function showGlobalApiToasts(result, args) {
  const meta = normalizeFetchArgs(args).meta || {};
  const toastPropExtras =
    meta.toastProps != null && typeof meta.toastProps === 'object' ? meta.toastProps : {};

  if (result?.error) {
    if (meta.skipGlobalErrorToast) {
      return;
    }
    const status = result.error.status;
    if (
      (status === 401 || status === 403) &&
      !meta.showUnauthorizedErrorToast
    ) {
      return;
    }
    const text2 = getApiErrorMessage(result.error);
    Toast.show({
      type: 'error',
      text1: text2 || 'Something went wrong',
      props: {
        leadingIcon: 'error',
        source: 'api',
        ...toastPropExtras,
      },
    });
    return;
  }

  if (result?.data != null && meta.showGlobalSuccessToast) {
    const text2 =
      meta.globalSuccessMessage != null
        ? String(meta.globalSuccessMessage)
        : typeof result.data === 'object' && result.data != null && result.data.message != null
          ? String(result.data.message)
          : 'Success';
    Toast.show({
      type: 'success',
      text1: meta.globalSuccessTitle != null ? String(meta.globalSuccessTitle) : 'Success',
      text2,
      props: {
        leadingIcon: 'success',
        source: 'api',
        ...toastPropExtras,
      },
    });
  }
}
