import { Breadcrumbs } from '../../../../components/breadcrumbs';
import FeatureCard from './_components/feature-card';

function AnalyticsHomePage() {
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
            title: 'Home',
            link: '/dashboard/analytics/home',
            active: true,
          },
        ]}
      />
      <div className="row p0">
        <div className="col-md-12 col-12 col-lg-4" style={{ height: 500 }}>
          <FeatureCard
            title="Onboard Patients"
            icon="bi bi-people-fill"
            color="bg-primary-200"
            textColor="text-light"
            link="/"
          />
        </div>
        <div className="col-8">
          <div className="row h-100">
            <div className="col-4">
              <FeatureCard
                title="Manage Admins"
                icon="bi-person-vcard-fill"
                color="bg-success-200"
                textColor="text-light"
                link="/"
              />
            </div>
            <div className="col-lg-4">
              <FeatureCard
                title="Manage Reports"
                icon="bi-file-bar-graph-fill"
                color="bg-info-200"
                textColor="text-light"
                link="/"
              />
            </div>
            <div className="col-lg-4">
              <FeatureCard
                title="Today's Reports"
                icon=" bi-pie-chart-fill"
                color="bg-primary-300"
                textColor="text-dark"
                link="/"
              />
            </div>
            <div className="col-lg-7 mt-4">
              <FeatureCard
                title="POS"
                icon="bi-pc-display-horizontal"
                color="bg-warning-200"
                textColor="text-light"
                link="/"
              />
            </div>
            <div className="col-lg-5 mt-4">
              <FeatureCard
                title="Manage Queue"
                icon="bi-ticket-detailed"
                color="bg-danger-200"
                textColor="text-light"
                link="/"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row  mt-4">
        <div className="col-8">
          <div className="row h-100">
            <div className="col-4">
              <FeatureCard
                title="Manage Admins"
                icon="bi-person-vcard-fill"
                color="bg-success-200"
                textColor="text-light"
                link="/"
              />
            </div>
            <div className="col-lg-4">
              <FeatureCard
                title="Manage Reports"
                icon="bi-file-bar-graph-fill"
                color="bg-info-200"
                textColor="text-light"
                link="/"
              />
            </div>
            <div className="col-lg-4">
              <FeatureCard
                title="Today's Reports"
                icon=" bi-pie-chart-fill"
                color="bg-primary-300"
                textColor="text-dark"
                link="/"
              />
            </div>
            <div className="col-lg-7 mt-4">
              <FeatureCard
                title="POS"
                icon="bi-pc-display-horizontal"
                color="bg-warning-200"
                textColor="text-light"
                link="/"
              />
            </div>
            <div className="col-lg-5 mt-4">
              <FeatureCard
                title="Manage Queue"
                icon="bi-ticket-detailed"
                color="bg-danger-200"
                textColor="text-light"
                link="/"
              />
            </div>
          </div>
        </div>
        <div className="col-md-12 col-12 col-lg-4" style={{ height: 500 }}>
          <FeatureCard
            title="Onboard Patients"
            icon="bi bi-people-fill"
            color="bg-primary-200"
            textColor="text-light"
            link="/"
          />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsHomePage;
