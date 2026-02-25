import React, { useState } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  Modal,
  FlatList,
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { COLORS } from '@/constants/style-constant';

interface MonthYearPickerProps {
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

export function MonthYearPicker({
  leftSection,
  rightSection,
  value,
  onChange,
  isLocked = false,
  disabled = false,
  displayFormat = 'MM/YYYY',
  style,
}: MonthYearPickerProps) {
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState<Dayjs>(value);

  const years = Array.from({ length: 21 }, (_, i) => dayjs().year() - 10 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleOpen = () => {
    setTempValue(value);
    setVisible(true);
  };

  const handleConfirm = () => {
    onChange?.(tempValue);
    setVisible(false);
  };

  const isDisabled = isLocked || disabled;

  return (
    <>
      <Pressable
        onPress={handleOpen}
        style={[isDisabled && styles.disabled, style?.disabled, styles.container]}
        disabled={isDisabled}
      >
        {leftSection && <View style={styles.leftSection}>{leftSection}</View>}
        <Text
          style={[
            styles.dateText,
            isDisabled && { color: COLORS.vinaupMediumGray },
            style?.dateText,
          ]}
        >
          {value.format(displayFormat)}
        </Text>
        {rightSection && <View style={styles.rightSection}>{rightSection}</View>}
      </Pressable>

      <Modal visible={visible} transparent animationType="none">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.pickerWrapper}>
              <FlatList
                data={months}
                keyExtractor={(item) => `m-${item}`}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.item}
                    onPress={() => setTempValue(tempValue.month(item))}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        tempValue.month() === item && styles.activeText,
                      ]}
                    >
                      Tháng {item + 1}
                    </Text>
                  </Pressable>
                )}
              />

              <FlatList
                data={years}
                keyExtractor={(item) => `y-${item}`}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.item}
                    onPress={() => setTempValue(tempValue.year(item))}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        tempValue.year() === item && styles.activeText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </View>

            <View style={styles.footer}>
              <Pressable
                style={styles.confirmBtn}
                onPress={() => setVisible(false)}
              >
                <Text style={[styles.confirmBtnText]}>Hủy bỏ</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Xác nhận</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 4,
    padding: 16,
    maxHeight: 360,
  },
  pickerWrapper: {
    flexDirection: 'row',
    height: 240,
  },
  item: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  activeText: {
    fontSize: 17,
    color: COLORS.vinaupTeal,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  confirmBtn: {
    marginLeft: 20,
    padding: 8,
  },
  confirmBtnText: {
    color: COLORS.vinaupTeal,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default MonthYearPicker;
