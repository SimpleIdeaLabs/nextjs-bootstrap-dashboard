import { title } from 'process';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import Hero from './_hero';
import Transactions from './_transactions';
import RevenueAndPayments from './_revenue-and-payments';
export default function DashboardAnalytics() {
  return (
    <DashboardLayout>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Dashboard',
              link: '/',
              active: false,
            },
            {
              title: 'Analytics',
              link: '/dashboard/dashboard-analytics',
              active: true,
            },
          ]}
        />
        <Hero />
        <RevenueAndPayments />
        <Transactions />
        {/* <Timeline /> */}
      </div>
    </DashboardLayout>
  );
}
