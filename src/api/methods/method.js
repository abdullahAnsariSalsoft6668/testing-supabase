import {jsonToFormdata, LOG} from '@/utils/helperFunction';
import {showToast} from '@/utils/toast';

// export const executeApiRequest = async ({
//   apiCallFunction, // The RTK Query mutation/query function
//   body = null, // Request body
//   params = null, // Additional params (e.g., id)
//   queryParams = {}, // Query string parameters
//   formData = false, // Flag for FormData requests
//   toast = true, // Control toast notifications
//   setStep = null, // Step increment function
//   timeout = 30000, // Request timeout in milliseconds
// }) => {
//   LOG('executeApiRequest - Input-aye:', {body, params, queryParams});

//   try {
//     // Prepare the request payload
//     let requestPayload = {};

//     // Handle body and formData
//     if (body) {
//       if (formData) {
//         requestPayload = jsonToFormdata(body); // Convert body to FormData
//       } else {
//         requestPayload = {...body}; // Use body as JSON
//       }
//     }

//     // Merge params into payload (excluding id for RTK Query structure)
//     if (params && params.id) {
//       const {id, ...otherParams} = params; // Extract id separately
//       console.log('iddd', id);
//       console.log('paramsparams', params);

//       if (formData && requestPayload instanceof FormData) {
//         Object.entries(otherParams).forEach(([key, value]) => {
//           requestPayload.append(key, value);
//         });
//       } else {
//         requestPayload = {...requestPayload, ...otherParams};
//       }
//       // Structure for RTK Query mutation expecting { id, body }
//       const apiParams = {
//         id,
//         body: requestPayload,
//         ...otherParams,
//       };

//       LOG('Request payload for RTK Query:', apiParams);

//       // Setup timeout
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(() => reject(new Error('Request timeout')), timeout),
//       );

//       // Execute API call
//       const response = await Promise.race([
//         apiCallFunction(apiParams).unwrap(),
//         timeoutPromise,
//       ]);

//       LOG('API Response executeApiRequest:', response, 'success');

//       if (toast) {
//         showToast(response?.message || 'Success');
//       }

//       if (setStep) {
//         LOG('setStep triggered', setStep);
//         setStep(prevStep => prevStep + 1);
//       }

//       return Promise.resolve(response);
//     } else {
//       // If no id, use requestPayload directly (for queries or mutations without id)
//       LOG('Request payload (no id):', requestPayload);

//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(() => reject(new Error('Request timeout')), timeout),
//       );

//       const response = await Promise.race([
//         apiCallFunction(requestPayload).unwrap(),
//         timeoutPromise,
//       ]);

//       LOG('API Response executeApiRequest:', response, 'success');

//       if (toast) {
//         showToast(response?.message || 'Success');
//       }

//       if (setStep) {
//         LOG('setStep triggered', setStep);
//         setStep(prevStep => prevStep + 1);
//       }

//       return Promise.resolve(response);
//     }
//   } catch (err) {
//     LOG('API Error executeApiRequest:', err, 'error');

//     const errorMessage =
//       err?.data?.message || err?.message || 'An error occurred';
//     const errorStatus = err?.status || null;

//     if (toast) {
//       showToast(errorMessage);
//     }

//     return Promise.reject({
//       message: errorMessage,
//       status: errorStatus,
//       data: err?.data || null,
//       originalError: err,
//     });
//   }
// };

// This for queryParams

