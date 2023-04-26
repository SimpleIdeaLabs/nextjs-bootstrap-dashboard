import Link from 'next/link';
import DefaultLayout from '../../layouts/default-layout';

function Error() {
  return (
    <DefaultLayout>
      <div className="row">
        <div className="d-none d-md-block" style={{ height: 150 }}></div>
        <div className={`col-12 col-md-4 mx-md-auto mt-5 text-center`}>
          <h4>Page Not Found :(</h4>
          <div> Oops! 😖 The requested URL was not found on this server.</div>
          <div className="mb-3">
            <Link href={'/dashboard'}>Back to Home</Link>
          </div>
          <img src="/images/illustrations/page-misc-error-light.png" className="img-fluid" />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Error;
