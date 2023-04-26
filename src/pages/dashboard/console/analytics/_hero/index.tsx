import { useContext } from 'react';
import DashboardCard from '../_components/dashboard-card';
import { UserContext } from '../../../../../context/user-context';
import _ from 'lodash';

export default function Hero(props: any) {
  const currentUser = useContext(UserContext);
  return (
    <div className="row">
      <div className="col-cell col-lg-8 col-md-12 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-row">
              <div className="flex-1">
                <div>
                  <h1 className="text-lg">
                    Welcome {_.get(currentUser, 'firstName', '')} {_.get(currentUser, 'lastName', '')}
                  </h1>
                  <p className="text-sm">This is some text</p>
                  <p className="text-muted text-left text-md">
                    This is some muted text that is centered on small screens and left-aligned on larger screens.
                  </p>
                </div>
                <div className="mt-auto">
                  <a className="btn btn-light" href="#" role="button">
                    View Badges
                  </a>
                </div>
              </div>
              <div className="flex-1 d-flex justify-content-end">
                <img
                  src="/images/illustrations/man-with-laptop-light.png"
                  className="img-fluid"
                  style={{ maxWidth: 220 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-cell col-lg-2 col-6 mb-3">
        <DashboardCard />
      </div>
      <div className="col-cell col-lg-2 col-6 mb-3">
        <DashboardCard />
      </div>
    </div>
  );
}
