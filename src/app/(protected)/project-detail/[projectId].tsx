import { useLocalSearchParams } from 'expo-router';
import { ProjectType } from '@/constants/project-constants';
import {
  SelfProjectDetailProvider,
} from '@/providers/self-project-detail-provider';
import {
  CompanyProjectDetailProvider,
} from '@/providers/company-project-detail-provider';
import {
  OrganizationProjectDetailProvider,
} from '@/providers/organization-project-detail-provider';
import { SelfProjectDetailContent } from '@/components/contents/project/self-project-detail-content';
import { CompanyProjectDetailContent } from '@/components/contents/project/company-project-detail-content';
import { OrganizationProjectDetailContent } from '@/components/contents/project/organization-project-detail-content';

export default function ProjectDetailScreen() {
  const { projectId, type } = useLocalSearchParams<{
    projectId: string;
    type: ProjectType;
  }>();

  if (type === 'SELF') {
    return (
      <SelfProjectDetailProvider projectId={projectId}>
        <SelfProjectDetailContent />
      </SelfProjectDetailProvider>
    );
  }

  if (type === 'COMPANY') {
    return (
      <CompanyProjectDetailProvider projectId={projectId}>
        <CompanyProjectDetailContent />
      </CompanyProjectDetailProvider>
    );
  }

  return (
    <OrganizationProjectDetailProvider projectId={projectId}>
      <OrganizationProjectDetailContent />
    </OrganizationProjectDetailProvider>
  );
}
