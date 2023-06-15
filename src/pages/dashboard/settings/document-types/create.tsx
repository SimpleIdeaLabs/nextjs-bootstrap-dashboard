import { authenticatedRequest } from '../../../../utils/axios-util';
import DocumentTypesForm from '../../../../components/dashboard/settings/document-types/document-types-form';
import DashboardLayout from '../../../../layouts/dashboard-layout';

export default function CreateDocumentTypePage() {
  async function handleCreateDocumentType(payload: { name: string; fileTypes: string[] }) {
    const {
      data: { status, message },
    } = await authenticatedRequest.post('/document-type', payload);
    if (!status) {
      throw new Error(message);
    }
  }

  return (
    <DashboardLayout>
      <DocumentTypesForm mode="create" handleOnFormSubmit={handleCreateDocumentType} />
    </DashboardLayout>
  );
}
