import moment from 'moment';
import {useRef} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {imageServer} from '@/api/configs';
import {showToast} from './toast';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import axios from 'axios';

/**
 * A generic function to make API requests.
 *
 * @param {function} apiCallFunction - The API call function (e.g. `verifyEmail`, `getUserDetails`, etc.)
 * @param {Object} params - The parameters to pass to the API function (e.g., {email, type}).
 * @param {function} [setStep] - Optional: A callback to handle step changes (for multi-step processes).
 * @returns {Promise<any>} - The response from the API call.
 */
export const makeApiCall = async (apiCallFunction, params, setStep) => {
  LOG('params-makeApiCall', params);
  try {
    const response = await apiCallFunction(params).unwrap();
    LOG('API Response MakeApiCall:', response, 'success');
    showToast(response?.message || 'Success', {type: 'success'});
    // For Forgot Pass Flow
    if (setStep) {
      console.log('setStep', setStep);

      setStep(prevStep => prevStep + 1);
    }
    return response;
  } catch (err) {
    LOG('API Error MakeApiCall:', err, 'error');
    showToast(err?.data?.message || 'An error occurred', {type: 'error'});
  }
};

// export const jsonToFormdata = data => {
//   const formData = new FormData();

//   for (let key in data) {
//     const value = data[key];

//     if (value == null) continue;

//     if (Array.isArray(value)) {
//       if (key === 'gallery') {
//         value.forEach(item => {
//           formData.append(key, {
//             uri: item.uri,
//             name: item.name,
//             type: item.type,
//           });
//         });
//       } else if (key === 'variations' || key === 'locations') {
//         // ✅ Send the full array as JSON string for variations
//         formData.append(key, JSON.stringify(value));
//       } else {
//         value.forEach((item, index) => {
//           formData.append(
//             `${key}[${index}]`,
//             typeof item === 'object' ? JSON.stringify(item) : item,
//           );
//         });
//       }
//     } else if (
//       typeof value === 'object' &&
//       value?.uri &&
//       value?.name &&
//       value?.type
//     ) {
//       // It's an image
//       formData.append(key, {
//         uri: value.uri,
//         name: value.name,
//         type: value.type,
//       });
//     } else if (typeof value === 'object') {
//       // Any other object (like `location`)
//       formData.append(key, JSON.stringify(value));
//     } else {
//       formData.append(key, value);
//     }
//   }

//   console.log('FORMDATA: ', formData);
//   return formData;
// };

export const jsonToFormdata = data => {
  const formData = new FormData();

  for (let key in data) {
    const value = data[key];
    if (value == null) continue;

    // === gallery: array of files ===
    if (key === 'gallery' && Array.isArray(value)) {
      value.forEach(item => {
        formData.append(key, {
          uri: item.uri,
          name: item.name,
          type: item.type,
        });
      });

      // === other arrays ===
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(
          `${key}[${index}]`,
          typeof item === 'object' ? JSON.stringify(item) : item,
        );
      });

      // === single file object ===
    } else if (
      typeof value === 'object' &&
      value?.uri &&
      value?.name &&
      value?.type
    ) {
      formData.append(key, {
        uri: value.uri,
        name: value.name,
        type: value.type.startsWith('image/') ? value.type : 'image/jpeg',
      });
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));

      // === primitive value ===
    } else {
      formData.append(key, value);
    }
  }

  console.log('FORMDATA: ', formData);
  return formData;
};

export const formatDate = (timestamp, type) => {
  if (!timestamp) {
    return '';
  }
  return type == 'dmy'
    ? moment(timestamp).format('DD MMM YYYY')
    : moment(timestamp).format('DD MMMM YYYY hh:mm A');
};

export const formatDateShort = timestamp => {
  if (!timestamp) {
    return '';
  }
  return moment(timestamp).format('DD MMM'); // e.g., "12 Nov 2025"
};
export const formatDateYear = timestamp => {
  if (!timestamp) {
    return '';
  }
  return moment(timestamp).format('DD MMM YYYY'); // e.g., "12 Nov 2025"
};

