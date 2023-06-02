import { useRouter } from 'next/router';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import UpdateDocumentTypePage from './_update';
import _ from 'lodash';

function UpdateDocumentTypeContainer() {
  const router = useRouter();
  const documentTypeId = _.get(router, 'query.documentTypeId', null);

  return (
    <DashboardLayout>
      <UpdateDocumentTypePage documentTypeId={documentTypeId} />
    </DashboardLayout>
  );
}

export default UpdateDocumentTypeContainer;
