import { useLocalSearchParams } from 'expo-router';
import {
  PersonalProjectDetailProvider,
} from '@/providers/personal-project-detail-provider';
import {
  OrganizationProjectDetailProvider,
} from '@/providers/organization-project-detail-provider';
import { PersonalProjectDetailContent } from '@/components/contents/project/personal-project-detail-content';
import { OrganizationProjectDetailContent } from '@/components/contents/project/organization-project-detail-content';

export default function ProjectDetailScreen() {
  const { projectId, organizationId } = useLocalSearchParams<{
    projectId: string;
    organizationId?: string;
  }>();

  if (organizationId) {
    return (
      <OrganizationProjectDetailProvider projectId={projectId}>
        <OrganizationProjectDetailContent />
      </OrganizationProjectDetailProvider>
    );
  }

  return (
    <PersonalProjectDetailProvider projectId={projectId}>
      <PersonalProjectDetailContent />
    </PersonalProjectDetailProvider>
  );
}
