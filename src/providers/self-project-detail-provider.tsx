import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteProjectApi,
  getProjectByIdApi,
  updateProjectApi,
} from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';
import {
  ProjectResponse,
  UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useRouter } from 'expo-router';

interface SelfProjectDetailContextType {
  projectId: string;
  project: ProjectResponse | undefined;
  isLoadingProject: boolean;
  isRefreshingProject: boolean;
  isUpdatingProject: boolean;
  isDeletingProject: boolean;
  receiptPayments: ReceiptPaymentResponse[];
  isLoadingReceiptPayments: boolean;
  isRefreshingReceiptPayments: boolean;
  handleUpdateProject: (
    fields: UpdateProjectRequest,
    onSuccess?: () => void
  ) => void;
  handleDelete: () => void;
  refreshProject: () => void;
  refreshReceiptPayments: () => void;
}

const SelfProjectDetailContext = createContext<SelfProjectDetailContextType | null>(
  null
);

export function useSelfProjectDetailContext() {
  const ctx = useContext(SelfProjectDetailContext);
  if (!ctx)
    throw new Error(
      'useSelfProjectDetailContext must be used within SelfProjectDetailProvider'
    );
  return ctx;
}

export function SelfProjectDetailProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    data: project,
    isLoading: isLoadingProject,
    isRefreshing: isRefreshingProject,
    executeFetchFn: fetchProject,
    refreshFetchFn: refreshProject,
  } = useFetchFn(() => getProjectByIdApi(projectId), {
    fetchKey: `project-${projectId}`,
    tags: [`project-self-${projectId}`],
  });

  const { executeMutationFn: updateProject, isMutating: isUpdatingProject } =
    useMutationFn(
      (updatedFields: UpdateProjectRequest) =>
        updateProjectApi(projectId, updatedFields),
      { invalidatesTags: ['personal-project-list'] }
    );

  const { executeMutationFn: deleteProject, isMutating: isDeletingProject } =
    useMutationFn(() => deleteProjectApi(projectId), {
      invalidatesTags: ['personal-project-list'],
    });

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn(() => getReceiptPaymentsByProjectIdApi(projectId), {
    tags: [`receipt-payment-list-in-project-${projectId}`],
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchReceiptPayments();
    }
  }, [projectId, fetchProject, fetchReceiptPayments]);

  const handleUpdateProject = useCallback(
    (updatedFields: UpdateProjectRequest, onSuccessCallback?: () => void) => {
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
    },
    [project, updateProject, refreshProject]
  );

  const handleDelete = useCallback(() => {
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
  }, [projectId, deleteProject, router]);

  return (
    <SelfProjectDetailContext
      value={{
        projectId,
        project: project ?? undefined,
        isLoadingProject,
        isRefreshingProject,
        isUpdatingProject,
        isDeletingProject,
        receiptPayments: receiptPayments ?? [],
        isLoadingReceiptPayments,
        isRefreshingReceiptPayments,
        handleUpdateProject,
        handleDelete,
        refreshProject,
        refreshReceiptPayments,
      }}
    >
      {children}
    </SelfProjectDetailContext>
  );
}
