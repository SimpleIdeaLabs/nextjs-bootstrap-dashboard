import { Breadcrumbs } from '../../../shared/breadcrumbs';
import Hero from './hero';
import RevenueAndPayments from './revenue-and-payments';
import Transactions from './transactions';

export default function AnalyticsPage() {
  return (
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
    </div>
  );
}
