import HeaderComp from '@/components/HeaderComp';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { MainStackParamList } from '@/navigation/types';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import styles from './styles';

type QuickLink = {
    id: string;
    title: string;
    subtitle: string;
    icon: 'help' | 'alert';
    onPress: () => void;
};

const TRENDING_ARTICLES = [
    'Booking for large groups',
    'Setting up a professional event',
    'Understanding service quotes',
];

const HelpAndCenter: React.FC = () => {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();

    const quickLinks: QuickLink[] = [
        {
            id: 'faq',
            title: 'FAQs',
            subtitle: 'Quick answers to\ncommon questions',
            icon: 'help',
            onPress: () => navigation.navigate(routes.main.help),
        },
        {
            id: 'support',
            title: 'Support',
            subtitle: 'Contact our team\ndirectly',
            icon: 'alert',
            onPress: () => navigation.navigate(routes.main.support),
        },
    ];

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp
                title="Help Centre"
                leftIcon="backBlack"
                iconColor={Colors.text}
                titleStyle={styles.headerTitle}
            />
            <View style={styles.content}>
                <View style={styles.quickLinksRow}>
                    {quickLinks.map((item) => (
                        <Pressable
                            key={item.id}
                            style={[
                                styles.quickLinkCard,
                                item.id === 'faq' ? styles.faqCard : styles.supportCard,
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.quickLinkIconWrap}>
                                <MyIcons
                                    name={item.icon}
                                    size={moderateScale(20)}
                                    stroke={item.id === 'support' ? Colors.brandSalmon : Colors.text}
                                />
                            </View>
                            <TextComp text={item.title} style={styles.quickLinkTitle} />
                            <TextComp text={item.subtitle} style={styles.quickLinkSubtitle} />
                        </Pressable>
                    ))}
                </View>

                <View style={styles.trendingBlock}>
                    <TextComp text="Trending Articles" style={styles.trendingTitle} />
                    {TRENDING_ARTICLES.map((article) => (
                        <Pressable key={article} style={styles.articleRow}>
                            <TextComp text={article} style={styles.articleText} />
                            <MyIcons name="sideArrow" size={moderateScale(14)} stroke={Colors.gray200} />
                        </Pressable>
                    ))}
                </View>
            </View>
        </WrapperContainer>
    );
};

export default HelpAndCenter;
