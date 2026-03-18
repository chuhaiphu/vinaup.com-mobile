import { loginApi } from '@/apis/auth-apis';
import { COLORS } from '@/constants/style-constant';
import { AuthContext } from '@/providers/auth-provider';
import { ApiError } from 'fetchwire';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button } from '@/components/primitives/button';
import { Image } from 'expo-image';

const LoginForm = () => {
  const { isLoading, performLogin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await loginApi(email, password);
      if (response.status === 200 && response.data?.user) {
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
            <Image
              source={{ uri: 'vinaup_logo_secondary' }}
              style={styles.formLogo}
            />
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </Button>
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

const styles = StyleSheet.create({
  formRoot: {
    flex: 1,
    backgroundColor: COLORS.vinaupBlueDark,
  },
  formContainer: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },
  formTitle: {
    color: COLORS.vinaupWhite,
    fontSize: 24,
    marginTop: 24,
  },
  formLogo: {
    width: 80,
    height: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  passwordInput: {
    position: 'relative',
  },
  input: {
    color: COLORS.vinaupWhite,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.vinaupYellow,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '25%',
  },
  button: {
    backgroundColor: COLORS.vinaupYellow,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.vinaupBlueDark,
    fontSize: 18,
    fontWeight: '600',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
  },
  footerText: {
    color: COLORS.vinaupWhite,
    fontSize: 16,
  },
  footerLink: {
    color: COLORS.vinaupYellow,
    fontSize: 16,
    fontWeight: '600',
  },
});
