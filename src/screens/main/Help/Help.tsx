import FAQItem from '@/components/FAQItem';
import HeaderComp from '@/components/HeaderComp';
import WrapperContainer from '@/components/WrapperContainer';
import { Colors } from '@/styles/colors';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import styles from './styles';


interface FAQEntry {
    id: string;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQEntry[] = [
    {
        id: '1',
        question: 'What can I do in this app?',
        answer:
            'You can discover event talents, send quote requests, compare offers, save favorites, and manage your bookings in one place.',
    },
    {
        id: '2',
        question: 'How do I request a quote from a talent?',
        answer:
            'Open a provider profile from Explore or Favorites and tap Request Quote. Add your event details, then submit to receive responses.',
    },
    {
        id: '3',
        question: 'How does Compare Quotes work?',
        answer:
            'When multiple providers respond, you can review pricing and messages side by side in Compare Quotes before accepting one.',
    },
    {
        id: '4',
        question: 'Can I save providers for later?',
        answer:
            'Yes. Tap the heart icon on provider cards to add them to Favorites, then quickly filter or search them later.',
    },
    {
        id: '5',
        question: 'What should I do if I need help with a booking?',
        answer:
            'Go to Contact Support from Home and share your subject and message. Our team will review and respond as soon as possible.',
    },
];

const Help: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(FAQ_DATA[0]?.id ?? null);

    const handleToggle = useCallback((id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    }, []);


 

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp
                title="FAQs"
                showBack={true}
                leftIcon="backBlack"
                iconColor={Colors.brandPurple}
                titleStyle={styles.headerTitle}
            />
            <View style={styles.content}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                >
                    {FAQ_DATA.map((item) => (
                            <FAQItem
                                question={item.question}
                                answer={item.answer}
                                isExpanded={expandedId === item.id}
                                onPress={() => handleToggle(item.id)}
                            />
                    ))}
                </ScrollView>
            </View>
        </WrapperContainer>
    );
};

export default React.memo(Help);
