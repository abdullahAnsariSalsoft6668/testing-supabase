import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from './styles';

interface QuantityStepperProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    /** When true, controls are non-interactive (e.g. server-sourced quantity only). */
    disabled?: boolean;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
}) => {
    return (
        <View style={[styles.qtyStepper, disabled && { opacity: 0.55 }]}>
            <TouchableOpacity
                onPress={onDecrease}
                activeOpacity={0.8}
                style={styles.qtyIconBtn}
                hitSlop={8}
                disabled={disabled}
            >
                <MyIcons name="decreasedQty" size={22} />
            </TouchableOpacity>

            <TextComp text={`${quantity}`} style={styles.qtyText} />

            <TouchableOpacity
                onPress={onIncrease}
                activeOpacity={0.8}
                style={styles.qtyIconBtn}
                hitSlop={8}
                disabled={disabled}
            >
                <MyIcons name="increaseQty" size={22} />
            </TouchableOpacity>
        </View>
    );
};

export default QuantityStepper;
