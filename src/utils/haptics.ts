import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const OPTIONS = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

export function hapticLight() {
    ReactNativeHapticFeedback.trigger('impactLight', OPTIONS);
}

export function hapticMedium() {
    ReactNativeHapticFeedback.trigger('impactMedium', OPTIONS);
}

export function hapticSelection() {
    ReactNativeHapticFeedback.trigger('selection', OPTIONS);
}

export function hapticSuccess() {
    ReactNativeHapticFeedback.trigger('notificationSuccess', OPTIONS);
}

export function hapticError() {
    ReactNativeHapticFeedback.trigger('notificationError', OPTIONS);
}
