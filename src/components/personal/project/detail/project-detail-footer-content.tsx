import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import { ProjectOrgCustomerEditModal } from '@/components/personal/project/modals/project-org-customer-edit-modal/project-org-customer-edit-modal';
import { SimpleTextInputModal } from '@/components/commons/modals/simple-text-input-modal/simple-text-input-modal';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';
import {
  ProjectResponse,
  UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';

interface ProjectDetailFooterContentProps {
  project?: ProjectResponse;
  onConfirm?: (data: UpdateProjectRequest, onSuccessCallback?: () => void) => void;
  isLoading?: boolean;
}

export function ProjectDetailFooterContent({
  project,
  onConfirm,
  isLoading = false,
}: ProjectDetailFooterContentProps) {
  const organizationName = project?.externalOrganizationName ?? '';
  const customerName = project?.externalCustomerName ?? '';
  const note = project?.note ?? '';

  const orgModalRef = useRef<SlideSheetRef | null>(null);
  const noteModalRef = useRef<SlideSheetRef | null>(null);

  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={() => noteModalRef.current?.open()}
        disabled={isLoading}
      >
        <VinaupInfoNote width={22} height={22} color={COLORS.vinaupTeal} />
        <Text style={styles.noteValue} numberOfLines={2} ellipsizeMode="tail">
          {note || 'Ghi chú'}
        </Text>
        <VinaupPenLine width={16} height={16} color={COLORS.vinaupTeal} />
      </Pressable>

      <PressableCard
        onPress={() => orgModalRef.current?.open()}
        disabled={isLoading}
        style={{
          container: styles.cardContainer,
          card: styles.card,
        }}
      >
        <View style={styles.rowsNew}>
          <View style={styles.orgCol}>
            <Text style={styles.label}>Tổ chức:</Text>
            <Text style={[styles.value, styles.valueLeft]}>
              {organizationName || ''}
            </Text>
          </View>
          <View style={styles.customerCol}>
            <Text style={styles.label}>Khách hàng:</Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.value, styles.valueRight]}
            >
              {customerName || ''}
            </Text>
          </View>
        </View>
      </PressableCard>

      <ProjectOrgCustomerEditModal
        organizationName={organizationName}
        customerName={customerName}
        isLoading={isLoading}
        modalRef={orgModalRef}
        onConfirm={(orgName, cusName, onSuccessClose) => {
          onConfirm?.(
            { externalOrganizationName: orgName, externalCustomerName: cusName },
            onSuccessClose
          );
        }}
      />

      <SimpleTextInputModal
        value={note}
        isLoading={isLoading}
        modalRef={noteModalRef}
        onConfirm={(noteValue: string, onSuccessClose?: () => void) => {
          onConfirm?.({ note: noteValue }, onSuccessClose);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  rowsNew: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orgCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  customerCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  valueLeft: {
    textAlign: 'left',
  },
  valueRight: {
    textAlign: 'right',
  },
  value: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
    marginTop: 2,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  noteValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
});
