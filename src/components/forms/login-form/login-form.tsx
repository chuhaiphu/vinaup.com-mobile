import { loginApi } from '@/apis/auth-apis';
import { VinaupLogoSecondary } from '@/components/icons/vinaup-logo-secondary.native';
import { COLORS } from '@/constants/style-constant';
import { AuthContext } from '@/providers/auth-provider';
import { ApiError } from '@/utils/api-error';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from './login-form.styles';

const LoginForm = () => {
  const { isLoading, performLogin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await loginApi(email, password);
      if (response.statusCode === 200 && response.data?.user) {
        await performLogin(response.data.user, response.data.accessToken);
        router.replace('/');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không chính xác');
        }
      } else
        Alert.alert(
          'Đăng nhập thất bại',
          error instanceof ApiError ? error.message : 'Lỗi không xác định'
        );
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
            <VinaupLogoSecondary width={80} height={80} />
            <Text style={styles.formTitle}>Đăng nhập</Text>
          </View>

          <View style={styles.inputContainer}>
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
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.vinaupMediumGray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Image
                source={require('@/components/icons/vinaup-loader.gif')}
                style={styles.buttonLoader}
              />
            ) : (
              <Text style={styles.buttonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Bạn chưa có tài khoản?</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={12}
              color={COLORS.vinaupWhite}
            />
            <Link href="/register" style={styles.footerLink}>
              Đăng ký
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
