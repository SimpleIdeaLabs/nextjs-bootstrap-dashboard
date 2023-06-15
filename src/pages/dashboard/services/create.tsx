import ServiceForm, { ServiceFormValue } from '../../../components/dashboard/services/service-form';
import DashboardLayout from '../../../layouts/dashboard-layout';
import { authenticatedRequest } from '../../../utils/axios-util';

function CreateServiceContainer() {
  async function handleCreateService(payload: ServiceFormValue) {
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
    } = await authenticatedRequest.post('/service', formData, config);
    if (!status) {
      throw new Error(message);
    }
  }

  return (
    <DashboardLayout>
      <ServiceForm mode="create" handleOnFormSubmit={handleCreateService} />;
    </DashboardLayout>
  );
}

export default CreateServiceContainer;
