import { useContext } from 'react';
import { UserContext } from '../../../../context/user-context';

export function Sample() {
  const currentUser = useContext<any>(UserContext);
  return <>{(currentUser && currentUser.firstName) || 'Wait'}</>;
}