export const executeApiRequest = async ({
  apiCallFunction,
  body = null,
  params = null,
  queryParams = {},
  formData = false,
  toast = true,
  setStep = null,
}) => {
  LOG('executeApiRequest - Input:', {body, params, queryParams});

  try {
    let requestPayload = {};

    // Prepare body
    if (body) {
      requestPayload = formData ? jsonToFormdata(body) : {...body};
    }

    // If we have params with ID (like update)
    if (params && params.id) {
      const {id, ...otherParams} = params;

      // Add remaining params to body/FormData
      if (formData && requestPayload instanceof FormData) {
        Object.entries(otherParams).forEach(([key, value]) => {
          requestPayload.append(key, value);
        });
      } else {
        requestPayload = {...requestPayload, ...otherParams};
      }

      const apiParams = {id, body: requestPayload};

      LOG('RTK payload (with id):', apiParams);

      const response = await apiCallFunction(apiParams).unwrap();

      LOG('API Response executeApiRequest:', response, 'success');

      if (toast) showToast(response?.message || 'Success');
      if (setStep) setStep(prev => prev + 1);

      return response;
    }

    // No ID case (normal add/create)
    LOG('RTK payload (no id):', requestPayload);

    const response = await apiCallFunction(requestPayload).unwrap();

    LOG('API Response executeApiRequest:', response, 'success');

    if (toast) showToast(response?.message || 'Success');
    if (setStep) setStep(prev => prev + 1);

    return response;
  } catch (err) {
    LOG('API Error executeApiRequest:', err, 'error');

    const errorMessage =
      err?.data?.message || err?.message || 'An error occurred';

    // Error UI: global toast from apiConfig (showGlobalApiToasts); avoid duplicate here.

    throw {
      message: errorMessage,
      status: err?.status || null,
      data: err?.data || null,
      originalError: err,
    };
  }
};

export const executeApiRequestForQueryParams = async ({
  apiCallFunction, // The RTK Query mutation/query function
  body = null, // Request body (JSON or FormData)
  id = null, // Resource ID (e.g., for URL or RTK Query structure)
  queryParams = {}, // Query string parameters (e.g., { filter: 'value' })
  otherParams = {}, // Additional parameters (excluding id)
  formData = false, // Flag for FormData requests
  toast = true, // Control toast notifications
  setStep = null, // Step increment function
  timeout = 30000, // Request timeout in milliseconds
}) => {
  LOG('executeApiRequest - Input:', {body, id, queryParams, otherParams});

  try {
    // Prepare the request payload
    let requestPayload = {};

    // Handle body and formData
    if (body) {
      if (formData) {
        requestPayload = jsonToFormdata(body); // Convert body to FormData
      } else {
        requestPayload = {...body}; // Use body as JSON
      }
    }

    // Merge otherParams into payload (if any)
    if (Object.keys(otherParams).length > 0) {
      if (formData && requestPayload instanceof FormData) {
        Object.entries(otherParams).forEach(([key, value]) => {
          requestPayload.append(key, value);
        });
      } else {
        requestPayload = {...requestPayload, ...otherParams};
      }
    }

    // Structure for RTK Query
    const apiParams = {
      ...(id && {id}), // Include id if provided
      ...(Object.keys(requestPayload).length > 0 && {body: requestPayload}), // Include body if non-empty
      ...queryParams, // Include queryParams for URL query string
    };

    LOG('Request payload for RTK Query:', apiParams);

    // Setup timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout),
    );

    // Execute API call with queryParams handled separately
    const response = await Promise.race([
      apiCallFunction({
        ...apiParams,
        ...(Object.keys(queryParams).length > 0 && {queryParams}), // Pass queryParams explicitly
      }).unwrap(),
      timeoutPromise,
    ]);

    LOG('API Response executeApiRequest:', response, 'success');

    if (toast) {
      showToast(response?.message || 'Success');
    }

    if (setStep) {
      LOG('setStep triggered', setStep);
      setStep(prevStep => prevStep + 1);
    }

    return Promise.resolve(response);
  } catch (err) {
    LOG('API Error executeApiRequest:', err, 'error');

    const errorMessage =
      err?.data?.message || err?.message || 'An error occurred';
    const errorStatus = err?.status || null;

    // Error UI: global toast from apiConfig (showGlobalApiToasts); avoid duplicate here.

    return Promise.reject({
      message: errorMessage,
      status: errorStatus,
      data: err?.data || null,
      originalError: err,
    });
  }
};
