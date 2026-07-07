/**
 * Maps friendly options onto RTK Query `fetchBaseQuery` `meta` read by
 * `showGlobalApiToasts` in apiConfig.
 *
 * @param {function} trigger RTK mutation trigger (e.g. `login` from `useLoginMutation`)
 * @param {Record<string, unknown>} body Request fields only (do not put `meta` here)
 * @param {object} [options]
 * @param {boolean} [options.successToast=false] Show global success toast on 2xx
 * @param {boolean} [options.errorToast=true] Show global error toast on failure
 * @param {boolean} [options.showUnauthorizedErrorToast=false] If true, still show error toast on 401/403 (e.g. login)
 * @param {string} [options.successTitle] Toast title when `successToast` is true
 * @param {string} [options.successMessage] Toast subtitle when `successToast` is true (overrides API `message` when set)
 * @param {Record<string, unknown>} [options.meta] Extra `meta` merged last (overrides flags if needed)
 * @param {Record<string, unknown>} [options.meta.toastProps] Merged into custom toast `props` (see `AppToastCustomProps` in `AppToastConfig.tsx`).
 * @returns {Promise<unknown>} Same as `.unwrap()` on the mutation result
 */
export function runApiMutation(trigger, body, options = {}) {
  const {
    successToast = false,
    errorToast = true,
    showUnauthorizedErrorToast = false,
    successTitle,
    successMessage,
    meta: extraMeta = {},
  } = options;

  const meta = {
    skipGlobalErrorToast: !errorToast,
    showGlobalSuccessToast: Boolean(successToast),
    ...(successTitle != null ? {globalSuccessTitle: String(successTitle)} : {}),
    ...(successMessage != null
      ? {globalSuccessMessage: String(successMessage)}
      : {}),
    ...(showUnauthorizedErrorToast ? {showUnauthorizedErrorToast: true} : {}),
    ...extraMeta,
  };

  return trigger({...body, meta}).unwrap();
}
