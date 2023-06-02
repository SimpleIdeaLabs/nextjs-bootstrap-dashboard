import { authenticatedRequest } from '../../../../utils/axios-util';
import DocumentTypesForm from './_components/document-types-form';

interface UpdateDocumentTypePageProps {
  documentTypeId: any;
}

export default function UpdateDocumentTypePage(props: UpdateDocumentTypePageProps) {
  const { documentTypeId = null } = props;

  async function handleUpdateDocumentType(payload: { name: string; fileTypes: string[] }) {
    const {
      data: { status, message },
    } = await authenticatedRequest.patch(`/document-type/${documentTypeId}`, payload);
    if (!status) {
      throw new Error(message);
    }
  }

  return (
    <DocumentTypesForm mode="edit" documentTypeId={documentTypeId} handleOnFormSubmit={handleUpdateDocumentType} />
  );
}
