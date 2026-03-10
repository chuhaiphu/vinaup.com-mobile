import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn } from '@/hooks/use-fetch-fn';
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
import { ReceiptPaymentProjectList } from '@/components/cards/receipt-payment-project-list';
import Loader from '@/components/primitives/loader';
import { useMutationFn } from '@/hooks/use-mutation-fn';
import { Select } from '@/components/primitives/select';
import { ProjectStatus, ProjectStatusOptions } from '@/constants/project-constants';
import { ProjectDetailFooterContent } from '@/components/contents/project-detail-footer-content';
import { COLORS } from '@/constants/style-constant';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const {
    data: project,
    isLoading,
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

  const handleSaveAndExit = () => {};

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
              router.back();
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
    if (isLoading || !project) {
      return '';
    }
    return project.type === 'SELF' ? 'Chi tiết tiền công' : 'Chi tiết dự án';
  };

  if (isLoading) {
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
              isLoading={isUpdatingProject}
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
          isLoading={isUpdatingProject}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateProject(data, onSuccessCallback)
          }
        />
        {project && (
          <ReceiptPaymentProjectList
            onRefresh={() => {
              refreshProject();
              refreshReceiptPayments();
            }}
            receiptPayments={receiptPayments ?? []}
            startDate={project.startDate}
            endDate={project.endDate}
            loading={isLoadingReceiptPayments}
            projectId={projectId}
          />
        )}
        <ProjectDetailFooterContent
          project={project ?? undefined}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateProject(data, onSuccessCallback)
          }
          isLoading={isUpdatingProject}
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
