import Link from 'next/link';

interface SecurityLayoutProps {
  activeTab: number;
  children: React.ReactNode;
}

function SecurityLayout(props: SecurityLayoutProps) {
  const { children, activeTab } = props;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
          <ul className="nav nav-pills mb-3">
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 0 ? 'active' : ''}`} href="/dashboard/profile/security">
                Password
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
                href="/dashboard/profile/security/face-login">
                Face Login
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Login History
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Audit Trails
              </a>
            </li>
          </ul>

          {children}
        </div>
      </div>
    </div>
  );
}

export default SecurityLayout;
