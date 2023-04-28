import { useContext } from 'react';
import DashboardLayoutContainer from '../../../layouts/dashboard-layout';
import { UserContext } from '../../../context/user-context';
import _ from 'lodash';
import ProfilePage from './_profile';

function ProfilePageContainer() {
  const currentUser = useContext(UserContext);

  return (
    <DashboardLayoutContainer>
      <ProfilePage />
    </DashboardLayoutContainer>
  );
}

export default ProfilePageContainer;
