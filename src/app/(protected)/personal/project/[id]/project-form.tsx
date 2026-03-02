import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import dayjs, { Dayjs } from 'dayjs';
import { COLORS } from '@/constants/style-constant';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import { TextSwitcher } from '@/components/primitives/text-switcher';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { useMutationFn } from '@/hooks/use-mutation-fn';
import { getProjectByIdApi, updateProjectApi } from '@/apis/project-apis';
import {
  ProjectResponse,
  UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import Loader from '@/components/primitives/loader';

export default function ProjectDetailFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; projectId?: string }>();
  const projectId = params.projectId || '';

  const {
    data: existingProject,
    isLoading: isFetchingProject,
    executeFetchFn: fetchProject,
  } = useFetchFn<ProjectResponse>();

  const { isMutating, executeMutationFn } = useMutationFn<ProjectResponse>();

  // Form state
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [dateRangeType, setDateRangeType] = useState<'day' | 'period'>('day');

  // Validation
  const [inputErrors, setInputErrors] = useState<{ description?: boolean }>({});

  useEffect(() => {
    if (projectId) {
      fetchProject(() => getProjectByIdApi(projectId));
    }
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (existingProject) {
      setDescription(existingProject.description || '');
      const start = dayjs(existingProject.startDate);
      const end = dayjs(existingProject.endDate);
      setStartDate(start);
      setEndDate(end);

      const isSameDay = start.isSame(end, 'day');
      const isEndOfDay = end.hour() === 23 && end.minute() === 59;
      setDateRangeType(isSameDay && isEndOfDay ? 'day' : 'period');
    }
  }, [existingProject]);

  const validateAllInputs = () => {
    const errors: typeof inputErrors = {};
    if (!description.trim()) errors.description = true;
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAndExit = async () => {
    if (!validateAllInputs()) return;

    const data: UpdateProjectRequest = {
      description,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    };

    await executeMutationFn(() => updateProjectApi(projectId, data), {
      onSuccess: () => {
        router.back();
      },
      onError: () => {
        Alert.alert('Lỗi', 'Không thể cập nhật dự án.');
      },
    });
  };

  if (isFetchingProject) {
    return (
      <View style={styles.loaderContainer}>
        <Loader size={64} />
      </View>
    );
  }

  return (
    <>
      <StackWithHeader
        title="Chỉnh sửa dự án"
        backTitle="Quay lại"
        onSave={handleSaveAndExit}
        isSaving={isMutating}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tiêu đề */}
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, inputErrors.description && styles.labelError]}
            >
              Tiêu đề
            </Text>
            <TextInput
              style={[
                styles.textInput,
                inputErrors.description && styles.inputError,
              ]}
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
            />
          </View>

          {/* No. */}
          {existingProject?.code && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>No.</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={existingProject.code.slice(0, 8)}
                editable={false}
              />
            </View>
          )}

          {/* Bắt đầu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bắt đầu</Text>
            <DateTimePicker
              value={startDate}
              onChange={(d) => {
                setStartDate(d);
                if (dateRangeType === 'day') {
                  setEndDate(d.hour(23).minute(59));
                }
              }}
              displayFormat="DD/MM/YYYY HH:mm"
            />
          </View>

          {/* Kết thúc (only for period) */}
          {dateRangeType === 'period' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kết thúc</Text>
              <DateTimePicker
                value={endDate}
                onChange={(d) => setEndDate(d)}
                displayFormat="DD/MM/YYYY HH:mm"
              />
            </View>
          )}

          {/* Day / Period switcher */}
          <View style={styles.inputGroup}>
            <TextSwitcher
              textPair={['Trong ngày', 'Giai đoạn']}
              currentIndex={dateRangeType === 'day' ? 0 : 1}
              onToggle={() => {
                const nextType = dateRangeType === 'day' ? 'period' : 'day';
                setDateRangeType(nextType);
                if (nextType === 'day') {
                  setEndDate(startDate.hour(23).minute(59));
                } else {
                  setEndDate(startDate.add(1, 'day').hour(23).minute(59));
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.vinaupDarkGray,
  },
  labelError: {
    color: COLORS.vinaupRed,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.vinaupBlack,
    backgroundColor: COLORS.vinaupWhite,
  },
  inputError: {
    borderColor: COLORS.vinaupRed,
  },
  disabledInput: {
    backgroundColor: COLORS.vinaupSoftGray,
    color: COLORS.vinaupMediumGray,
  },
});
