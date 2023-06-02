import Head from 'next/head';
import DashboardLayout from '../../../layouts/dashboard-layout';
import ServicesListPage from './_list';

function ServicesListContainer() {
  return (
    <DashboardLayout>
      <Head>
        <title>Offered Services</title>
      </Head>
      <ServicesListPage />
    </DashboardLayout>
  );
}

export default ServicesListContainer;