export const timeAgo = date => {
  const now = new Date();
  const diff = now - new Date(date); // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const formattedTime = createdAt => moment(createdAt).format('hh:mm A');

// Define a constant for logging tag to maintain consistency
const TAG = '__API__';

/**
 * A generic function to log messages in development mode.
 *
 * @param {String} label - The label to describe the log message (e.g., "API Response", "Error").
 * @param {Object} data - The data to log (e.g., the response object, error object).
 * @param {String} [type='success'] - The log type; can be 'success' (default), 'error', or 'info'.
 */
export const LOG = (label, data, type = 'success') => {
  if (__DEV__) {
    const formattedData =
      typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

    switch (type) {
      case 'error':
        console.log(`${TAG}❎__${label}__ :\n`, formattedData);
        break;
      case 'info':
        console.log(`${TAG}ℹ️__${label}__ :\n`, formattedData);
        break;
      case 'success':
      default:
        console.log(`${TAG}✅__${label}__ :\n`, formattedData);
        break;
    }
  }
};

/**
 * Debounce function that delays the execution of a given function.
 * @param {Function} func - The function to be debounced.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - A debounced version of the input function.
 */
export const useDebounce = (func, delay) => {
  const timeoutRef = useRef(null);

  const debouncedFunction = (...args) => {
    // Clear the previous timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to invoke the function after the delay
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debouncedFunction;
};

export const extractFileName = path => {
  return path.substring(path.lastIndexOf('/') + 1);
};

export const checkNetworkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected; // Returns true if connected, false if not
};

/**
 * Get Full Name
 *
 * Purpose:
 * Combines first name and last name into a full name string.
 * If either firstName or lastName is missing or empty, it handles gracefully.
 *
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @returns {string} - The full name (firstName + lastName) trimmed properly.
 */
export const getFullName = (firstName = '', lastName = '') => {
  return `${firstName} ${lastName}`.trim();
};

const DUMMY_REMOTE_IMAGE = {
  uri: 'https://dummyimage.com/600x400/cccccc/000000.jpg',
};

/**
 * Generates the final image source:
 * - If it's a local image (positive finite number from `require()`), return that number.
 * - If URI is a non-empty string, build the full dynamic URL or pass through http(s).
 * - For `undefined`, `null`, empty/whitespace string, invalid number, or any other type → dummy URL.
 *
 * @param {string|number|undefined|null} uri - Image URI or local asset id.
 * @returns {{uri: string}|number}
 */
export const getImageUrl = uri => {
  if (uri == null || uri === '') {
    return DUMMY_REMOTE_IMAGE;
  }

  if (typeof uri === 'number') {
    if (!Number.isFinite(uri) || uri <= 0) {
      return DUMMY_REMOTE_IMAGE;
    }
    return uri;
  }

  if (typeof uri === 'string') {
    const t = uri.trim();
    if (!t) {
      return DUMMY_REMOTE_IMAGE;
    }
    let finalUrl = '';
    if (t.startsWith('http')) {
      finalUrl = t;
    } else {
      finalUrl = `${imageServer}${t.startsWith('/') ? t : `${t}`}`;
    }
    return {uri: finalUrl};
  }

  return DUMMY_REMOTE_IMAGE;
};
export const normalizeGallery = gallery => {
  if (!gallery || !Array.isArray(gallery)) return [];
  return gallery.map((item, index) => {
    if (typeof item === 'string') {
      const uri =
        item.startsWith('http') || item.startsWith('file://')
          ? item
          : `${imageServer}${item}`;
      return {
        uri,
        type: 'image/jpeg',
        name: `image${index}.jpg`,
      };
    }
    return item; // Already in { uri, type, name } format
  });
};

// export const getCurrentLocation = () => {
//   return new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       position => {
//         resolve(position.coords);
//       },
//       error => reject(error),
//       // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
//       {
//         enableHighAccuracy: true,
//         timeout: 30000,
//         maximumAge: 1000,
//       },
//     );
//   });
// };

// // export const getCurrentLocationName = async (latitude, longitude) => {
// //   try {
// //     const response = await axios.get(
// //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleapikey}`,
// //     );
// //     if (response.data.results.length > 0) {
// //       console.log(
// //         'response.data.results[0].formatted_address',
// //         response.data.results[0]?.formatted_address,
// //       );
// //       const address = response.data.results[0].formatted_address;
// //       // autoCompleteRef.current?.setAddressText(address);
// //       return address;
// //     }
// //   } catch (error) {
// //     console.error('Error fetching location name:', error);
// //   }
// // };

// export const requestLocationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'This app needs access to your location.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (error) {
//       console.warn(error);
//       return false;
//     }
//   }
//   return true; // iOS permissions are handled in Info.plist
// };
// export const getAddressFromCoordinates = async (latitude, longitude) => {
//   try {
//     const response = await axios.post(
//       'https://www.googleapis.com/geolocation/v1/geolocate',
//       {
//         considerIp: 'true',
//         wifiAccessPoints: [], // Add Wi-Fi access points if available
//         cellTowers: [], // Add cell tower information if available
//         key: 'AIzaSyBXqV9bSEkfm5Wh7OQMj37V-n3F4AiyE40',
//       },
//     );
//     return response.data.location;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const getLastNCharacters = (str, len) => {
  return str.slice(-len);
};

export const capitalizeWords = str => {
  return str
    ?.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const openUrlInBrowser = url => {
  if (!url) return;

  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

  Linking.openURL(formattedUrl).catch(err =>
    console.error('Failed to open URL:', err),
  );
};
