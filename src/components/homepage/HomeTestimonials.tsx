import React from 'react';
import { View } from 'react-native';

import TextComp from '@/components/TextComp';
import { HOME_TESTIMONIALS } from '@/components/homepage/constants';
import { homeStyles } from '@/styles/homeStyles';

const HomeTestimonials = () => (
    <View>
        <TextComp text="What Shoppers Says" style={homeStyles.sectionTitle} />
        {HOME_TESTIMONIALS.map(item => (
            <View key={item.id} style={homeStyles.testimonialCard}>
                <View style={homeStyles.testimonialHeader}>
                    <View style={homeStyles.testimonialAvatar}>
                        <TextComp text={item.initials} style={homeStyles.testimonialAvatarText} />
                    </View>
                    <View>
                        <TextComp text={item.name} style={homeStyles.testimonialName} />
                        <TextComp text="★★★★★" style={homeStyles.testimonialStars} />
                    </View>
                </View>
                <TextComp text={`"${item.quote}"`} style={homeStyles.testimonialQuote} />
            </View>
        ))}
    </View>
);

export default HomeTestimonials;
