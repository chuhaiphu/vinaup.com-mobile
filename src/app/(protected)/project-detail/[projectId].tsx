import { View, StyleSheet, Alert, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn } from 'fetchwire';
import {
  ProjectResponse,
  UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import {
  deleteProjectApi,
  getProjectByIdApi,
  updateProjectApi,
} from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { ProjectDetailHeaderContent } from '@/components/contents/project-detail-header-content';
import { ReceiptPaymentProjectListContent } from '@/components/contents/receipt-payment-project-list-content';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { ProjectStatus, ProjectStatusOptions } from '@/constants/project-constants';
import { ProjectDetailFooterContent } from '@/components/contents/project-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';

export default function ProjectDetailScreen() {
  const safeRouter = useSafeRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const {
    data: project,
    isLoading: isLoadingProject,
    isRefreshing: isRefreshingProject,
    executeFetchFn: fetchProject,
    refreshFetchFn: refreshProject,
  } = useFetchFn<ProjectResponse>({});

  const { executeMutationFn: updateProject, isMutating: isUpdatingProject } =
    useMutationFn<ProjectResponse>({
      invalidatesTags: ['personal-project-list'],
    });
  const { executeMutationFn: deleteProject, isMutating: isDeletingProject } =
    useMutationFn<null>({
      invalidatesTags: ['personal-project-list'],
    });

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn<ReceiptPaymentResponse[]>({
    tags: ['personal-receipt-payment-list-in-project'],
  });

  useEffect(() => {
    if (projectId) {
      fetchProject(() => getProjectByIdApi(projectId));
      fetchReceiptPayments(() => getReceiptPaymentsByProjectIdApi(projectId));
    }
  }, [projectId, fetchProject, fetchReceiptPayments]);

  const handleSaveAndExit = () => {
    if (!project) return;
    refreshProject();
    refreshReceiptPayments();
    safeRouter.safeBack();
  };

  const handleUpdateProject = (
    updatedFields: UpdateProjectRequest,
    onSuccessCallback?: () => void
  ) => {
    if (!project) return;
    updateProject(() => updateProjectApi(projectId, updatedFields), {
      onSuccess: () => {
        refreshProject();
        onSuccessCallback?.();
      },
      onError: (error) => {
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
      },
    });
  };

  const handleDelete = () => {
    if (!projectId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteProject(() => deleteProjectApi(projectId), {
            onSuccess: () => {
              safeRouter.safeBack();
            },
            onError: (error) => {
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  };

  const getHeaderTitle = () => {
    if (isLoadingProject || !project) {
      return '';
    }
    return project.type === 'SELF' ? 'Chi tiết Tiền công' : 'Chi tiết Dự án';
  };

  if (isLoadingProject) {
    return (
      <View>
        <Loader size={64} />
      </View>
    );
  }

  return (
    <>
      <StackWithHeader
        title={getHeaderTitle()}
        backTitle="Quay lại"
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
                  <Text>{option.label || 'Trạng thái'}</Text>
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
                  color: COLORS.vinaupBlack,
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
          <ReceiptPaymentProjectListContent
            onRefresh={() => {
              refreshProject();
              refreshReceiptPayments();
            }}
            receiptPayments={receiptPayments ?? []}
            startDate={project.startDate}
            endDate={project.endDate}
            loading={isLoadingReceiptPayments}
            refreshing={isRefreshingReceiptPayments}
            projectId={projectId}
          />
        )}
        <ProjectDetailFooterContent
          project={project ?? undefined}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateProject(data, onSuccessCallback)
          }
          isLoading={isUpdatingProject || isRefreshingProject}
        />
      </View>
    </>
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
