export default function DashboardCard() {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="row h-100">
          <div className="d-flex flex-column justify-content-between">
            <div className="flex-1 d-flex flex-row justify-content-between">
              <a className="btn btn-light" href="#" role="button">
                <i className="bi bi-wallet2"></i>
              </a>
              <div className="dropdown">
                <button className="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-1">
              <div>Sales</div>
              <div className="h4">$4,550</div>
              <div className="text-success mt-3">
                <span>
                  <i className="bi bi-arrow-up-circle-fill"></i>
                </span>{' '}
                +28.42%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
