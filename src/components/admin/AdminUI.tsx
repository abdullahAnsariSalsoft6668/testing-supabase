import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

type AdminAddButtonProps = { label?: string; onPress: () => void };
export const AdminAddButton: React.FC<AdminAddButtonProps> = ({ label = 'Add', onPress }) => (
    <Pressable style={s.headerAddBtn} onPress={onPress}>
        <TextComp text="+" style={[s.headerAddBtnText, { fontSize: 16, lineHeight: 18 }]} />
        <TextComp text={label} style={s.headerAddBtnText} />
    </Pressable>
);

type AdminStatsBarProps = { items: { value: number | string; label: string }[] };
export const AdminStatsBar: React.FC<AdminStatsBarProps> = ({ items }) => (
    <View style={s.statsBar}>
        {items.map((item, i) => (
            <View key={item.label} style={[s.statItem, i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.colors.border.default }]}>
                <TextComp text={String(item.value)} style={s.statValue} />
                <TextComp text={item.label} style={s.statLabel} />
            </View>
        ))}
    </View>
);

type AdminInfoRowProps = {
    icon: IconName;
    label: string;
    value?: string | null;
    iconColor?: string;
};
export const AdminInfoRow: React.FC<AdminInfoRowProps> = ({
    icon,
    label,
    value,
    iconColor = theme.palette.teal.main,
}) => {
    if (!value) return null;
    return (
        <View style={s.infoRow}>
            <View style={s.infoIconWrap}>
                <MyIcons name={icon} size={16} stroke={iconColor} />
            </View>
            <View style={s.infoContent}>
                <TextComp text={label} style={s.infoLabel} />
                <TextComp text={value} style={s.infoValue} />
            </View>
        </View>
    );
};

type AdminFilterTabsProps<T extends string> = {
    tabs: { key: T; label: string; icon?: IconName }[];
    active: T;
    onChange: (key: T) => void;
};
export function AdminFilterTabs<T extends string>({ tabs, active, onChange }: AdminFilterTabsProps<T>) {
    return (
        <View style={s.filterRow}>
            {tabs.map((tab) => {
                const isActive = active === tab.key;
                return (
                    <Pressable
                        key={tab.key}
                        style={[s.filterTab, isActive && s.filterTabActive]}
                        onPress={() => onChange(tab.key)}
                    >
                        {tab.icon ? (
                            <MyIcons
                                name={tab.icon}
                                size={14}
                                stroke={isActive ? theme.palette.teal.main : 'rgba(255,255,255,0.85)'}
                            />
                        ) : null}
                        <TextComp text={tab.label} style={[s.filterTabText, isActive && s.filterTabTextActive]} />
                    </Pressable>
                );
            })}
        </View>
    );
}

type AdminFilterChipsProps<T extends string> = {
    tabs: {
        key: T;
        label: string;
        icon?: IconName;
        accent?: string;
        surface?: string;
        useFill?: boolean;
    }[];
    active: T;
    onChange: (key: T) => void;
};

export function AdminFilterChips<T extends string>({ tabs, active, onChange }: AdminFilterChipsProps<T>) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={chipStyles.row}
        >
            {tabs.map((tab) => {
                const isActive = active === tab.key;
                const accent = tab.accent ?? theme.palette.teal.main;
                const surface = tab.surface ?? theme.palette.teal.surface;

                return (
                    <Pressable
                        key={tab.key}
                        style={[chipStyles.chip, isActive && chipStyles.chipActive, isActive && { borderColor: accent + '55', backgroundColor: surface }]}
                        onPress={() => onChange(tab.key)}
                    >
                        {tab.icon ? (
                            <View style={[chipStyles.iconWrap, { backgroundColor: isActive ? accent + '18' : theme.colors.background.secondary }]}>
                                <MyIcons
                                    name={tab.icon}
                                    size={14}
                                    stroke={accent}
                                    fill={tab.useFill ? accent : 'none'}
                                />
                            </View>
                        ) : null}
                        <TextComp text={tab.label} style={[chipStyles.chipText, isActive && { color: accent, fontWeight: '700' }]} />
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const chipStyles = {
    row: {
        gap: moderateScale(8),
        paddingVertical: moderateScale(2),
    },
    chip: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: moderateScale(8),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(20),
        backgroundColor: theme.colors.card.background,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    chipActive: {},
    iconWrap: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(8),
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    chipText: {
        fontSize: moderateScale(12),
        fontWeight: '600' as const,
        color: theme.colors.text.secondary,
    },
};

type QuickActionProps = {
    icon: IconName;
    label: string;
    onPress: () => void;
    accent?: string;
    surface?: string;
};
export const AdminQuickAction: React.FC<QuickActionProps> = ({
    icon,
    label,
    onPress,
    accent = theme.palette.teal.main,
    surface = theme.palette.teal.surface,
}) => (
    <Pressable style={[s.card, { marginBottom: 0, flex: 1, alignItems: 'center', padding: 16 }]} onPress={onPress}>
        <View style={[s.iconBadge, { backgroundColor: surface, width: 44, height: 44, borderRadius: 12 }]}>
            <MyIcons name={icon} size={20} stroke={accent} />
        </View>
        <TextComp text={label} style={{ fontSize: 11, fontWeight: '600', color: theme.colors.text.primary, marginTop: 8, textAlign: 'center' }} />
    </Pressable>
);
