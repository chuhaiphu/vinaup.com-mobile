import { View, StyleSheet, Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { UpdateProjectRequest } from '@/interfaces/project-interfaces';
import {
  deleteProjectApi,
  getProjectByIdApi,
  updateProjectApi,
} from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';
import { ProjectDetailHeaderContent } from '@/components/contents/project/project-detail-header-content';
import { ReceiptPaymentProjectListContent } from '@/components/contents/project/receipt-payment-project-list-content';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { ProjectStatus, ProjectStatusOptions } from '@/constants/project-constants';
import { ProjectDetailFooterContent } from '@/components/contents/project/project-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const fetchProjectFn = () => getProjectByIdApi(projectId);
  const {
    data: project,
    isLoading: isLoadingProject,
    isRefreshing: isRefreshingProject,
    executeFetchFn: fetchProject,
    refreshFetchFn: refreshProject,
  } = useFetchFn(fetchProjectFn);

  const updateProjectFn = (updatedFields: UpdateProjectRequest) =>
    updateProjectApi(projectId, updatedFields);

  const { executeMutationFn: updateProject, isMutating: isUpdatingProject } =
    useMutationFn(updateProjectFn, {
      invalidatesTags: ['personal-project-list'],
    });

  const deleteProjectFn = () => deleteProjectApi(projectId);
  const { executeMutationFn: deleteProject, isMutating: isDeletingProject } =
    useMutationFn(deleteProjectFn, {
      invalidatesTags: ['personal-project-list'],
    });

  const fetchReceiptPaymentsFn = () => getReceiptPaymentsByProjectIdApi(projectId);
  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn(fetchReceiptPaymentsFn, {
    tags: ['personal-receipt-payment-list-in-project'],
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchReceiptPayments();
    }
  }, [projectId, fetchProject, fetchReceiptPayments]);

  const handleSaveAndExit = () => {
    if (!project) return;
    refreshProject();
    refreshReceiptPayments();
    router.back();
  };

  const handleUpdateProject = (
    updatedFields: UpdateProjectRequest,
    onSuccessCallback?: () => void
  ) => {
    if (!project) return;
    updateProject(updatedFields, {
      onSuccess: () => {
        refreshProject();
        onSuccessCallback?.();
      },
      onError: (error: ApiError) => {
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
          deleteProject({
            onSuccess: () => {
              router.back();
            },
            onError: (error: ApiError) => {
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
