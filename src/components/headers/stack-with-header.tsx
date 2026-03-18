import React from 'react';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/style-constant';
import { Button } from '@/components/primitives/button';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';
import { PressableOpacity } from '../primitives/pressable-opacity';

// Rút gọn style interface, tập trung vào layout
interface StackWithHeaderStyles {
  container?: StyleProp<ViewStyle>;
  headerBar?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  leftContainer?: StyleProp<ViewStyle>;
  rightContainer?: StyleProp<ViewStyle>;
  extensionContainer?: StyleProp<ViewStyle>;
}

interface StackWithHeaderProps {
  title: string;
  // Back props
  onBack?: () => void;
  backIcon?: React.ReactNode;
  hideBack?: boolean;
  // Save props
  onSave?: () => void;
  saveIcon?: React.ReactNode;
  isSaving?: boolean;
  // Delete props
  onDelete?: () => void;
  deleteIcon?: React.ReactNode;
  isDeleting?: boolean;
  // Children & Styles
  children?: React.ReactNode;
  styles?: StackWithHeaderStyles;
}

export function StackWithHeader({
  title,
  onBack,
  backIcon,
  hideBack = false,
  onSave,
  saveIcon,
  isSaving,
  onDelete,
  deleteIcon,
  isDeleting,
  children,
  styles: customStyles,
}: StackWithHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const defaultBackIcon = (
    <Ionicons name="chevron-back" size={28} color={COLORS.vinaupTeal} />
  );
  const defaultDeleteIcon = (
    <FontAwesome name="trash-o" size={20} color={COLORS.vinaupTeal} />
  );
  const defaultSaveIcon = (
    <VinaupSaveAndExit width={32} height={24} color={COLORS.vinaupYellow} />
  );

  return (
    <Stack.Screen
      options={{
        header: () => (
          <View
            style={[
              { paddingTop: insets.top },
              defaultStyles.container,
              customStyles?.container,
            ]}
          >
            <View style={[defaultStyles.headerBar, customStyles?.headerBar]}>
              {/* Left Section */}
              <View
                style={[
                  defaultStyles.innerContainer,
                  defaultStyles.left,
                  customStyles?.leftContainer,
                ]}
              >
                {!hideBack && (
                  <PressableOpacity
                    onPress={() => {
                      if (onBack) onBack();
                      router.back();
                    }}
                    style={defaultStyles.backButton}
                  >
                    {backIcon ?? defaultBackIcon}
                  </PressableOpacity>
                )}
                <Text
                  numberOfLines={1}
                  style={[defaultStyles.titleText, customStyles?.title]}
                >
                  {title}
                </Text>
              </View>

              {/* Right Section */}
              <View
                style={[
                  defaultStyles.innerContainer,
                  defaultStyles.right,
                  customStyles?.rightContainer,
                ]}
              >
                <View style={defaultStyles.actionGroup}>
                  {onDelete && (
                    <Button
                      onPress={onDelete}
                      isLoading={isDeleting}
                      loaderStyle={{ color: COLORS.vinaupTeal }}
                    >
                      {deleteIcon ?? defaultDeleteIcon}
                    </Button>
                  )}
                  {onSave && (
                    <Button
                      onPress={onSave}
                      isLoading={isSaving}
                      loaderStyle={{ color: COLORS.vinaupYellow }}
                    >
                      {saveIcon ?? defaultSaveIcon}
                    </Button>
                  )}
                </View>
              </View>
            </View>

            {children && (
              <View
                style={[defaultStyles.extension, customStyles?.extensionContainer]}
              >
                {children}
              </View>
            )}
          </View>
        ),
      }}
    />
  );
}

const defaultStyles = StyleSheet.create({
  container: { backgroundColor: COLORS.vinaupWhite },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.vinaupTeal,
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 4,
    marginLeft: -8,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  extension: {
    paddingBottom: 8,
  },
});
