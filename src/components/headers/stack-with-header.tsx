import { Stack, useRouter } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '@/constants/style-constant';
import { Button } from '@/components/primitives/button';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';

interface StackWithHeaderProps {
  title: string;
  backTitle?: string;
  /** If provided, renders a custom chevron-back Pressable instead of the default back button */
  onBack?: () => void;
  /** If provided, renders a Save & Exit button in the header right */
  onSave?: () => void;
  isSaving?: boolean;
  /** If provided, renders a Trash button in the header right (before save) */
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function StackWithHeader({
  title,
  backTitle,
  onBack,
  onSave,
  isSaving,
  onDelete,
  isDeleting,
}: StackWithHeaderProps) {
  const hasHeaderRight = Boolean(onSave || onDelete);
  const router = useRouter();
  return (
    <Stack.Screen
      options={{
        title,
        headerStyle: { backgroundColor: COLORS.vinaupTeal },
        headerTintColor: '#fff',
        ...(backTitle && { headerBackTitle: backTitle }),
        headerLeft: () => (
          <Pressable
            onPress={() => {
              if (onBack) onBack();
              router.back();
            }}
            style={{
              alignItems: 'center',
              marginLeft: -8,
              marginRight: 4,
              flexDirection: 'row',
            }}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
        ),
        ...(hasHeaderRight && {
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginRight: -4,
              }}
            >
              {onDelete && (
                <Button
                  onPress={onDelete}
                  isLoading={isDeleting}
                  loaderStyle={{
                    color: COLORS.vinaupWhite,
                  }}
                >
                  <FontAwesome name="trash-o" size={20} color="#fff" />
                </Button>
              )}
              {onSave && (
                <Button
                  onPress={onSave}
                  isLoading={isSaving}
                  loaderStyle={{ color: COLORS.vinaupWhite }}
                >
                  <VinaupSaveAndExit
                    width={32}
                    height={24}
                    color={COLORS.vinaupYellow}
                  />
                </Button>
              )}
            </View>
          ),
        }),
      }}
    />
  );
}
