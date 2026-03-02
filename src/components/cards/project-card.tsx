import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import dayjs from 'dayjs';
import { ProjectStatusDisplay } from '@/constants/project-constants';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useEffect } from 'react';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';

interface ProjectCardProps {
  project?: ProjectResponse;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { data: receiptPayments, executeFetchFn: fetchReceiptPayments } =
    useFetchFn<ReceiptPaymentResponse[]>();

  useEffect(() => {
    fetchReceiptPayments(() => getReceiptPaymentsByProjectIdApi(project?.id || ''));
  }, [project, fetchReceiptPayments]);

  const getProjectInfoText = () => {
    if (!project) return '';
    if (project.type === 'SELF' || project.type === 'COMPANY') {
      return `${project.externalCustomerName || ''} - ${project.externalOrganizationName || ''}`;
    }
    return `${project.organization?.name || ''} - ${project.organizationCustomer?.name || ''}`;
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
          <Text>=</Text>
          <Text style={styles.projectTotalAmountText}>
            {calculateReceiptPaymentsSummary(receiptPayments || []).totalRemaining}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.projectStatusText}>
            {ProjectStatusDisplay[project.status]}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
          <View style={styles.action}>
            {/* <VinaupPenLine width={20} height={20} /> */}
          </View>
        </View>
        <View style={styles.projectInfoRow}>
          <Text style={styles.infoText}>{getProjectInfoText()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  innerHeader: {
    marginBottom: 8,
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
  },
  projectStatusText: {
    fontSize: 14,
    color: COLORS.vinaupTeal,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
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
  projectInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  descriptionContainer: {},
  descriptionText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  action: {},
});
