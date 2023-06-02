import Link from 'next/link';

interface PatientLayoutProps {
  activeTab: number;
  children: React.ReactNode;
  mode: 'create' | 'edit';
  patientId?: number | null;
}

function PatientLayout(props: PatientLayoutProps) {
  const { children, activeTab, mode, patientId = null } = props;

  let demographicsLink = `/dashboard/patients/demographics/${mode === 'create' ? '' : patientId}`;
  let additionalInfoLink = `/dashboard/patients/additional-data/${mode === 'create' ? '' : patientId}`;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
          <ul className="nav nav-pills mb-3">
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 0 ? 'active' : ''}`} href={demographicsLink}>
                <i className="bi bi-person-vcard-fill"></i> Demographics
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 1 ? 'active' : ''}`} href={additionalInfoLink}>
                <i className="bi bi-clipboard-data-fill"></i> Additional Data
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
                href={`/dashboard/patients/documents/${patientId}`}>
                <i className="bi bi-file-earmark-medical-fill"></i> Documents
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                History
              </a>
            </li>
          </ul>

          {children}
        </div>
      </div>
    </div>
  );
}

export default PatientLayout;
