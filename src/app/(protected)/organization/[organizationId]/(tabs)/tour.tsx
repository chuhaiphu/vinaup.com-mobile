import { useLocalSearchParams } from 'expo-router';
import { OrganizationTourListContent } from '@/components/contents/tour/organization-tour-list-content';

export default function OrganizationTourScreen() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;

  return <OrganizationTourListContent organizationId={organizationId} />;
}
