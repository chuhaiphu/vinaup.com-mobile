import { useLocalSearchParams } from 'expo-router';
import {
  PersonalProjectDetailProvider,
} from '@/providers/personal-project-detail-provider';
import {
  OrganizationProjectDetailProvider,
  useOrganizationProjectDetailContext,
} from '@/providers/organization-project-detail-provider';
import { PersonalProjectDetailContent } from '@/components/personal/project/detail/personal-project-detail-content';
import { OrganizationProjectDetailContent } from '@/components/organization/project/detail/organization-project-detail-content';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';

function OrganizationProjectWithCustomers() {
  const { project } = useOrganizationProjectDetailContext();
  return (
    <OrganizationCustomerProvider organizationId={project?.organization?.id}>
      <OrganizationProjectDetailContent />
    </OrganizationCustomerProvider>
  );
}

export default function ProjectDetailScreen() {
  const { projectId, organizationId } = useLocalSearchParams<{
    projectId: string;
    organizationId?: string;
  }>();

  if (organizationId) {
    return (
      <OrganizationProjectDetailProvider projectId={projectId}>
        <OrganizationProjectWithCustomers />
      </OrganizationProjectDetailProvider>
    );
  }

  return (
    <PersonalProjectDetailProvider projectId={projectId}>
      <PersonalProjectDetailContent />
    </PersonalProjectDetailProvider>
  );
}
