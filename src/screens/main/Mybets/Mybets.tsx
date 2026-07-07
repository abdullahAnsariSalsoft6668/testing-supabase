import { localImages } from '@/assets/images';
import WrapperContainer from '@/components/WrapperContainer';
import LiveGameCard from './LiveGameCard';
import React from 'react';
import { ImageBackground, ScrollView, StatusBar } from 'react-native';

import GameStatsCard from './GameStatsCard';
import MyBetsScreenHeader from './MyBetsScreenHeader';
import PriceTierDropdown from './PriceTierDropdown';
import SquaresGrid from './SquaresGrid';
import WinningsCard from './WinningsCard';
import styles, { MY_BETS_BG } from './styles';

const GAME_TEAMS = [
    { name: 'COWBOYS', emoji: '🏈', color: '#5BC0EB' },
    { name: 'EAGLES', emoji: '🦅', color: '#E53935' },
] as const;

const Mybets: React.FC = () => {
    return (
        <WrapperContainer style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={MY_BETS_BG} />
            <ImageBackground source={localImages.homeBg} style={styles.background} resizeMode="cover">
                <MyBetsScreenHeader />

                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <PriceTierDropdown />

                    <LiveGameCard
                        teams={[...GAME_TEAMS]}
                        squaresFilled={100}
                        totalSquares={100}
                        pricePerSquare="$01"
                        timeRemaining="1h 59m"
                    />

                    <GameStatsCard quarter={2} timeLeft="06:20" />

                    <WinningsCard amount="$125.50" subtitle="1 quarter won so far" />

                    <SquaresGrid />
                </ScrollView>
            </ImageBackground>
        </WrapperContainer>
    );
};

export default Mybets;
