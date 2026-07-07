import React, { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

export type MarkedDates = Record<string, { selected?: boolean; selectedColor?: string; selectedTextColor?: string; startingDay?: boolean; endingDay?: boolean; color?: string; textColor?: string; dotColor?: string; [key: string]: unknown }>;

/** Matches react-native-calendars MarkingTypes */
export type MarkingType = 'dot' | 'multi-dot' | 'period' | 'multi-period' | 'custom';

/** Colors for period/range marking - match app design */
export const calendarRangeColors = {
    rangeFill: '#FFEBE9',
    startEndCircle: Colors.secondary,
    startEndText: Colors.white,
    rangeText: Colors.text,
} as const;

/**
 * Build markedDates for a start–end range (period marking).
 * Start and end days get the accent circle; days in between get the light fill.
 */
export function getMarkedDatesForRange(
    rangeStart: string | null,
    rangeEnd: string | null
): MarkedDates {
    if (!rangeStart) return {};

    const start = new Date(rangeStart);
    const end = rangeEnd ? new Date(rangeEnd) : start;
    const min = start <= end ? start : end;
    const max = start <= end ? end : start;
    const minStr = min.toISOString().slice(0, 10);
    const maxStr = max.toISOString().slice(0, 10);

    const marked: MarkedDates = {};
    for (let d = new Date(min); d <= max; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        const isStart = key === minStr;
        const isEnd = key === maxStr;
        marked[key] = {
            startingDay: isStart,
            endingDay: isEnd,
            color: isStart || isEnd ? calendarRangeColors.startEndCircle : calendarRangeColors.rangeFill,
            textColor: isStart || isEnd ? calendarRangeColors.startEndText : calendarRangeColors.rangeText,
        };
    }
    return marked;
}

type CalendarTheme = {
    backgroundColor?: string;
    calendarBackground?: string;
    textSectionTitleColor?: string;
    textSectionTitleDisabledColor?: string;
    selectedDayBackgroundColor?: string;
    selectedDayTextColor?: string;
    todayTextColor?: string;
    dayTextColor?: string;
    textDisabledColor?: string;
    dotColor?: string;
    selectedDotColor?: string;
    arrowColor?: string;
    monthTextColor?: string;
    textDayFontFamily?: string;
    textMonthFontFamily?: string;
    textDayHeaderFontFamily?: string;
    textDayFontSize?: number;
    textMonthFontSize?: number;
    textDayHeaderFontSize?: number;
};

const defaultTheme: CalendarTheme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: Colors.gray400,
    textSectionTitleDisabledColor: Colors.gray200,
    selectedDayBackgroundColor: Colors.secondary,
    selectedDayTextColor: Colors.white,
    todayTextColor: Colors.brandPurple,
    dayTextColor: Colors.text,
    textDisabledColor: Colors.gray200,
    dotColor: Colors.secondary,
    selectedDotColor: Colors.white,
    arrowColor: Colors.text,
    monthTextColor: Colors.text,
    textDayFontFamily: fontFamily.regular,
    textMonthFontFamily: fontFamily.bold,
    textDayHeaderFontFamily: fontFamily.regular,
    textDayFontSize: moderateScale(14),
    textMonthFontSize: moderateScale(16),
    textDayHeaderFontSize: moderateScale(12),
};

export interface CalendarCompProps {
    /** Currently visible month (YYYY-MM) */
    current?: string;
    /** Initial/controlled selected date (YYYY-MM-DD) */
    selected?: string;
    /** Marked dates - see react-native-calendars markedDates */
    markedDates?: MarkedDates;
    /** 'dot' | 'period' | 'multi-dot' | 'multi-period' | 'custom' */
    markingType?: MarkingType;
    /** 0 = Sunday, 1 = Monday */
    firstDay?: number;
    /** Allow swipe between months */
    enableSwipeMonths?: boolean;
    /** Hide days from adjacent months */
    hideExtraDays?: boolean;
    /** Called when a day is pressed */
    onDayPress?: (day: DateData) => void;
    /** Called when the visible month changes */
    onMonthChange?: (month: DateData) => void;
    /** Partial theme override (merged with default theme) */
    theme?: Partial<CalendarTheme>;
    /** Container style (e.g. for card padding) */
    style?: ViewStyle;
}

const CalendarComp: React.FC<CalendarCompProps> = ({
    current,
    selected,
    markedDates = {},
    markingType = 'dot',
    firstDay = 0,
    enableSwipeMonths = true,
    hideExtraDays = true,
    onDayPress,
    onMonthChange,
    theme: themeOverride,
    style,
}) => {
    const theme = useMemo(
        () => ({ ...defaultTheme, ...themeOverride }),
        [themeOverride]
    );

    const effectiveMarked = useMemo(() => {
        if (selected && !markedDates[selected]) {
            const existing = markedDates[selected];
            return {
                ...markedDates,
                [selected]: {
                    selected: true,
                    selectedColor: Colors.secondary,
                    selectedTextColor: Colors.white,
                    ...(typeof existing === 'object' && existing ? existing : {}),
                },
            };
        }
        return markedDates;
    }, [markedDates, selected]);

    return (
        <Calendar
            current={current}
            markedDates={effectiveMarked}
            markingType={markingType}
            theme={theme}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            enableSwipeMonths={enableSwipeMonths}
            hideExtraDays={hideExtraDays}
            firstDay={firstDay}
            style={style}
        />
    );
};

export default CalendarComp;
export type { DateData };
