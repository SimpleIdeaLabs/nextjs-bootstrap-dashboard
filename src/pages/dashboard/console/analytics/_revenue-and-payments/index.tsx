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

  return <Doughnut data={data} />;
}

export default function RevenueAndPayments() {
  return (
    <div className="row mb-3">
      <div className="col-lg-8 col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8 col-md-12 mb-3">
                <div className="h6">Sample Chart</div>
                <div className="d-flex align-items-center justify-content-center h-100">
                  <LineChart />
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="d-lg-none">
                  <hr />
                </div>
                <div className="h6">Sample Donut</div>
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-center">
                    <div className="dropdown mb-3 align-self-center">
                      <button
                        className="btn btn-light btn-sm dropdown-toggle"
                        type="button"
                        id="triggerId"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        2023
                      </button>
                      <div className="dropdown-menu" aria-labelledby="triggerId">
                        <button className="dropdown-item">2022</button>
                        <button className="dropdown-item">2023</button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <DonutChart />
                  </div>
                  <div className="fw-bolder mt-3 text-center">62% Company Growth</div>
                  <div className="mt-3">
                    <div className="row">
                      <div className="col-lg-6 col-md-12 p-0">
                        <div className="row">
                          <div className="col-sm-6 p-0">
                            <div className=" d-flex justify-content-end align-items-center h-100 me-3">
                              <a className="btn btn-dark" href="#" role="button">
                                <i className="bi bi-currency-dollar"></i>
                              </a>
                            </div>
                          </div>
                          <div className="col-sm-6 p-0">
                            <div className="row">
                              <div className="col-sm-12 p-0">
                                <div className="d-flex flex-column justify-content-center align-items-start h-100">
                                  <div style={{ fontSize: 12 }}>2022</div>
                                  <div>$32.5k</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12 p-0">
                        <div className="row">
                          <div className="col-sm-6 p-0">
                            <div className=" d-flex justify-content-end align-items-center h-100 me-3">
                              <a className="btn btn-dark" href="#" role="button">
                                <i className="bi bi-wallet2"></i>
                              </a>
                            </div>
                          </div>
                          <div className="col-sm-6 p-0">
                            <div className="row">
                              <div className="col-sm-12 p-0">
                                <div className="d-flex flex-column justify-content-center align-items-start h-100">
                                  <div style={{ fontSize: 12 }}>2023</div>
                                  <div>$312.5k</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-12 mt-3 mt-md-0">
        <div className="row h-100">
          <div className="col-lg-6 col-6 mb-3">
            <DashboardCard />
          </div>
          <div className="col-lg-6 col-6 mb-3">
            <DashboardCard />
          </div>
          <div className="col-lg-12">
            <DashboardCard />
          </div>
        </div>
      </div>
    </div>
  );
}
