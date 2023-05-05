import { authenticatedRequest } from '../../../utils/axios-util';
import ServiceForm from './_components/service-form';

export default function CreateServicePage() {
  async function handleCreateService(payload: {
    logo: string;
    name: string;
    category: string;
    description: string;
    price: string;
  }) {
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

  return <ServiceForm mode="create" handleOnFormSubmit={handleCreateService} />;
}
