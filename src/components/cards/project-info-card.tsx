import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import dayjs from 'dayjs';
import VinaupPenLineVariant from '../icons/vinaup-pen-line-variant.native';

interface ProjectInfoCardProps {
  project?: ProjectResponse;
  onEdit?: (project: ProjectResponse) => void;
}

export function ProjectInfoCard({ project, onEdit }: ProjectInfoCardProps) {
  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Không có dữ liệu</Text>
      </View>
    );
  }

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
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainInfo}>
        <View style={styles.leftInfo}>
          <Text style={styles.entityName}>Tên: {project.description}</Text>
          <View style={styles.dateRow}>{getDateRangeText()}</View>
        </View>
        <View style={styles.rightInfo}>
          <Pressable style={styles.editButton} onPress={() => onEdit?.(project)}>
            <VinaupPenLineVariant width={18} height={18} />
          </Pressable>
          <Text style={styles.entityCode}>No. {project.code.slice(0, 8)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupMediumGray,
  },
  leftInfo: {
    flex: 1,
    gap: 4,
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  entityName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
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
    color: COLORS.vinaupMediumGray,
    fontSize: 16,
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
  },
  entityCode: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
  },
});
