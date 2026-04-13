import { OrganizationProjectListContent } from '@/components/contents/project/organization-project-list-content';
import { useLocalSearchParams } from 'expo-router';

export default function OrganizationProjectScreen() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;

  return <OrganizationProjectListContent organizationId={organizationId} />;
}
