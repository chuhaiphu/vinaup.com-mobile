import { Suspense } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/commons/headers/stack-with-header';
import { ReceiptPaymentProjectListContent } from '@/components/commons/receipt-payment-project-list-content';
import { Select } from '@/components/primitives/select';
import { ProjectStatus, ProjectStatusOptions } from '@/constants/project-constants';
import { COLORS } from '@/constants/style-constant';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { useOrganizationProjectDetailContext } from '@/providers/organization-project-detail-provider';
import { useNavigationStore } from '@/hooks/use-navigation-store';
import { EntityListSectionSkeleton } from '@/components/commons/skeletons/entity-list-section-skeleton';
import { OrganizationProjectDetailHeaderContent } from './organization-project-detail-header-content';
import { OrganizationProjectDetailFooterContent } from './organization-project-detail-footer-content';

export function OrganizationProjectDetailContent() {
  const {
    projectId,
    project,
    isUpdatingProject,
    isRefreshingProject,
    isDeletingProject,
    handleUpdateProject,
    handleDelete,
    refreshProject,
  } = useOrganizationProjectDetailContext();
  const router = useRouter();
  const setIsNavigating = useNavigationStore((s) => s.setIsNavigating);

  function handleDeleteProject() {
    return handleDelete(() => setIsNavigating(true), () => setIsNavigating(false));
  }

  const handleSaveAndExit = () => {
    if (!project) return;
    refreshProject();
    router.back();
  };

  return (
    <>
      <StackWithHeader
        title="Chi tiết Dự án"
        onDelete={handleDeleteProject}
        isDeleting={isDeletingProject}
        onSave={handleSaveAndExit}
      />
      <View style={styles.container}>
        <View style={styles.projecttopContainer}>
          <View style={styles.statusFilter}>
            <Select
              renderTrigger={(option) => (
                <>
                  <VinaupVerticalExpandArrow width={18} height={18} />
                  <Text style={{ color: COLORS.vinaupTeal }}>
                    {option.label || 'Trạng thái'}
                  </Text>
                </>
              )}
              isLoading={isUpdatingProject || isRefreshingProject}
              options={ProjectStatusOptions}
              value={project?.status || ''}
              onChange={(value) =>
                handleUpdateProject({ status: value as ProjectStatus })
              }
              placeholder="Trạng thái"
              style={{
                triggerText: {
                  fontSize: 16,
                  color: COLORS.vinaupTeal,
                },
              }}
            />
          </View>
        </View>
        <OrganizationProjectDetailHeaderContent />
        {project && (
          <Suspense fallback={<EntityListSectionSkeleton />}>
            <ReceiptPaymentProjectListContent
              key={`receipt-payment-list-in-project-${projectId}`}
              projectId={projectId}
              startDate={project.startDate}
              endDate={project.endDate}
              onRefresh={refreshProject}
            />
          </Suspense>
        )}
        <OrganizationProjectDetailFooterContent />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projecttopContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
