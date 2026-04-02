import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { COLORS } from '@/constants/style-constant';
import {
  createAdditionalDataApi,
  updateAdditionalDataApi,
  updateUserInvitedApi,
} from '@/apis/tour-apis';
import {
  TourImplementationAdditionalDataResponse,
  UserInvitedTourImplementationResponse,
  UpdateTourImplementationAdditionalDataRequest,
  UpdateUserInvitedRequest,
} from '@/interfaces/tour-implementation-interfaces';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useMutationFn, type ApiError } from 'fetchwire';
import {
  TourImplementationAdditionalEditModal,
  AdditionalEditFormData,
} from '@/components/modals/tour-implementation-additional-edit-modal/tour-implementation-additional-edit-modal';
import { Avatar } from '@/components/primitives/avatar';

interface Props {
  tourImplementationId: string | undefined;
  additionalData: TourImplementationAdditionalDataResponse[] | undefined;
  onRefresh: () => void;
}

export default function TourImplementationAdditionalContent({
  tourImplementationId,
  additionalData,
  onRefresh,
}: Props) {
  const [isExpaned, setIsExpaned] = useState(true);
  const [selectedItem, setSelectedItem] =
    useState<TourImplementationAdditionalDataResponse | null>(null);
  const editModalRef = useRef<SlideSheetRef>(null);

  const { executeMutationFn: createAdditionalData, isMutating: isCreating } =
    useMutationFn(() => createAdditionalDataApi(tourImplementationId ?? ''), {
      invalidatesTags: [],
    });

  const {
    executeMutationFn: updateAdditionalData,
    isMutating: isUpdatingAdditional,
  } = useMutationFn(
    ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTourImplementationAdditionalDataRequest;
    }) => updateAdditionalDataApi(id, data),
    { invalidatesTags: [] }
  );

  const {
    executeMutationFn: updateTourGuideInvited,
    isMutating: isUpdatingTourGuide,
  } = useMutationFn(
    ({ id, data }: { id: string; data: UpdateUserInvitedRequest }) =>
      updateUserInvitedApi(id, data),
    { invalidatesTags: [] }
  );

  const { executeMutationFn: updateDriverInvited, isMutating: isUpdatingDriver } =
    useMutationFn(
      ({ id, data }: { id: string; data: UpdateUserInvitedRequest }) =>
        updateUserInvitedApi(id, data),
      { invalidatesTags: [] }
    );

  const isConfirming =
    isUpdatingAdditional || isUpdatingTourGuide || isUpdatingDriver;

  const handleAddGroup = () => {
    if (!tourImplementationId || isCreating) return;
    createAdditionalData({
      onSuccess: () => onRefresh(),
      onError: (error: ApiError) =>
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra.'),
    });
  };

  const handleOpenEditModal = (item: TourImplementationAdditionalDataResponse) => {
    setSelectedItem(item);
    editModalRef.current?.open();
  };

  const handleConfirmEdit = (data: AdditionalEditFormData, onClose: () => void) => {
    let successCount = 0;
    const onEachSuccess = () => {
      successCount++;
      if (successCount === 3) {
        onRefresh();
        onClose();
      }
    };
    const onEachError = (error: ApiError) => {
      Alert.alert('Lỗi', error?.message || 'Có lỗi xảy ra khi cập nhật.');
    };

    updateAdditionalData(
      {
        id: data.additionalDataId,
        data: { carName: data.carName, position: data.position },
      },
      { onSuccess: onEachSuccess, onError: onEachError }
    );
    updateTourGuideInvited(
      {
        id: data.tourGuide.id,
        data: {
          customUserName: data.tourGuide.customUserName,
          customPhone: data.tourGuide.customPhone,
          userId: data.tourGuide.userId,
          currentOption: data.tourGuide.currentOption,
        },
      },
      { onSuccess: onEachSuccess, onError: onEachError }
    );
    updateDriverInvited(
      {
        id: data.driver.id,
        data: {
          customUserName: data.driver.customUserName,
          customPhone: data.driver.customPhone,
          userId: data.driver.userId,
          currentOption: data.driver.currentOption,
        },
      },
      { onSuccess: onEachSuccess, onError: onEachError }
    );
  };

  const renderUserRow = (
    user: UserInvitedTourImplementationResponse | undefined,
    label: string
  ) => {
    const name =
      user?.currentOption === 0
        ? user.customUserName || 'Chưa nhập tên'
        : user?.user?.name || 'Chưa nhập tên';
    const phone =
      user?.currentOption === 0
        ? (user?.customPhone ?? '—')
        : (user?.user?.phone ?? '—');
    const avatarUrl = user?.user?.avatarUrl;

    return (
      <View style={styles.memberRow}>
        <Avatar imgSrc={avatarUrl} size={40} />
        <View style={styles.memberInfo}>
          <View style={styles.infoTop}>
            <Text style={styles.memberName}>{name}</Text>
          </View>
          <Text style={styles.infoBottom}>
            {label} - {phone}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HDV & Tài xế & Xe</Text>
        <View style={styles.sectionActions}>
          <PressableOpacity onPress={handleAddGroup} hitSlop={4}>
            <Feather name="user-plus" size={22} color={COLORS.vinaupTeal} />
          </PressableOpacity>
          <PressableOpacity onPress={() => setIsExpaned(!isExpaned)} hitSlop={4}>
            <View style={styles.expandToggle}>
              <FontAwesome
                name={isExpaned ? 'caret-up' : 'caret-down'}
                size={24}
                color={COLORS.vinaupTeal}
                style={isExpaned ? { marginTop: -2 } : { marginTop: 0 }}
              />
            </View>
          </PressableOpacity>
        </View>
      </View>
      {isExpaned && (
        <View style={styles.sectionContent}>
          {additionalData?.length ? (
            additionalData.map((item, index) => {
              const tourGuide = item.usersInvited.find(
                (u) => u.role === 'TOUR_GUIDE'
              );
              const driver = item.usersInvited.find((u) => u.role === 'DRIVER');
              return (
                <View key={item.id}>
                  {index > 0 && <View style={styles.groupDivider} />}
                  <View style={styles.groupContainer}>
                    <PressableOpacity
                      style={styles.editButton}
                      onPress={() => handleOpenEditModal(item)}
                      hitSlop={6}
                    >
                      <AntDesign name="edit" size={20} color={COLORS.vinaupTeal} />
                    </PressableOpacity>
                    {renderUserRow(tourGuide, 'Hướng dẫn viên')}
                    {renderUserRow(driver, 'Tài xế')}
                    <View style={styles.memberRow}>
                      <View style={styles.positionCircle}>
                        <Text style={styles.positionText}>
                          {String(item.position).padStart(2, '0')}
                        </Text>
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>
                          {item.carName || 'Chưa có tên xe'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.placeholderText}>Chưa có dữ liệu</Text>
          )}
        </View>
      )}
      <TourImplementationAdditionalEditModal
        modalRef={editModalRef}
        selectedItem={selectedItem}
        allAdditionalData={additionalData}
        isLoading={isConfirming}
        onConfirm={handleConfirmEdit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.vinaupLightGreen,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 17,
    color: COLORS.vinaupBlack,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expandToggle: {
    width: 26,
    height: 26,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.vinaupYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  groupDivider: {
    height: 1,
    backgroundColor: COLORS.vinaupLightGray,
    marginVertical: 4,
  },
  groupContainer: {},
  editButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.vinaupLightGray,
  },
  positionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.vinaupYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
    fontWeight: 'bold',
  },
  memberInfo: {},
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontSize: 15,
    color: COLORS.vinaupTeal,
  },
  infoBottom: {
    fontSize: 15,
    color: COLORS.vinaupDarkGray,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
  },
});
