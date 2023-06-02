import Head from 'next/head';
import AnalyticsPage from '../../../components/dashboard/console/analytics/analytics.page';
import DashboardLayout from '../../../layouts/dashboard-layout';

export default function AnalyticsContainer() {
  return (
    <DashboardLayout>
      <Head>
        <title>Analytics</title>
      </Head>
      <AnalyticsPage />
    </DashboardLayout>
  );
}
