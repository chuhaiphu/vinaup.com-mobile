import { colors } from "@/constants/style-constant";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  formRoot: {
    flex: 1,
    backgroundColor: colors.vinaupBlueDark,
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
    color: colors.vinaupWhite,
    fontSize: 24,
    marginTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  passwordInput: {
    position: 'relative',
  },
  input: {
    color: colors.vinaupWhite,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.vinaupYellow,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '25%',
  },
  button: {
    backgroundColor: colors.vinaupYellow,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.vinaupBlueDark,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonLoader: {
    width: 48,
    height: 48,
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
  },
  footerText: {
    color: colors.vinaupWhite,
    fontSize: 16,
  },
  footerLink: {
    color: colors.vinaupYellow,
    fontSize: 16,
    fontWeight: '600',
  },
});