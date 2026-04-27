import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useState } from 'react';
import { Button } from '@/components/primitives/button';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import dayjs, { Dayjs } from 'dayjs';

interface TourInfoModalContentProps {
  tourDescription?: string;
  tourStartDate?: string;
  tourEndDate?: string;
  isLoading?: boolean;
  onConfirm?: (data: {
    description: string;
    startDate: string;
    endDate: string;
  }) => void;
  onCloseRequest?: () => void;
}

export function TourInfoModalContent({
  tourDescription = '',
  tourStartDate,
  tourEndDate,
  isLoading = false,
  onConfirm,
  onCloseRequest,
}: TourInfoModalContentProps) {
  const [description, setDescription] = useState(tourDescription);
  const [startDate, setStartDate] = useState<Dayjs>(
    tourStartDate ? dayjs(tourStartDate) : dayjs()
  );
  // Default end date is 1 day after start date if not provided
  const [endDate, setEndDate] = useState<Dayjs>(
    tourEndDate ? dayjs(tourEndDate) : dayjs().add(1, 'day')
  );
  const [inputErrors, setInputErrors] = useState<{
    description?: boolean;
    date?: boolean; // in case end date is before start date
  }>({});

  const handleConfirm = () => {
    const errors: typeof inputErrors = {};
    if (!description.trim()) errors.description = true;
    if (endDate.isBefore(startDate)) errors.date = true;

    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onConfirm?.({
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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
              maxLength={120}
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
                  setStartDate(
                    startDate.year(d.year()).month(d.month()).date(d.date())
                  );
                }}
                displayFormat="DD/MM/YYYY"
                disabled={isLoading}
              />
              <DateTimePicker
                mode="time"
                value={startDate}
                onChange={(d) => {
                  setStartDate(startDate.hour(d.hour()).minute(d.minute()));
                }}
                displayFormat="HH:mm"
                disabled={isLoading}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.dateRow}>
            <Text
              style={[styles.inputLabel, inputErrors.date && styles.labelError]}
            >
              Kết thúc
            </Text>
            <View style={styles.dateTimeRow}>
              <DateTimePicker
                mode="date"
                value={endDate}
                onChange={(d) => {
                  setEndDate(
                    endDate.year(d.year()).month(d.month()).date(d.date())
                  );
                  setInputErrors((prev) => ({ ...prev, date: undefined }));
                }}
                displayFormat="DD/MM/YYYY"
                disabled={isLoading}
              />
              <DateTimePicker
                mode="time"
                value={endDate}
                onChange={(d) => {
                  setEndDate(endDate.hour(d.hour()).minute(d.minute()));
                  setInputErrors((prev) => ({ ...prev, date: undefined }));
                }}
                displayFormat="HH:mm"
                disabled={isLoading}
              />
            </View>
          </View>
          {inputErrors.date && (
            <Text style={styles.errorMessage}>
              Ngày kết thúc phải sau ngày bắt đầu
            </Text>
          )}
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
  errorMessage: {
    color: COLORS.vinaupRed,
    fontSize: 14,
    marginTop: 4,
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
