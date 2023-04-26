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
import { Sample } from '../../../sample';

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

export default function Timeline() {
  return (
    <div className="row mb-3">
      {/* Left Section */}
      <div className="col-lg-6 col-md-12 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="flex-1 d-flex flex-row justify-content-between align-items-center">
                  <div className="flex-1">
                    <div className="h6 text-lg">Activity Timeline</div>
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
              <div className="col-12">
                <Sample />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="col-lg-6 col-md-12 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="row  h-100">
              <div className="col-lg-12  mb-3">
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                      Browser
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Operating System
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Country
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-light ">
                    <thead>
                      <tr>
                        <th scope="col">Column 1</th>
                        <th scope="col">Column 2</th>
                        <th scope="col">Column 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="">
                        <td scope="row">R1C1</td>
                        <td>R1C2</td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{ width: '90%' }}
                              aria-valuenow={90}
                              aria-valuemin={0}
                              aria-valuemax={100}>
                              25%
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td scope="row">Item</td>
                        <td>Item</td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: '25%' }}
                              aria-valuenow={25}
                              aria-valuemin={0}
                              aria-valuemax={100}>
                              25%
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td scope="row">Item</td>
                        <td>Item</td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: '25%' }}
                              aria-valuenow={25}
                              aria-valuemin={0}
                              aria-valuemax={100}>
                              25%
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td scope="row">Item</td>
                        <td>Item</td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: '25%' }}
                              aria-valuenow={25}
                              aria-valuemin={0}
                              aria-valuemax={100}>
                              25%
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td scope="row">Item</td>
                        <td>Item</td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: '50%' }}
                              aria-valuenow={50}
                              aria-valuemin={0}
                              aria-valuemax={100}>
                              50%
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .timeline {
          list-style: none;
          padding: 0;
        }

        .timeline-item {
          display: flex;
          flex-direction: row;
        }

        .timeline-indicator {
          width: 10px;
          height: 10px;
          background-color: red;
        }

      `}</style>
    </div>
  );
}
