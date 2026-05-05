import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteProjectApi,
  getProjectByIdApi,
  updateProjectApi,
} from '@/apis/project/project';
import {
  ProjectResponse,
  UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import { useRouter } from 'expo-router';
interface PersonalProjectDetailContextType {
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
  handleDelete: (onStart?: () => void, onFinish?: () => void) => void;
  refreshProject: () => void;
}

const PersonalProjectDetailContext =
  createContext<PersonalProjectDetailContextType | null>(null);

export function usePersonalProjectDetailContext() {
  const ctx = useContext(PersonalProjectDetailContext);
  if (!ctx)
    throw new Error(
      'usePersonalProjectDetailContext must be used within PersonalProjectDetailProvider'
    );
  return ctx;
}

export function PersonalProjectDetailProvider({
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
    fetchKey: `personal-project-${projectId}`,
    tags: [`personal-project-${projectId}`],
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
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [project, updateProject]
  );

  const handleDelete = useCallback((onStart?: () => void, onFinish?: () => void) => {
    if (!projectId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          onStart?.();
          deleteProject({
            onSuccess: () => {
              onFinish?.();
              router.back();
            },
            onError: (error: ApiError) => {
              onFinish?.();
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  }, [projectId, deleteProject, router]);

  return (
    <PersonalProjectDetailContext
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
    </PersonalProjectDetailContext>
  );
}
