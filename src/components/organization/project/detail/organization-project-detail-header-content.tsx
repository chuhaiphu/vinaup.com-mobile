import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import { OrganizationProjectInfoModal } from '@/components/organization/project/modals/organization-project-info-modal/organization-project-info-modal';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';
import { useOrganizationProjectDetailContext } from '@/providers/organization-project-detail-provider';

export function OrganizationProjectDetailHeaderContent() {
  const { project, isUpdatingProject, isRefreshingProject, handleUpdateProject } =
    useOrganizationProjectDetailContext();
  const modalRef = useRef<SlideSheetRef>(null);
  const isLoading = isUpdatingProject || isRefreshingProject;

  if (!project) {
    return (
      <View>
        <Text>Không có dữ liệu</Text>
      </View>
    );
  }

  const handleOpen = () => {
    modalRef.current?.open();
  };

  const getDateRangeText = () => {
    const start = dayjs(project.startDate);
    const end = dayjs(project.endDate);

    if (start.isSame(end, 'day')) {
      return (
        <>
          <Text style={styles.dateText}>Ngày {start.format('DD/MM')} </Text>
          <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        </>
      );
    }
    return (
      <>
        <Text style={styles.dateText}>Từ {start.format('DD/MM')} </Text>
        <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        <Text style={styles.dateText}> đến {end.format('DD/MM')}</Text>
        <Text style={styles.hourText}> ({end.format('HH:mm')})</Text>
      </>
    );
  };

  return (
    <>
      <PressableCard
        onPress={handleOpen}
        style={{
          container: styles.cardContainer,
          card: styles.card,
        }}
      >
        <View style={styles.leftInfo}>
          <Text style={styles.entityName}>Tên: {project.description}</Text>
          {project.code ? (
            <Text style={styles.codeText}>Mã: {project.code}</Text>
          ) : null}
          <View style={styles.dateRow}>{getDateRangeText()}</View>
        </View>
        <View style={styles.rightInfo}>
          <View style={styles.editButton}>
            <VinaupPenLineVariant width={16} height={16} />
          </View>
        </View>
      </PressableCard>

      <OrganizationProjectInfoModal
        project={project}
        isLoading={isLoading}
        modalRef={modalRef}
        onConfirm={(data, onSuccessCallback) =>
          handleUpdateProject(data, onSuccessCallback)
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {},
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  leftInfo: {
    flex: 1,
    gap: 8,
  },
  rightInfo: {
    alignItems: 'flex-end',
    gap: 8,
  },
  entityName: {
    fontSize: 16,
    fontWeight: '700',
  },
  codeText: {
    fontSize: 16,
    color: COLORS.vinaupMediumDarkGray,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateText: {
    color: COLORS.vinaupMediumDarkGray,
    fontSize: 16,
  },
  hourText: {
    color: COLORS.vinaupMediumDarkGray,
    fontSize: 16,
  },
  editButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: COLORS.vinaupYellow,
  },
});
