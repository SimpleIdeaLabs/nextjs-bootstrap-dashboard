import { authenticatedRequest } from '../../../../utils/axios-util';
import DocumentTypesForm from '../../../../components/dashboard/settings/document-types/document-types-form';
import _ from 'lodash';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../layouts/dashboard-layout';

interface UpdateDocumentTypePageProps {
  documentTypeId: any;
}

export default function UpdateDocumentTypePage(props: UpdateDocumentTypePageProps) {
  const router = useRouter();

  const documentTypeId = _.get(router, 'query.documentTypeId', null);

  async function handleUpdateDocumentType(payload: { name: string; fileTypes: string[] }) {
    const {
      data: { status, message },
    } = await authenticatedRequest.patch(`/document-type/${documentTypeId}`, payload);
    if (!status) {
      throw new Error(message);
    }
  }

  return (
    <DashboardLayout>
      <DocumentTypesForm mode="edit" documentTypeId={documentTypeId} handleOnFormSubmit={handleUpdateDocumentType} />
    </DashboardLayout>
  );
}
