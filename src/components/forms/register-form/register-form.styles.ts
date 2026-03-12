import { COLORS } from '@/constants/style-constant';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
