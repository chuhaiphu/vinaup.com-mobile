import React, { useState } from 'react';
import {
  Text,
  Pressable,
  Platform,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import NativeDatetimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/style-constant';

interface DateTimePickerProps {
  value: Dayjs;
  onChange?: (date: Dayjs) => void;
  isLocked?: boolean;
  disabled?: boolean;
  displayFormat?: string;
  style?: {
    dateText?: StyleProp<TextStyle>;
    disabled?: StyleProp<ViewStyle>;
  };
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  isLocked = false,
  disabled = false,
  displayFormat = 'DD/MM/YYYY',
  style,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onChange?.(dayjs(selectedDate));
    }
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const handleShowDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value.toDate(),
        onChange: handleDateChange,
        mode: 'date',
        is24Hour: true,
        positiveButtonLabel: 'Xác nhận',
        negativeButtonLabel: 'Hủy bỏ',
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const isDisabled = isLocked || disabled;

  return (
    <>
      <Pressable
        onPress={handleShowDatePicker}
        style={[isDisabled && styles.disabled, style?.disabled]}
        disabled={isDisabled}
      >
        <Text
          style={[
            styles.dateText,
            isDisabled && {
              color: COLORS.vinaupMediumGray,
            },
            style?.dateText,
          ]}
        >
          {value.format(displayFormat)}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' && showDatePicker && (
        <NativeDatetimePicker
          value={value.toDate()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dateText: {
    color: COLORS.vinaupBlueLink,
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default DateTimePicker;
