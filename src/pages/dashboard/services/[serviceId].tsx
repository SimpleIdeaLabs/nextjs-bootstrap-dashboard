import { useRouter } from 'next/router';
import { authenticatedRequest } from '../../../utils/axios-util';
import _ from 'lodash';
import ServiceForm, { ServiceFormValue } from '../../../components/dashboard/services/service-form';
import DashboardLayout from '../../../layouts/dashboard-layout';

interface UpdateServicePageProps {
  serviceId: any;
}

export default function UpdateServicePage(props: UpdateServicePageProps) {
  const router = useRouter();
  const serviceId = _.get(router, 'query.serviceId', null);

  async function handleUpdateService(payload: ServiceFormValue) {
    const { logo, name, category, description, price } = payload;

    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const {
      data: { status, message },
    } = await authenticatedRequest.patch(`/service/${serviceId}`, formData, config);
    if (!status) {
      throw new Error(message);
    }
  }

  return (
    <DashboardLayout>
      <ServiceForm mode="edit" serviceId={serviceId} handleOnFormSubmit={handleUpdateService} />
    </DashboardLayout>
  );
}
