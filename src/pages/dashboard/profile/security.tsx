import DashboardLayoutContainer from '../../../layouts/dashboard-layout';
import _ from 'lodash';
import ProfileSecurityPage from './_security';

function ProfileSecurityContainer() {
  return (
    <DashboardLayoutContainer>
      <ProfileSecurityPage />
    </DashboardLayoutContainer>
  );
}

export default ProfileSecurityContainer;
