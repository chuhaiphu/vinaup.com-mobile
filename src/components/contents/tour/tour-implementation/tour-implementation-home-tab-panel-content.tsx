import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrgMemSelectModal } from '@/components/modals/organization-member-select-modal/org-mem-select-modal';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { getOrganizationMembersByOrganizationIdApi } from '@/apis/organization-apis';
import {
  manageMembersInChargeApi,
  getTourImplementationByTourIdApi,
  updateTourImplementationApi,
} from '@/apis/tour-apis';
import { UpdateTourImplementationRequest } from '@/interfaces/tour-implementation-interfaces';
import { useTourContext } from '@/providers/tour-provider';
import { Image } from 'expo-image';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';
import { TourImplementationTicketCountModal } from '@/components/modals/tour-implementation-ticket-count-modal/tour-implementation-ticket-count-modal';
import { TourImplementationTicketCountData } from '@/components/modals/tour-implementation-ticket-count-modal/tour-implementation-ticket-count-modal-content';
import { TourResponse } from '@/interfaces/tour-interfaces';
import { SimpleTextInputModal } from '@/components/modals/simple-text-input-modal/simple-text-input-modal';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';
import { TourDetailFooterContent } from '../tour-detail-footer-content';

interface Props {
  tour: TourResponse | undefined;
}

