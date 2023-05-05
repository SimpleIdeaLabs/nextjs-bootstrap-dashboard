import { useRouter } from 'next/router';
import DashboardLayout from '../../../layouts/dashboard-layout';
import UpdateServicePage from './_update';
import _ from 'lodash';

function UpdateServiceContainer() {
  const router = useRouter();
  const serviceId = _.get(router, 'query.serviceId', null);

  return (
    <DashboardLayout>
      <UpdateServicePage serviceId={serviceId} />
    </DashboardLayout>
  );
}

export default UpdateServiceContainer;
