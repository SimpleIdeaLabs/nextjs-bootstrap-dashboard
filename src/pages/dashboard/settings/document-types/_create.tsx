import { authenticatedRequest } from '../../../../utils/axios-util';
import DocumentTypesForm from './_components/document-types-form';

export default function CreateDocumentTypePage() {
  async function handleCreateDocumentType(payload: { name: string; fileTypes: string[] }) {
    const {
      data: { status, message },
    } = await authenticatedRequest.post('/document-type', payload);
    if (!status) {
      throw new Error(message);
    }
  }

  return <DocumentTypesForm mode="create" handleOnFormSubmit={handleCreateDocumentType} />;
}
