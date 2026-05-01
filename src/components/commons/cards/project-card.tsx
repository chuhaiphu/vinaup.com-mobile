import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ProjectStatusDisplay } from '@/constants/project-constants';
import { generateDateRange } from '@/utils/generator/string-generator/generate-date-range';
import { generateLocalePriceFormat } from '@/utils/generator/string-generator/generate-locale-price-format';
import { useState } from 'react';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';

interface ProjectCardProps {
  project?: ProjectResponse;
  onPress?: () => void;
  totalRemaining?: number;
}

export function ProjectCard({ project, onPress, totalRemaining }: ProjectCardProps) {
  const [isShowingPrice, setIsShowingPrice] = useState(false);

  const getProjectInfoText = () => {
    if (!project) return '';
    if (project.organizationId) {
      return `${project.organization?.name || ''}`;
    }
    return `${project.externalOrganizationName || ''}`;
  };

  const togglePrice = () => {
    setIsShowingPrice(!isShowingPrice);
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.innerHeader}>
        <View style={styles.left}>
          <Text style={styles.projectDateRangeText}>
            {generateDateRange(project.startDate, project.endDate)}
          </Text>
          <PressableOpacity onPress={togglePrice}>
            <Text
              style={[
                styles.equalSignText,
                isShowingPrice && styles.equalSignActive,
              ]}
            >
              =
            </Text>
          </PressableOpacity>
          {isShowingPrice && (
            <Text style={styles.projectTotalAmountText}>
              {generateLocalePriceFormat(totalRemaining ?? 0, 'vi-VN')}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.projectStatusText}>
            {ProjectStatusDisplay[project.status]}
          </Text>
        </View>
      </View>
      <Pressable onPress={onPress}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.descriptionText}>{project.description}</Text>
            </View>
            <View>
              {project.code && (
                <Text style={styles.codeText}>{project.code}</Text>
              )}
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {getProjectInfoText()}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  innerHeader: {
    marginVertical: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  right: {},
  projectDateRangeText: {
    fontSize: 15
  },
  projectTotalAmountText: {
    fontSize: 16,
    flexShrink: 0,
  },
  projectStatusText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  equalSignText: {
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: COLORS.vinaupTeal,
    backgroundColor: COLORS.vinaupWhite,
    overflow: 'hidden',
  },
  equalSignActive: {
    backgroundColor: 'transparent',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  codeText: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray
  },
});
