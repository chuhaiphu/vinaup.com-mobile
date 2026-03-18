import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import dayjs from 'dayjs';
import { ProjectStatusDisplay } from '@/constants/project-constants';
import { useFetchFn } from 'fetchwire';
import { useEffect, useState } from 'react';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { useSafeRouter } from '@/hooks/use-safe-router';
import { PressableOpacity } from '../primitives/pressable-opacity';

interface ProjectCardProps {
  project?: ProjectResponse;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const safeRouter = useSafeRouter();

  const [isShowingPrice, setIsShowingPrice] = useState(false);
  const fetchReceiptPaymentsFn = () =>
    getReceiptPaymentsByProjectIdApi(project?.id || '');

  const { data: receiptPayments, executeFetchFn: fetchReceiptPayments } =
    useFetchFn(fetchReceiptPaymentsFn, {
      tags: ['personal-receipt-payment-list-in-project'],
    });

  useEffect(() => {
    if (project?.id) {
      fetchReceiptPayments();
    }
  }, [project, fetchReceiptPayments]);

  const getProjectInfoText = () => {
    if (!project) return '';
    if (project.type === 'SELF' || project.type === 'COMPANY') {
      return `${project.externalOrganizationName || ''}`;
    }
    return `${project.organization?.name || ''}`;
  };

  const getProjectDateRangeText = () => {
    if (!project) return '';
    if (
      dayjs(project.startDate).format('DD/MM') ===
      dayjs(project.endDate).format('DD/MM')
    ) {
      return dayjs(project.startDate).format('DD/MM');
    }
    return `${dayjs(project.startDate).format('DD/MM')} - ${dayjs(
      project.endDate
    ).format('DD/MM')}`;
  };

  const togglePrice = () => {
    setIsShowingPrice(!isShowingPrice);
  };

  const navigateToDetail = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    if (id) {
      safeRouter.safePush({
        pathname: '/(protected)/project-detail/[projectId]',
        params: { projectId: id },
      });
    }
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
            {getProjectDateRangeText()}
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
              {generateLocalePriceFormat(
                calculateReceiptPaymentsSummary(receiptPayments || [])
                  .totalRemaining,
                'vi-VN'
              )}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.projectStatusText}>
            {ProjectStatusDisplay[project.status]}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => navigateToDetail(project.id)}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{project.description}</Text>
            </View>
            <View style={styles.action}>
              {/* <VinaupPenLine width={20} height={20} /> */}
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
  },
  innerHeader: {
    marginVertical: 8,
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
    fontSize: 16,
    fontWeight: '600',
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
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    // Android Shadow
    elevation: 2,
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
  descriptionContainer: {},
  descriptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  action: {},
});
