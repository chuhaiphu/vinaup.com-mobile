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
import { useNavigationStore } from '@/hooks/use-navigation-store';

interface OrganizationProjectDetailContextType {
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

const OrganizationProjectDetailContext =
  createContext<OrganizationProjectDetailContextType | null>(null);

export function useOrganizationProjectDetailContext() {
  const ctx = useContext(OrganizationProjectDetailContext);
  if (!ctx)
    throw new Error(
      'useOrganizationProjectDetailContext must be used within OrganizationProjectDetailProvider'
    );
  return ctx;
}

export function OrganizationProjectDetailProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const {
    data: project,
    isLoading: isLoadingProject,
    isRefreshing: isRefreshingProject,
    executeFetchFn: fetchProject,
    refreshFetchFn: refreshProject,
  } = useFetchFn(() => getProjectByIdApi(projectId), {
    fetchKey: `organization-project-${projectId}`,
    tags: [`organization-project-${projectId}`],
  });

  const { executeMutationFn: updateProject, isMutating: isUpdatingProject } =
    useMutationFn(
      (updatedFields: UpdateProjectRequest) =>
        updateProjectApi(projectId, updatedFields),
      { invalidatesTags: ['organization-project-list', `organization-project-${projectId}`] }
    );

  const { executeMutationFn: deleteProject, isMutating: isDeletingProject } =
    useMutationFn(() => deleteProjectApi(projectId), {
      invalidatesTags: ['organization-project-list'],
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
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [project, updateProject]
  );

  const handleDelete = useCallback(() => {
    if (!projectId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          setIsNavigating(true);
          deleteProject({
            onSuccess: () => {
              setIsNavigating(false);
              router.back();
            },
            onError: (error: ApiError) => {
              setIsNavigating(false);
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  }, [projectId, deleteProject, router, setIsNavigating]);

  return (
    <OrganizationProjectDetailContext
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
    </OrganizationProjectDetailContext>
  );
}
