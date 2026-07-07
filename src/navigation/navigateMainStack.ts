import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import type { MainStackParamList } from './types';

type MainStackScreen = keyof MainStackParamList;

export function navigateMainStack<T extends MainStackScreen>(
    navigation: NavigationProp<ParamListBase>,
    screen: T,
    params?: MainStackParamList[T],
) {
    const currentNames = navigation.getState()?.routeNames ?? [];

    if (currentNames.includes(screen)) {
        navigation.navigate(screen as never, params as never);
        return;
    }

    const parent = navigation.getParent();
    const parentNames = parent?.getState()?.routeNames ?? [];

    if (parent && parentNames.includes(screen)) {
        parent.navigate(screen as never, params as never);
        return;
    }

    (parent ?? navigation).navigate(screen as never, params as never);
}

export function replaceMainStack<T extends MainStackScreen>(
    navigation: NavigationProp<ParamListBase>,
    screen: T,
    params?: MainStackParamList[T],
) {
    const currentNames = navigation.getState()?.routeNames ?? [];

    if (currentNames.includes(screen)) {
        navigation.replace(screen as never, params as never);
        return;
    }

    const parent = navigation.getParent();
    const parentNames = parent?.getState()?.routeNames ?? [];

    if (parent && parentNames.includes(screen)) {
        parent.replace(screen as never, params as never);
        return;
    }

    (parent ?? navigation).replace(screen as never, params as never);
}
