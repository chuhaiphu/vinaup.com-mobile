import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteProjectApi,
  getProjectByIdApi,
  updateProjectApi,
} from '@/apis/project-apis';
import {
  ProjectResponse,
  UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import { useRouter } from 'expo-router';

interface CompanyProjectDetailContextType {
  projectId: string;
  project: ProjectResponse | undefined;
  isLoadingProject: boolean;
  isRefreshingProject: boolean;
  isUpdatingProject: boolean;
  isDeletingProject: boolean;
  handleUpdateProject: (
    fields: UpdateProjectRequest,
    onSuccess?: () => void
  ) => void;
  handleDelete: () => void;
  refreshProject: () => void;
}

const CompanyProjectDetailContext =
  createContext<CompanyProjectDetailContextType | null>(null);

export function useCompanyProjectDetailContext() {
  const ctx = useContext(CompanyProjectDetailContext);
  if (!ctx)
    throw new Error(
      'useCompanyProjectDetailContext must be used within CompanyProjectDetailProvider'
    );
  return ctx;
}

export function CompanyProjectDetailProvider({
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
    fetchKey: `personal-project-company-${projectId}`,
    tags: [`personal-project-company-${projectId}`],
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

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

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
    <CompanyProjectDetailContext
      value={{
        projectId,
        project: project ?? undefined,
        isLoadingProject,
        isRefreshingProject,
        isUpdatingProject,
        isDeletingProject,
        handleUpdateProject,
        handleDelete,
        refreshProject,
      }}
    >
      {children}
    </CompanyProjectDetailContext>
  );
}
