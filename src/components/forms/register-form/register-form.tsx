import { registerApi } from '@/apis/user-apis';
import { COLORS } from '@/constants/style-constant';
import { ApiError } from 'fetchwire';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from './register-form.styles';
import { Button } from '@/components/primitives/button';
import { Image } from 'expo-image';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await registerApi({ email, password, name: fullName });
      if (response.status === 201) {
        Alert.alert('Đăng ký thành công', 'Vui lòng đăng nhập.', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 400) {
          Alert.alert(
            'Đăng ký thất bại',
            'Email đã tồn tại hoặc dữ liệu không hợp lệ'
          );
        }
      } else
        Alert.alert(
          'Đăng ký thất bại',
          error instanceof ApiError ? error.message : 'Lỗi không xác định'
        );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formRoot}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Image
              source={{ uri: 'vinaup_logo_secondary' }}
              style={styles.formLogo}
            />
            <Text style={styles.formTitle}>Đăng ký</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Tên cá nhân"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              placeholderTextColor={COLORS.vinaupMediumGray}
            />

            <TextInput
              placeholder="Nhập email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.vinaupMediumGray}
            />

            <View style={styles.passwordInput}>
              <TextInput
                placeholder="Nhập mật khẩu"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={COLORS.vinaupMediumGray}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.vinaupMediumGray}
                />
              </Pressable>
            </View>
          </View>

          <Button
            isLoading={isLoading}
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Đăng ký</Text>
          </Button>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Bạn đã có tài khoản?</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={12}
              color={COLORS.vinaupWhite}
            />
            <Link href="/login" style={styles.footerLink}>
              Đăng nhập
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterForm;
