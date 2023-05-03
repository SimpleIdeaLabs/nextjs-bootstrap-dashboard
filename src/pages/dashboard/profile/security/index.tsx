import DashboardLayoutContainer from '../../../../layouts/dashboard-layout';
import _ from 'lodash';
import Password from './_password';

function ProfileSecurityContainer() {
  return (
    <DashboardLayoutContainer>
      <Password />
    </DashboardLayoutContainer>
  );
}

export default ProfileSecurityContainer;
