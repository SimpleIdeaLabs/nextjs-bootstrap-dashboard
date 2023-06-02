import Head from 'next/head';
import AnalyticsHomePage from '../../../components/dashboard/console/home/home.page';
import DashboardLayout from '../../../layouts/dashboard-layout';

export default function AnalyticsHomeContainer() {
  return (
    <DashboardLayout>
      <Head>
        <title>Home</title>
      </Head>
      <AnalyticsHomePage />
    </DashboardLayout>
  );
}
