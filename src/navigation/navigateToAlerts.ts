import routes from '@/constants/routes';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export const navigateToAlertsTab = (navigation: NavigationProp<ParamListBase>) => {
    navigation.navigate(routes.navigator.tab as never, {
        screen: routes.tab.insights,
    } as never);
};
