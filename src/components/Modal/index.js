import ModalComp from '../ModalComp';

/**
 * @param {object} props
 * @param {boolean} props.isVisible
 * @param {() => void} props.onClose
 * @param {import('react').ReactNode} [props.children]
 * @param {'bottomSheet' | 'alert-box' | 'date-box' | 'withdraw-box'} [props.type]
 * @param {'success' | 'error' | 'confirm'} [props.alertStatus]
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {string} [props.primaryButtonText]
 * @param {string} [props.secondaryButtonText]
 * @param {() => void} [props.onPrimaryPress]
 * @param {() => void} [props.onSecondaryPress]
 * @param {string} [props.dateLabel]
 * @param {string} [props.dateValue]
 * @param {(date: string) => void} [props.onDateChange]
 * @param {boolean} [props.dateRequired]
 * @param {string} [props.balance]
 * @param {'bank' | 'crypto'} [props.withdrawMethod]
 * @param {(method: 'bank' | 'crypto') => void} [props.onWithdrawMethodChange]
 * @param {(values: import('../ModalComp').WithdrawFormValues) => void} [props.onSubmitWithdraw]
 */
const CustomModal = ({
    isVisible,
    onClose,
    children,
    type = 'bottomSheet',
    alertStatus,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    containerStyle,
    showHandle,
    showCloseButton,
    dateLabel,
    dateValue,
    onDateChange,
    dateRequired,
    balance,
    withdrawMethod,
    onWithdrawMethodChange,
    onSubmitWithdraw,
}) => {
    return (
        <ModalComp
            isVisible={isVisible}
            onClose={onClose}
            type={type}
            alertStatus={alertStatus}
            title={title}
            message={message}
            primaryButtonText={primaryButtonText}
            secondaryButtonText={secondaryButtonText}
            onPrimaryPress={onPrimaryPress}
            onSecondaryPress={onSecondaryPress}
            containerStyle={containerStyle}
            showHandle={showHandle}
            showCloseButton={showCloseButton}
            dateLabel={dateLabel}
            dateValue={dateValue}
            onDateChange={onDateChange}
            dateRequired={dateRequired}
            balance={balance}
            withdrawMethod={withdrawMethod}
            onWithdrawMethodChange={onWithdrawMethodChange}
            onSubmitWithdraw={onSubmitWithdraw}
        >
            {children}
        </ModalComp>
    );
};

export default CustomModal;
