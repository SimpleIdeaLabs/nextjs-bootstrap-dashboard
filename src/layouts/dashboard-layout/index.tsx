import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Accordion from './_components/accordion';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserContext } from '../../context/user-context';
import _ from 'lodash';
import Link from 'next/link';

const DashboardLayout = (props: any) => {
  const router = useRouter();
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = Cookies.get('token');
        const {
          data: { data: responseData },
        } = await axios.get(`${process.env.API_URL}/user/session`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(responseData);
      } catch (error) {
        setCurrentUser(null);
        router.push('/');
      }
    };
    fetchCurrentUser();
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  function handleLogout() {
    Cookies.remove('token');
    router.push('/');
  }

  return (
    <>
      <UserContext.Provider value={currentUser}>
        <>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
              <button type="button" className="navbar-toggler d-md-none" onClick={handleToggleSidebar}>
                <i
                  className="bi bi-layout-sidebar navbar-toggler-icon d-flex justify-content-center align-items-center"
                  style={{ backgroundImage: 'none', fontSize: '1.5rem' }}></i>
              </button>
              <a className="navbar-brand" href="#">
                NextJS BS5
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Messages <span className="badge text-bg-secondary">4</span>
                    </a>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Notifs <span className="badge text-bg-secondary">99+</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="#">
                          Mark messaged you!
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Wena messaged you!
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {_.get(currentUser, 'firstName', '')}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" href="/dashboard/profile/security">
                          Security Settings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/dashboard/profile">
                          Update Details
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container-fluid">
            <div className="row">
              {/* SideBar */}
              <nav
                className={`col-md-3 col-lg-2 d-md-block ps-0 pe-0 bg-light sidebar ${
                  isSidebarOpen ? '' : 'collapse'
                } border-end`}>
                <div className="sidebar-sticky">
                  <div className="accordion accordion-flush" id="dashboardLink">
                    <Accordion
                      collapseId="consoleCollapse"
                      linkHeadingId="consoleLinkHeading"
                      parentLink={{
                        title: 'Console',
                        link: '/dashboard/console',
                      }}
                      subLinks={[
                        {
                          key: 'console-analytics',
                          title: 'Analytics',
                          link: '/dashboard/console/analytics',
                        },
                      ]}
                    />
                    <Accordion
                      collapseId="usersCollapse"
                      linkHeadingId="usersLinkHeading"
                      parentLink={{
                        title: 'Users',
                        link: '/users',
                      }}
                      subLinks={[
                        {
                          key: 'roles',
                          title: 'Roles',
                          link: '/dashboard/users/roles/list?page=1&limit=10',
                        },
                        {
                          key: 'system-users',
                          title: 'System Users',
                          link: '/dashboard/users/system-users/list?page=1&limit=10',
                        },
                      ]}
                    />
                    <Accordion
                      collapseId="authCollapse"
                      linkHeadingId="authLinkHeading"
                      parentLink={{
                        title: 'Auth Pages',
                        link: '/auth',
                      }}
                      subLinks={[
                        {
                          key: 'login',
                          title: 'Login',
                          link: '/login',
                        },
                        {
                          key: 'register',
                          title: 'Register',
                          link: '/register',
                        },
                        {
                          key: 'forgot-password',
                          title: 'Forgot Password',
                          link: '/forgot-password',
                        },
                      ]}
                    />
                    <Accordion
                      collapseId="miscCollapse"
                      linkHeadingId="miscLinkHeading"
                      parentLink={{
                        title: 'Misc Pages',
                        link: '/misc',
                      }}
                      subLinks={[
                        {
                          key: 'misc-error',
                          title: 'Error',
                          link: '/misc/error',
                        },
                        {
                          key: 'misc-under-maintenance',
                          title: 'Under Maintenance',
                          link: '/misc/under-maintenance',
                        },
                      ]}
                    />
                  </div>
                </div>
              </nav>

              {/* Content */}
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main pt-5 pb-5">{children}</main>
            </div>
          </div>

          <style>{`
              .sidebar {
                position: fixed;
                top: 10px; /* adjust this value to match the height of your navbar */
                bottom: 0;
                left: 0;
                z-index: 1000;
                padding-top: 3.5rem;
                overflow-x: hidden;
                overflow-y: auto; /* enable vertical scrolling */
              }

              .main {
                margin-top: 56px; /* adjust this value to match the height of your navbar */
              }

              .btn-icon {
                font-size: 24px;
              }
            `}</style>
        </>
      </UserContext.Provider>
    </>
  );
};

export default DashboardLayout;