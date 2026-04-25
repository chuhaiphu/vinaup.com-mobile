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
import { Feather } from '@expo/vector-icons';
import VinaupExpand from '@/components/icons/vinaup-expand.native';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useMutationFn, type ApiError } from 'fetchwire';
import {
  TourImplementationAdditionalEditModal,
  AdditionalEditFormData,
} from '@/components/modals/tour-implementation-additional-edit-modal/tour-implementation-additional-edit-modal';
import { Avatar } from '@/components/primitives/avatar';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';
import { Button } from '@/components/primitives/button';

interface Props {
  tourImplementationId: string | undefined;
  additionalData: TourImplementationAdditionalDataResponse[] | undefined;
  onRefreshTourImplementation: () => void;
}

export default function TourImplementationAdditionalContent({
  tourImplementationId,
  additionalData,
  onRefreshTourImplementation,
}: Props) {
  const [isExpaned, setIsExpaned] = useState(true);
  const [selectedItem, setSelectedItem] =
    useState<TourImplementationAdditionalDataResponse | null>(null);
  const editModalRef = useRef<SlideSheetRef>(null);

  const { executeMutationFn: createAdditionalData, isMutating: isCreating } =
    useMutationFn(() => createAdditionalDataApi(tourImplementationId ?? ''));

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
    }) => updateAdditionalDataApi(id, data)
  );

  const {
    executeMutationFn: updateTourGuideInvited,
    isMutating: isUpdatingTourGuide,
  } = useMutationFn(
    ({ id, data }: { id: string; data: UpdateUserInvitedRequest }) =>
      updateUserInvitedApi(id, data)
  );

  const { executeMutationFn: updateDriverInvited, isMutating: isUpdatingDriver } =
    useMutationFn(
      ({ id, data }: { id: string; data: UpdateUserInvitedRequest }) =>
        updateUserInvitedApi(id, data)
    );

  const isConfirming =
    isUpdatingAdditional || isUpdatingTourGuide || isUpdatingDriver;

  const handleAddGroup = () => {
    if (!tourImplementationId || isCreating) return;
    createAdditionalData({
      onSuccess: (newItem) => {
        onRefreshTourImplementation();
        setSelectedItem(newItem);
        editModalRef.current?.open();
      },
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
        onRefreshTourImplementation();
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
          permissions: data.tourGuide.permissions,
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PressableOpacity onPress={() => setIsExpaned(!isExpaned)} hitSlop={8}>
            <VinaupExpand
              width={16}
              height={16}
              color={isExpaned ? 'gray' : COLORS.vinaupTeal}
            />
          </PressableOpacity>
          <Text style={styles.sectionTitle}>HDV & Tài xế & Xe</Text>
        </View>
        <Button onPress={handleAddGroup} hitSlop={4} isLoading={isCreating}>
          <Feather name="user-plus" size={22} color={COLORS.vinaupTeal} />
        </Button>
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
                      <VinaupPenLine height={18} width={18} />
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
        onRefreshTourImplementation={onRefreshTourImplementation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    backgroundColor: COLORS.vinaupWhite,
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
    borderColor: COLORS.vinaupTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontSize: 16,
    color: COLORS.vinaupOrange,
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
  collapsedBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
});
