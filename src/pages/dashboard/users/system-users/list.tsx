import Link from 'next/link';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../../components/tables';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import SearchModal from './_components/search-modal';
import { useEffect, useState } from 'react';
import FilterModal from './_components/filter-modal';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import { toast } from 'react-toastify';
import qs from 'querystring';

export default function SystemUsersList() {
  const router = useRouter();
  const [systemUsers, setSystemUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Search Fields
   */
  const [qFirstName, setQFirstName] = useState(_.get(router, 'query.firstName', ''));
  const [qLastName, setQLastName] = useState(_.get(router, 'query.lastName', ''));
  const [qEmail, setQEmail] = useState(_.get(router, 'query.email', ''));
  const [displaySearchModal, setDisplaySearchModal] = useState(false);

  /**
   * Filter Fields
   */
  const [optionRoles, setOptionRoles] = useState([]);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  const [filterRole, setFilterRole] = useState(router.query['role']);
  const [selectedRoles, setSelectedRoles] = useState<any>([]);

  /**
   * Pagination Fields
   */
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalNumberOfPages: 0,
  });

  /**
   * Get System Users
   */
  useEffect(() => {
    async function getSystemUsers() {
      if (!optionRoles.length) {
        return;
      }

      let { page, limit, firstName: queryFirstName, lastName: queryLastName, email: queryEmail } = router.query;

      if (queryFirstName) {
        setQFirstName(queryFirstName);
      } else {
        queryFirstName = '';
      }

      if (queryLastName) {
        setQLastName(queryLastName);
      } else {
        queryLastName = '';
      }

      if (queryEmail) {
        setQEmail(queryEmail);
      } else {
        queryEmail = '';
      }

      let queryFilterRole = ((): string[] => {
        let qRole = router.query['role'];
        if (Array.isArray(qRole) && qRole.length) {
          return qRole as string[];
        } else if (qRole) {
          return [qRole as string];
        }
        return [];
      })();
      if (queryFilterRole.length) {
        setFilterRole(queryFilterRole);
        const _selectedRoles = optionRoles.filter((option: any) => {
          return _.includes(queryFilterRole, option.value);
        });
        setSelectedRoles(_selectedRoles);
      } else {
        queryFilterRole = [];
        setSelectedRoles([]);
      }

      if (page && limit) {
        await fetchSystemUsers({
          _page: Number(page),
          _limit: Number(limit),
          queryFirstName: queryFirstName as string,
          queryLastName: queryLastName as string,
          queryEmail: queryEmail as string,
          queryFilterRole: queryFilterRole as string[],
        });
        setIsLoading(false);
      }
    }
    getSystemUsers();
  }, [router.query, optionRoles]);

  /**
   * Get Roles
   */
  useEffect(() => {
    async function getRoles() {
      await fetchRoles();
    }
    getRoles();
  }, []);

  async function fetchSystemUsers(params: {
    _page: number;
    _limit: number;
    queryFirstName: string;
    queryLastName: string;
    queryEmail: string;
    queryFilterRole: any[];
  }) {
    const { _page, _limit, queryFirstName, queryLastName, queryEmail, queryFilterRole = [] } = params;
    try {
      let requestUrl = `/user?page=${_page}&limit=${_limit}`;

      if (queryFirstName || queryLastName || queryEmail) {
        if (queryFirstName) {
          requestUrl = `${requestUrl}&firstName=${queryFirstName}`;
        }
        if (queryLastName) {
          requestUrl = `${requestUrl}&lastName=${queryLastName}`;
        }
        if (queryEmail) {
          requestUrl = `${requestUrl}&email=${queryEmail}`;
        }
      }

      if (queryFilterRole.length) {
        const filterRoleQueryParams = queryFilterRole.map((f) => `role=${f}`).join('&');
        requestUrl = `${requestUrl}&${filterRoleQueryParams}`;
      }

      const response = await authenticatedRequest.get(requestUrl);
      const {
        data: { data: responseData },
      } = response;
      setPagination({
        ...responseData.pagination,
      });
      setSystemUsers(responseData.users);
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    }
  }

  async function fetchRoles() {
    const response = await authenticatedRequest.get(`/role?page=${1}&limit=${1000}`);
    const {
      data: { data: responseData },
    } = response;
    const { roles = [] } = responseData;
    const optionRoles = roles.map((role: any) => ({
      value: role.key,
      label: role.name,
    }));
    setOptionRoles(optionRoles);
  }

  async function handleDelete(userId: number) {
    toast.warning(
      <div className="p-3">
        <div className="mb-3 fs-6">Are you sure you want to delete this item?</div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-success me-2"
            onClick={() => {
              toast.dismiss('confirm');
            }}>
            No
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              toast.dismiss('confirm');
              sendDeleteRequest(userId);
            }}>
            Yes
          </button>
        </div>
      </div>,
      {
        position: 'top-right',
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        toastId: 'confirm',
      }
    );
  }

  async function sendDeleteRequest(userId: number) {
    try {
      await authenticatedRequest.delete(`/user/${userId}`);
      toast.success('User successfully deleted!');
      const { page, limit } = pagination;
      await fetchSystemUsers({
        _page: Number(page),
        _limit: Number(limit),
        queryFirstName: qFirstName as string,
        queryLastName: qLastName as string,
        queryEmail: qEmail as string,
        queryFilterRole: filterRole as string[],
      });
    } catch (error) {
      handleHttpRequestError({
        error,
        badRequestCallback(_, message) {
          toast.error(message);
        },
      });
    }
  }

  function goToPage(page: number) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  }

  function handleOnSearch() {
    setDisplaySearchModal(false);
    const query = {
      ...router.query,
      page: 1,
      firstName: qFirstName,
      lastName: qLastName,
      email: qEmail,
      role: selectedRoles.map((role: any) => role.value),
    } as any;
    router.push(`/dashboard/users/system-users/list?${qs.encode(query)}`);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, firstName: qFirstName, lastName: qLastName, email: qEmail },
    });
  }

  function handleOnClearSearch() {
    setDisplaySearchModal(false);
    setQFirstName('');
    setQLastName('');
    setQEmail('');
    const query: any = { ...router.query, page: 1 };
    delete query.firstName;
    delete query.lastName;
    delete query.email;

    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function handleOnFilter() {
    setDisplayFilterModal(false);
    const query = {
      ...router.query,
      page: 1,
      role: selectedRoles.map((role: any) => role.value),
    } as any;
    router.push(`/dashboard/users/system-users/list?${qs.encode(query)}`);
  }

  function handleOnClearFilter() {
    setDisplayFilterModal(false);
    setSelectedRoles([]);
    const query: any = {
      ...router.query,
    };
    delete query.role;
    router.push(`/dashboard/users/system-users/list?${qs.encode(query)}`);
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Users',
              link: '/users',
              active: false,
            },
            {
              title: 'System Users',
              link: '/dashboard/users/system-users/list?page=1&limit=10',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className="col-lg-12">
            <Table title="Users" isLoading={false}>
              <TableHeader>
                <h4 className="card-title mb-0">Users</h4>
                <div className="btn-group">
                  <button
                    id="btnSystemUserSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => setDisplaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <button
                    id="btnSystemUserFilterModal"
                    className="btn btn-outline-dark"
                    onClick={() => setDisplayFilterModal(true)}>
                    <i className="bi bi-funnel-fill"></i> Filter
                  </button>
                  <Link href="/dashboard/users/system-users/create" className="btn btn-outline-success">
                    <i className="bi bi-plus-circle-fill"></i> New
                  </Link>
                </div>
              </TableHeader>
              <TableBody>
                <thead>
                  <tr>
                    <th style={{ width: '20px' }}>Actions</th>
                    <th style={{ width: '20px' }}>ID</th>
                    <th style={{ width: '20px' }}>Avatar</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Roles</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {systemUsers.map((user: any) => {
                    return (
                      <tr key={user.id}>
                        <td scope="row">
                          <button
                            className="btn btn-sm btn-light"
                            type="button"
                            id="triggerId"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-start" aria-labelledby="triggerId">
                            <Link className="dropdown-item" href={`/dashboard/users/system-users/${user.id}`}>
                              <i className="bi bi-pen-fill text-info"></i> Edit
                            </Link>
                            <button className="dropdown-item" onClick={() => handleDelete(user.id)}>
                              <i className="bi bi-trash3-fill text-danger"></i> Delete
                            </button>
                          </div>
                        </td>
                        <td scope="row">{user.id}</td>
                        <td scope="row">
                          <div className="rounded-circle overflow-hidden shadow" style={{ width: 60, height: 60 }}>
                            <img
                              src={`${process.env.FILE_UPLOADS_URL}/profile-photos/${user.profilePhoto}`}
                              alt="Avatar"
                              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                            />
                          </div>
                        </td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>
                          {user.roles.map((role: any) => {
                            return (
                              <span key={role.id} className="badge bg-primary me-1">
                                {role.name}
                              </span>
                            );
                          })}
                        </td>
                        <td>{user.email}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableBody>
              <TablePagination pagination={pagination} goToPage={goToPage} />
            </Table>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal
        firstName={qFirstName as string}
        onChangeFirstName={setQFirstName}
        lastName={qLastName as string}
        onChangeLastName={setQLastName}
        email={qEmail as string}
        onChangeEmail={setQEmail}
        showModal={displaySearchModal}
        onClose={() => setDisplaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
      {isLoading ? null : (
        <FilterModal
          selectedRoles={selectedRoles}
          optionRoles={optionRoles}
          handleOnChange={setSelectedRoles}
          showModal={displayFilterModal}
          onClose={() => setDisplayFilterModal(false)}
          handleOnFilter={handleOnFilter}
          handleOnClearFilter={handleOnClearFilter}
        />
      )}
    </DashboardLayout>
  );
}
