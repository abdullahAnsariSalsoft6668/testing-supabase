import { nasalization } from '@/assets/fonts';
import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

export type LiveTeam = {
    name: string;
    emoji: string;
    color?: string;
};

export interface LiveGameCardProps {
    teams: LiveTeam[];
    squaresFilled: number;
    totalSquares: number;
    pricePerSquare: string;
    timeRemaining: string;
    onPress?: () => void;
}

const TeamRow = ({ emoji, name, color }: LiveTeam) => (
    <View style={styles.teamRow}>
        <View style={styles.teamIconWrap}>
            <TextComp text={emoji} style={styles.teamEmoji} />
        </View>
        <TextComp text={name} style={[styles.teamName, color ? { color } : null]} />
    </View>
);

const LiveGameCard: React.FC<LiveGameCardProps> = ({
    teams,
    squaresFilled,
    totalSquares,
    pricePerSquare,
    timeRemaining,
    onPress,
}) => {
    const progress = Math.min(Math.max(squaresFilled / totalSquares, 0), 1);

    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && onPress ? styles.cardPressed : null]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <TextComp text="LIVE" style={styles.liveBadgeText} />
            </View>

            <View style={styles.teamsBlock}>
                {teams.map(team => (
                    <TeamRow
                        key={team.name}
                        emoji={team.emoji}
                        name={team.name}
                        color={team.color}
                    />
                ))}
            </View>

            <View style={styles.progressHeader}>
                <TextComp text="Squares Filled" style={styles.progressLabel} />
                <TextComp
                    text={`${squaresFilled}/${totalSquares}`}
                    style={styles.progressValue}
                />
            </View>

            <View style={styles.progressTrack}>
                <LinearGradient
                    colors={[
                        Colors.buttonSplitFillStart,
                        Colors.buttonSplitFillMid,
                        Colors.buttonSplitFillEnd,
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
            </View>

            <View style={styles.footerRow}>
                <View style={styles.footerItem}>
                    <View style={styles.footerIconWrap}>
                        <TextComp text="$" style={styles.footerIconText} />
                    </View>
                    <TextComp text={`${pricePerSquare} / square`} style={styles.footerText} />
                </View>
                <View style={styles.footerItem}>
                    <View style={styles.footerIconWrap}>
                        <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24">
                            <Circle cx="12" cy="12" r="9" stroke={Colors.gray400} strokeWidth={1.5} fill="none" />
                            <Path
                                d="M12 7v5l3 2"
                                stroke={Colors.gray400}
                                strokeWidth={1.5}
                                strokeLinecap="round"
                            />
                        </Svg>
                    </View>
                    <TextComp text={timeRemaining} style={styles.footerText} />
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(20),
        padding: spaces.medium,
        marginBottom: spaces.medium,
        position: 'relative',
    },
    cardPressed: {
        opacity: 0.92,
    },
    liveBadge: {
        position: 'absolute',
        top: spaces.medium,
        right: spaces.medium,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.error,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        gap: moderateScale(4),
    },
    liveDot: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(3),
        backgroundColor: Colors.white,
    },
    liveBadgeText: {
        fontSize: moderateScale(10),
        fontFamily: fontFamily.bold,
        color: Colors.white,
        letterSpacing: moderateScale(0.5),
    },
    teamsBlock: {
        marginTop: moderateScale(4),
        marginBottom: spaces.medium,
        gap: moderateScale(10),
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    teamIconWrap: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(16),
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamEmoji: {
        fontSize: moderateScale(16),
    },
    teamName: {
        fontSize: moderateScale(16),
        fontFamily: nasalization.regular,
        color: Colors.black,
        letterSpacing: moderateScale(0.6),
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    progressLabel: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: Colors.gray500,
    },
    progressValue: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.bold,
        color: Colors.gray600,
    },
    progressTrack: {
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.gray100,
        overflow: 'hidden',
        marginBottom: spaces.medium,
    },
    progressFill: {
        height: '100%',
        borderRadius: moderateScale(4),
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    footerIconWrap: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerIconText: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.bold,
        color: Colors.gray400,
    },
    footerText: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: Colors.gray500,
    },
});

export default React.memo(LiveGameCard);
