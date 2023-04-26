import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import DashboardCard from '../_components/dashboard-card';

function LineChart() {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: '2022',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '2023',
        data: [1, 2, 7, 4, 2, 6, 2, 8, 9, 1, 2, 14],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Total Revenue',
      },
    },
  };
  return <Line options={options} data={data} />;
}

function DonutChart() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        label: 'Growth',
        data: [88, 12],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} width={50} height={50} />;
}

export default function Transactions() {
  return (
    <div className="row mb-3">
      <div className="col-lg-4 col-md-12 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="flex-1 d-flex flex-row justify-content-between align-items-center">
                  <div className="flex-1">
                    <div className="h6 text-lg">Sample Chart</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      42.82k Total Sales
                    </div>
                  </div>
                  <div className="flex-1">
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
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6 col-sm-12">
                <div className="h2 text-lg">8,234</div>
                <div className="text-muted" style={{ fontSize: 16 }}>
                  Total Orders
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <DonutChart />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-eyeglasses mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Title</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    12.5k
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-earbuds mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Earbuds</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    222.5k
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-pci-card mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Graphics Card</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    2.5k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-12 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="row  h-100">
              <div className="col-lg-12  mb-3">
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                      Income
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Expense
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Profit
                    </a>
                  </li>
                </ul>
                <div className="row">
                  <div className="col-12 d-flex flex-column mb-3 mt-3">
                    <div className="d-flex flex-row justify-content-between">
                      <div className="flex-1 d-flex flex-row align-items-center">
                        <span className="bg-dark p-1 m-1 rounded">
                          <i className="bi bi-eyeglasses mx-auto text-light" style={{ fontSize: 25 }}></i>
                        </span>
                        <div className="d-flex flex-column">
                          <div className="fs-6">Title</div>
                          <div style={{ fontSize: 12 }} className="text-muted">
                            Sub
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12-flex align-items-center justify-content-center h-100">
                    <LineChart />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-6 col-sm-12 d-flex align-items-center justify-content-center">
                    <DonutChart />
                  </div>
                  <div className="col-lg-6  col-sm-12  d-flex align-items-center justify-content-center">
                    <div className="align-self-center">
                      <div>Expenses this week</div>
                      <div style={{ fontSize: 12 }}> $35 less than last week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="flex-1 d-flex flex-row justify-content-between align-items-center">
                  <div className="flex-1">
                    <div className="h6 text-lg">Sample Chart</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      42.82k Total Sales
                    </div>
                  </div>
                  <div className="flex-1">
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
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-eyeglasses mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Title</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    12.5k
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-earbuds mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Earbuds</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    222.5k
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-pci-card mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Graphics Card</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    2.5k
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-pci-card mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Graphics Card</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    2.5k
                  </div>
                </div>
              </div>{' '}
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-pci-card mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Graphics Card</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    2.5k
                  </div>
                </div>
              </div>{' '}
              <div className="col-12 d-flex flex-column mb-3">
                <div className="d-flex flex-row justify-content-between">
                  <div className="flex-1 d-flex flex-row align-items-center">
                    <span className="bg-dark p-1 m-1 rounded">
                      <i className="bi bi-pci-card mx-auto text-light" style={{ fontSize: 25 }}></i>
                    </span>
                    <div className="d-flex flex-column">
                      <div className="fs-6">Graphics Card</div>
                      <div style={{ fontSize: 12 }} className="text-muted">
                        Sub
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 d-flex justify-content-end align-items-center" style={{ fontSize: 14 }}>
                    2.5k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
