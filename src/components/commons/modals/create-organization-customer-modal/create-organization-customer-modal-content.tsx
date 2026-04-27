import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { useMutationFn } from 'fetchwire';
import { createOrganizationCustomerApi } from '@/apis/organization-apis';
import { COLORS } from '@/constants/style-constant';

interface CreateOrganizationCustomerModalContentProps {
  organizationId?: string;
  onCreated?: (customer: OrganizationCustomerResponse) => void;
  onCloseRequest?: () => void;
}

export function CreateOrganizationCustomerModalContent({
  organizationId,
  onCreated,
  onCloseRequest,
}: CreateOrganizationCustomerModalContentProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{
    name?: boolean;
    phone?: boolean;
    email?: boolean;
  }>({});

  const createOrganizationCustomerFn = () =>
    createOrganizationCustomerApi({
      organizationId: organizationId!,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().length > 0 ? email.trim() : undefined,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString(),
    });

  const { executeMutationFn: createOrganizationCustomer, isMutating } =
    useMutationFn(createOrganizationCustomerFn, {
      invalidatesTags: ['organization-customer-list'],
    });

  const validateField = (field: keyof typeof errors, value: string) => {
    const trimmed = value.trim();
    switch (field) {
      case 'name':
        return !trimmed;
      case 'phone':
        return !/^0\d{8,10}$/.test(trimmed);
      case 'email':
        return trimmed !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      default:
        return false;
    }
  };

  const validateAll = () => {
    const newErrors: typeof errors = {};
    if (validateField('name', name)) newErrors.name = true;
    if (validateField('phone', phone)) newErrors.phone = true;
    if (validateField('email', email)) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!organizationId) {
      Alert.alert('Lỗi', 'Thiếu thông tin tổ chức.');
      return;
    }

    if (!validateAll()) return;

    createOrganizationCustomer({
      onSuccess: (created) => {
        if (created) {
          onCreated?.(created);
        }
        setName('');
        setPhone('');
        setEmail('');
        setErrors({});
        onCloseRequest?.();
      },
      onError: (error) => {
        Alert.alert(
          'Lỗi',
          error.message || 'Có lỗi xảy ra khi tạo khách hàng tổ chức.'
        );
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm khách hàng mới</Text>
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Tên</Text>
          <Text style={styles.requiredMark}>*</Text>
        </View>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={(val) => {
            setName(val);
            setErrors((prev) => ({
              ...prev,
              name: validateField('name', val),
            }));
          }}
          placeholder="Nguyễn Văn A"
          placeholderTextColor={COLORS.vinaupMediumGray}
        />
        {errors.name && (
          <Text style={styles.errorText}>Vui lòng nhập tên khách hàng.</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Điện thoại</Text>
          <Text style={styles.requiredMark}>*</Text>
        </View>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            setErrors((prev) => ({
              ...prev,
              phone: validateField('phone', val),
            }));
          }}
          placeholder="0xxxxxxxxx"
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.vinaupMediumGray}
        />
        {errors.phone && (
          <Text style={styles.errorText}>Số điện thoại không hợp lệ.</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Email</Text>
        </View>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setErrors((prev) => ({
              ...prev,
              email: validateField('email', val),
            }));
          }}
          placeholder="email@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.vinaupMediumGray}
        />
        {errors.email && <Text style={styles.errorText}>Email không hợp lệ.</Text>}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || isMutating) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isMutating}
      >
        <Text style={styles.submitButtonText}>Tạo khách hàng</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  requiredMark: {
    fontSize: 16,
    color: COLORS.vinaupRed,
    marginLeft: 4,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FBFBFB',
  },
  inputError: {
    borderColor: COLORS.vinaupRed,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.vinaupRed,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: COLORS.vinaupTeal,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.vinaupWhite,
    fontSize: 17,
    fontWeight: '500',
  },
});
