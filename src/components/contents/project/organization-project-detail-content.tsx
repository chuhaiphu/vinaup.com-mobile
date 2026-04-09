import { Suspense } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { ProjectDetailHeaderContent } from './project-detail-header-content';
import { ReceiptPaymentProjectListContent } from './receipt-payment-project-list-content';
import { Select } from '@/components/primitives/select';
import { ProjectStatus, ProjectStatusOptions } from '@/constants/project-constants';
import { ProjectDetailFooterContent } from './project-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { useOrganizationProjectDetailContext } from '@/providers/organization-project-detail-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';
import { UpdateProjectRequest } from '@/interfaces/project-interfaces';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';

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

  const handleSaveAndExit = () => {
    if (!project) return;
    refreshProject();
    router.back();
  };

  return (
    <OrganizationCustomerProvider organizationId={project?.organization?.id}>
      <StackWithHeader
        title="Chi tiết Dự án"
        onDelete={handleDelete}
        isDeleting={isDeletingProject}
        onSave={handleSaveAndExit}
      />
      <View style={styles.container}>
        <View style={styles.projectFilterContainer}>
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
        <ProjectDetailHeaderContent
          project={project ?? undefined}
          isLoading={isUpdatingProject || isRefreshingProject}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateProject(data, onSuccessCallback)
          }
        />
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
        <ProjectDetailFooterContent
          project={project ?? undefined}
          onConfirm={(data: UpdateProjectRequest, onSuccessCallback) =>
            handleUpdateProject(data, onSuccessCallback)
          }
          isLoading={isUpdatingProject || isRefreshingProject}
        />
      </View>
    </OrganizationCustomerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projectFilterContainer: {
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
