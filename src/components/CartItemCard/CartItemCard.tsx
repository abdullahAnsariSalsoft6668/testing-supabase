import TextComp from '@/components/TextComp';
import QuantityStepper from '@/components/QuantityStepper';
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import React from 'react';
import styles from './styles';

interface CartItemCardProps {
    category: string;
    title: string;
    priceText: string;
    image: ImageSourcePropType;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onDelete?: () => void;
    /** @default true — set false to match cart designs without a trash control */
    showDelete?: boolean;
    /** @default false — disables remove tap (e.g. while API in flight) */
    deleteDisabled?: boolean;
    /** @default false — pass true when quantity is read-only from the server */
    quantityDisabled?: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
    category,
    title,
    priceText,
    image,
    quantity,
    onIncrease,
    onDecrease,
    onDelete,
    showDelete = true,
    deleteDisabled = false,
    quantityDisabled = false,
}) => {
    return (
        <View style={styles.itemCard}>
            <View style={styles.itemRow}>
                <View style={styles.imageWrap}>
                    <Image source={image} style={styles.productImage} resizeMode="cover" />
                </View>

                <View style={styles.itemInfo}>
                    <View style={styles.itemHeaderRow}>
                        <View style={styles.itemTextBlock}>
                            <TextComp text={title} style={styles.itemTitle} numberOfLines={2} />
                            <TextComp text={category} style={styles.variantText} numberOfLines={1} />
                        </View>
                        {showDelete && onDelete ? (
                            <TouchableOpacity
                                onPress={onDelete}
                                activeOpacity={0.8}
                                style={styles.deleteBtn}
                                disabled={deleteDisabled}
                                accessibilityRole="button"
                                accessibilityLabel="Remove item from cart"
                            >
                                <TextComp
                                    text="✕"
                                    style={[styles.deleteGlyph, deleteDisabled && { opacity: 0.35 }]}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <View style={styles.priceQtyRow}>
                        <TextComp text={priceText} style={styles.itemPrice} />
                        <QuantityStepper
                            quantity={quantity}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                            disabled={quantityDisabled}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CartItemCard;
