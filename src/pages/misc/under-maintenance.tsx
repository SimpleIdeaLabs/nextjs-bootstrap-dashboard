import Link from 'next/link';
import DefaultLayout from '../../layouts/default-layout';

function UnderMaintenance() {
  return (
    <DefaultLayout>
      <div className="row">
        <div className="d-none d-md-block" style={{ height: 150 }}></div>
        <div className={`col-12 col-md-4 mx-md-auto mt-5 text-center`}>
          <h4>Under Maintenance!</h4>
          <div>Sorry for the inconvenience but we are performing some maintenance at the moment</div>
          <div className="mb-3">
            <Link href={'/dashboard'}>Back to Home</Link>
          </div>
          <img src="/images/illustrations/girl-doing-yoga-light.png" className="img-fluid" />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default UnderMaintenance;
