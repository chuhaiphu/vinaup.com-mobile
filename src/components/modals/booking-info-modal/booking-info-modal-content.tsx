import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useState } from 'react';
import { Button } from '@/components/primitives/button';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import { TextSwitcher } from '@/components/primitives/text-switcher';
import dayjs, { Dayjs } from 'dayjs';
import VinaupLeftRightArrows from '@/components/icons/vinaup-left-right-arrows.native';

interface BookingInfoModalContentProps {
  bookingDescription?: string;
  bookingStartDate?: Date;
  bookingEndDate?: Date;
  isLoading?: boolean;
  onConfirm?: (data: {
    description: string;
    startDate: Date;
    endDate: Date;
  }) => void;
  onCloseRequest?: () => void;
}

export function BookingInfoModalContent({
  bookingDescription = '',
  bookingStartDate,
  bookingEndDate,
  isLoading = false,
  onConfirm,
  onCloseRequest,
}: BookingInfoModalContentProps) {
  const [description, setDescription] = useState(bookingDescription);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs(bookingStartDate));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(bookingEndDate));
  const [inputErrors, setInputErrors] = useState<{
    description?: boolean;
  }>({});

  const isSameDay = startDate.isSame(endDate, 'day');
  const dateRangeType = isSameDay ? 'day' : 'period';

  const handleConfirm = () => {
    const errors: typeof inputErrors = {};
    if (!description.trim()) errors.description = true;
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onConfirm?.({
      description,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    });
  };

  return (
    <View style={styles.modalContent}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputItem}>
          <View
            style={[
              styles.inputWrapper,
              inputErrors.description && styles.inputError,
            ]}
          >
            <View style={styles.labelSection}>
              <Text
                style={[
                  styles.insideLabel,
                  inputErrors.description && styles.labelError,
                ]}
              >
                Tiêu đề
              </Text>
            </View>
            <View style={styles.separator} />
            <TextInput
              style={styles.inputNative}
              placeholder="..."
              maxLength={40}
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                setInputErrors((prev) => ({
                  ...prev,
                  description: !value.trim() ? true : undefined,
                }));
              }}
              placeholderTextColor={COLORS.vinaupMediumGray}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.dateRow}>
            <Text style={styles.inputLabel}>Bắt đầu</Text>
            <View style={styles.dateTimeRow}>
              <DateTimePicker
                mode="date"
                value={startDate}
                onChange={(d) => {
                  const updated = startDate
                    .year(d.year())
                    .month(d.month())
                    .date(d.date());
                  setStartDate(updated);
                  if (dateRangeType === 'day') {
                    setEndDate(updated.hour(23).minute(59));
                  }
                }}
                displayFormat="DD/MM/YYYY"
                disabled={isLoading}
              />
              <DateTimePicker
                mode="time"
                value={startDate}
                onChange={(d) => {
                  const updated = startDate.hour(d.hour()).minute(d.minute());
                  setStartDate(updated);
                  if (isSameDay) {
                    setEndDate(updated.hour(23).minute(59));
                  }
                }}
                displayFormat="HH:mm"
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
        <View style={styles.divider} />

        {dateRangeType === 'period' && (
          <View style={styles.inputGroup}>
            <View style={styles.dateRow}>
              <Text style={styles.inputLabel}>Kết thúc</Text>
              <View style={styles.dateTimeRow}>
                <DateTimePicker
                  mode="date"
                  value={endDate}
                  onChange={(d) => {
                    setEndDate(
                      endDate.year(d.year()).month(d.month()).date(d.date())
                    );
                  }}
                  displayFormat="DD/MM/YYYY"
                  disabled={isLoading}
                />
                <DateTimePicker
                  mode="time"
                  value={endDate}
                  onChange={(d) => {
                    setEndDate(endDate.hour(d.hour()).minute(d.minute()));
                  }}
                  displayFormat="HH:mm"
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <View style={styles.dateRangeRow}>
            <TextSwitcher
              textPair={['Trong ngày', 'Giai đoạn']}
              iconPosition="right"
              iconPair={[
                <VinaupLeftRightArrows
                  key={'left-right-arrows-off'}
                  leftArrowColor={COLORS.vinaupLightGray}
                />,
                <VinaupLeftRightArrows key={'left-right-arrows-on'} />,
              ]}
              currentIndex={dateRangeType === 'day' ? 0 : 1}
              onToggle={() => {
                const nextType = dateRangeType === 'day' ? 'period' : 'day';
                if (nextType === 'day') {
                  setEndDate(startDate.hour(23).minute(59));
                } else {
                  setEndDate(startDate.add(1, 'day').hour(23).minute(59));
                }
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonGroup}>
        <Button
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={onCloseRequest}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Huỷ</Text>
        </Button>
        <Button
          style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          loaderStyle={{ color: COLORS.vinaupWhite }}
        >
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  inputItem: {
    width: '100%',
    marginVertical: 6,
  },
  labelSection: {
    width: 100,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  insideLabel: {
    fontSize: 18,
    color: '#333',
  },
  separator: {
    width: 1.5,
    height: '70%',
    backgroundColor: COLORS.vinaupMediumDarkGray,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
    minHeight: 50,
  },
  inputNative: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 18,
  },
  inputGroup: {
    marginBottom: 8,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
  },
  labelError: {
    color: COLORS.vinaupRed,
  },
  inputError: {
    borderColor: COLORS.vinaupRed,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.vinaupLightGray,
    width: '100%',
    marginBottom: 8,
  },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupWhite,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
