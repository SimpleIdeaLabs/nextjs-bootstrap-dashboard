import { Breadcrumbs } from '../../../shared/breadcrumbs';
import FeatureCard from './feature-card';
import * as _ from 'lodash';

const colors = [
  'bg-primary-200',
  'bg-success-200',
  'bg-warning-200',
  'bg-info-200',
  'bg-danger-200',
  'bg-tiles-dark-200',
  'bg-tiles-dark-300',
  'bg-tiles-dark-400',
  'bg-tiles-dark-500',
  'bg-purple-200',
  'bg-purple-300',
  'bg-purple-400',
];

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
      <div className="row p-0">
        <div className="col-12 col-md-12 col-lg-4 p-1 onboard-patients">
          <FeatureCard
            title="Onboard Patients"
            icon="bi bi-people-fill"
            color={_.sample(colors) || ''}
            textColor="text-light"
            link="/dashboard/patients/create"
          />
        </div>
        <div className="col-12 col-md-12 col-lg-8">
          <div className="row h-100">
            <div className="col-4 col-lg-4 p-1">
              <FeatureCard
                title="Manage Admins"
                icon="bi-person-vcard-fill"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-4 col-lg-4 p-1 ">
              <FeatureCard
                title="Manage Reports"
                icon="bi-file-bar-graph-fill"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-4 col-lg-4 p-1">
              <FeatureCard
                title="Today's Reports"
                icon=" bi-pie-chart-fill"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-6 col-lg-7 p-1">
              <FeatureCard
                title="POS"
                icon="bi-pc-display-horizontal"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-6 col-lg-5 p-1">
              <FeatureCard
                title="Manage Queue"
                icon="bi-ticket-detailed"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row p-0">
        <div className="col-12 col-md-12 col-lg-8">
          <div className="row h-100">
            <div className="col-4 col-lg-4 p-1">
              <FeatureCard
                title="Manage Admins"
                icon="bi-person-vcard-fill"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-4 col-lg-4 p-1 ">
              <FeatureCard
                title="Manage Reports"
                icon="bi-file-bar-graph-fill"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-4 col-lg-4 p-1">
              <FeatureCard
                title="Today's Reports"
                icon=" bi-pie-chart-fill"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-6 col-lg-7 p-1">
              <FeatureCard
                title="POS"
                icon="bi-pc-display-horizontal"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
            <div className="col-6 col-lg-5 p-1">
              <FeatureCard
                title="Manage Queue"
                icon="bi-ticket-detailed"
                color={_.sample(colors) || ''}
                textColor="text-light"
                link="/dashboard/patients/create"
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-12 col-lg-4 p-1 onboard-patients">
          <FeatureCard
            title="Onboard Patients"
            icon="bi bi-people-fill"
            color={_.sample(colors) || ''}
            textColor="text-light"
            link="/dashboard/patients/create"
          />
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .onboard-patients {
            height: 500px;
          }
        }

        @media (max-width: 767px) {
          .onboard-patients {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default AnalyticsHomePage;
