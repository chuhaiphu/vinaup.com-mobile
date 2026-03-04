import React, { useState } from 'react';
import {
  Text,
  Pressable,
  Platform,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import NativeDatetimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/style-constant';

interface DateTimePickerProps {
  mode?: 'date' | 'time';
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
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

export function DateTimePicker({
  mode = 'date',
  leftSection,
  rightSection,
  value,
  onChange,
  isLocked = false,
  disabled = false,
  displayFormat = 'DD/MM/YYYY',
  style,
}: DateTimePickerProps) {
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
        mode: mode,
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
        style={[isDisabled && styles.disabled, style?.disabled, styles.container]}
        disabled={isDisabled}
      >
        {leftSection && <View style={styles.leftSection}>{leftSection}</View>}
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
        {rightSection && <View style={styles.rightSection}>{rightSection}</View>}
      </Pressable>

      {Platform.OS === 'ios' && showDatePicker && (
        <NativeDatetimePicker
          value={value.toDate()}
          mode={mode}
          display="spinner"
          onChange={handleDateChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: COLORS.vinaupBlueLink,
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  leftSection: {
    marginRight: 8,
  },
  rightSection: {
    marginLeft: 8,
  },
});

export default DateTimePicker;
