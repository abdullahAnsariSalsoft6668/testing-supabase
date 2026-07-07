import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
import MyIcons from './MyIcons';
import LinearGradient from 'react-native-linear-gradient';

interface SearchBarProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFilterPress?: () => void;
    /** When false, only the search input is shown (no filter button). Default true. */
    showFilterButton?: boolean;
    containerStyle?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = "Search..",
    onFilterPress,
    showFilterButton = true,
    containerStyle,
    ...props
}) => {
    return (
        <View style={[styles.searchRow, containerStyle]}>
            <View style={styles.searchContainer}>
                <MyIcons name="search" size={moderateScale(20)} stroke={Colors.gray400} />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={Colors.gray400}
                    style={styles.searchInput}
                    value={value}
                    onChangeText={onChangeText}
                    {...props}
                />
            </View>
            {showFilterButton && (
                <LinearGradient colors={Colors.gradientPrimary as [string, string]} style={styles.filterButton} onPress={onFilterPress}>
                    <MyIcons name="filter" size={moderateScale(20)} stroke={Colors.white} />
                </LinearGradient>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(20),
        gap: moderateScale(10),
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: moderateScale(24),
        paddingHorizontal: moderateScale(16),
        height: moderateScale(48),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: moderateScale(10),
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.text,
    },
    filterButton: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: '#E07A5F', // Muted orange/red
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
});

export default SearchBar;