export function TourImplementationHomeTabPanelContent({ tour }: Props) {
  const [isOrgMemExpanded, setIsOrgMemExpanded] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const memModalRef = useRef<SlideSheetRef>(null);
  const tourTicketModalRef = useRef<SlideSheetRef>(null);
  const descriptionModalRef = useRef<SlideSheetRef>(null);

  const { isRefreshingTour, isUpdatingTour, handleUpdateTour } = useTourContext();

  const {
    data: organizationMembers,
    executeFetchFn: fetchOrganizationMembers,
    isLoading: isLoadingMembers,
  } = useFetchFn(
    () => getOrganizationMembersByOrganizationIdApi(tour?.organization?.id || ''),
    { tags: ['organization-members'] }
  );

  const {
    data: tourImplementation,
    executeFetchFn: fetchTourImplementation,
    refreshFetchFn: refreshTourImplementation,
  } = useFetchFn(() => getTourImplementationByTourIdApi(tour?.id || ''), {
    tags: [`tour-implementation-${tour?.id}`],
  });

  const { executeMutationFn: manageMembersInCharge, isMutating: isConfirming } =
    useMutationFn(
      (organizationMemberIds: string[]) =>
        manageMembersInChargeApi(tourImplementation?.id || '', {
          organizationMemberIds,
        }),
      { invalidatesTags: [`tour-implementation-${tour?.id}`] }
    );

  const {
    executeMutationFn: updateTourImplementation,
    isMutating: isUpdatingImplementation,
  } = useMutationFn(
    (data: UpdateTourImplementationRequest) =>
      updateTourImplementationApi(tourImplementation?.id || '', data),
    { invalidatesTags: [`tour-implementation-${tour?.id}`] }
  );

  useEffect(() => {
    if (tour?.id) {
      fetchTourImplementation();
    }
  }, [tour?.id, fetchTourImplementation]);

  const handleOpenMemModal = () => {
    fetchOrganizationMembers();
    memModalRef.current?.open();
  };

  const handleOpenTourTicketModal = () => {
    tourTicketModalRef.current?.open();
  };

  const handleConfirmUpdateTourTicket = (
    data: TourImplementationTicketCountData,
    onSuccessCallback?: () => void
  ) => {
    updateTourImplementation(
      {
        adultTicketCount: data.adultQuantity,
        childTicketCount: data.childQuantity,
      },
      {
        onSuccess: () => {
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      }
    );
  };

  const handleConfirmMembers = (selectedOrgMemberIds: string[]) => {
    manageMembersInCharge(selectedOrgMemberIds, {
      onSuccess: () => {
        refreshTourImplementation();
      },
      onError: () => Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật nhân sự.'),
    });
  };

  const handleOpenDescriptionModal = () => {
    descriptionModalRef.current?.open();
  };

  const handleConfirmUpdateDescription = (
    value: string,
    onSuccessCallback?: () => void
  ) => {
    updateTourImplementation(
      { description: value },
      {
        onSuccess: () => {
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      }
    );
  };

  return (
    <>
      <View style={styles.memInChargeSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nhân sự tổ chức</Text>
          <View style={styles.sectionActions}>
            <PressableOpacity onPress={handleOpenMemModal} hitSlop={4}>
              <Feather name="user-plus" size={22} color={COLORS.vinaupTeal} />
            </PressableOpacity>
            <PressableOpacity
              onPress={() => setIsOrgMemExpanded(!isOrgMemExpanded)}
              hitSlop={4}
            >
              <View style={styles.expandToggle}>
                <FontAwesome
                  name={isOrgMemExpanded ? 'caret-up' : 'caret-down'}
                  size={24}
                  color={COLORS.vinaupTeal}
                  style={isOrgMemExpanded ? { marginTop: -2 } : { marginTop: 0 }}
                />
              </View>
            </PressableOpacity>
          </View>
        </View>
        {isOrgMemExpanded && (
          <View style={styles.sectionContent}>
            {tourImplementation?.membersInCharge?.length ? (
              tourImplementation.membersInCharge.map((m) => (
                <View key={m.id} style={styles.memberRow}>
                  <Image
                    source={{
                      uri:
                        m.organizationMember?.avatarUrl || 'https://i.pravatar.cc',
                    }}
                    style={styles.memberAvatar}
                  />
                  <View style={styles.memberInfo}>
                    <View style={styles.infoTop}>
                      <Text style={styles.memberName}>
                        {m.organizationMember?.name}
                      </Text>
                      <Text style={styles.memberRole}>
                        {m.role === 'CREATOR'
                          ? 'Người tạo'
                          : m.role === 'OWNER'
                            ? 'Chủ sở hữu'
                            : 'Thành viên'}
                      </Text>
                    </View>
                    <Text style={styles.infoBottom}>
                      {m.organizationMember?.phone}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.placeholderText}>Chưa có nhân sự</Text>
            )}
          </View>
        )}
      </View>
      <TourDetailHeaderContent
        tour={tour ?? undefined}
        isLoading={isUpdatingTour || isRefreshingTour}
        onConfirm={(data, onSuccessCallback) =>
          handleUpdateTour(data, onSuccessCallback)
        }
      />
      <View style={styles.ticketSummarySection}>
        <Text style={styles.summaryText}>
          Người lớn ({tourImplementation?.adultTicketCount}) + Trẻ em (
          {tourImplementation?.childTicketCount}) ={' '}
          {(tourImplementation?.adultTicketCount ?? 0) +
            (tourImplementation?.childTicketCount ?? 0)}
        </Text>
        <View style={styles.summaryActions}>
          <PressableOpacity onPress={handleOpenTourTicketModal} hitSlop={4}>
            <AntDesign name="edit" size={22} color={COLORS.vinaupTeal} />
          </PressableOpacity>
        </View>
      </View>
      <View style={styles.descriptionSection}>
        <View style={styles.descriptionSectionHeader}>
          <Text style={styles.sectionTitle}>Nội dung bàn giao</Text>
          <View style={styles.sectionActions}>
            <PressableOpacity onPress={handleOpenDescriptionModal} hitSlop={4}>
              <VinaupPenLine width={18} height={18} color={COLORS.vinaupTeal} />
            </PressableOpacity>
            <PressableOpacity
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              hitSlop={4}
            >
              <View style={styles.expandToggle}>
                <FontAwesome
                  name={isDescriptionExpanded ? 'caret-up' : 'caret-down'}
                  size={24}
                  color={COLORS.vinaupTeal}
                  style={
                    isDescriptionExpanded ? { marginTop: -2 } : { marginTop: 0 }
                  }
                />
              </View>
            </PressableOpacity>
          </View>
        </View>
        {isDescriptionExpanded && (
          <View style={styles.descriptionSectionContent}>
            <Text
              style={
                tourImplementation?.description
                  ? styles.descriptionText
                  : styles.placeholderText
              }
            >
              {tourImplementation?.description || '...'}
            </Text>
          </View>
        )}
      </View>
      <TourDetailFooterContent />

      {/* Modals */}
      <TourImplementationTicketCountModal
        initialData={{
          adultQuantity: tourImplementation?.adultTicketCount ?? 0,
          childQuantity: tourImplementation?.childTicketCount ?? 0,
        }}
        modalRef={tourTicketModalRef}
        isLoading={isUpdatingImplementation}
        onConfirm={(data, onSuccessCallback) =>
          handleConfirmUpdateTourTicket(data, onSuccessCallback)
        }
      />
      <SimpleTextInputModal
        modalRef={descriptionModalRef}
        value={tourImplementation?.description}
        placeholder="Nhập nội dung bàn giao..."
        isLoading={isUpdatingImplementation}
        onConfirm={(value, onSuccessClose) =>
          handleConfirmUpdateDescription(value, onSuccessClose)
        }
      />
      <OrgMemSelectModal
        modalRef={memModalRef}
        organizationMembers={organizationMembers}
        membersInCharge={tourImplementation?.membersInCharge}
        isLoading={isLoadingMembers || isConfirming}
        onConfirm={handleConfirmMembers}
      />
    </>
  );
}

const styles = StyleSheet.create({
  memInChargeSection: {
    backgroundColor: COLORS.vinaupWhite,
    marginTop: 8,
    marginBottom: 1,
  },
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
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.vinaupLightGray,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 2,
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  memberName: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  memberRole: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
  },
  infoBottom: {
    fontSize: 15,
    opacity: 0.7,
  },
  ticketSummarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.vinaupWhite,
    padding: 8,
    marginVertical: 1,
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  summaryActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  placeholderText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
  },
  descriptionSection: {
    marginTop: 1,
    marginBottom: 8,
  },
  descriptionSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  descriptionSectionContent: {
    paddingHorizontal: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.vinaupBlack,
  },
});
