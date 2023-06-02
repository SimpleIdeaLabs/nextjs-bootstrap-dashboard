import Link from 'next/link';
import { Breadcrumbs } from '../../../../components/shared/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../../components/shared/tables';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import { toast } from 'react-toastify';
import qs from 'querystring';
import SearchModal from '../../../../components/dashboard/users/system-users/search-modal';
import FilterModal from '../../../../components/dashboard/users/system-users/filter-modal';
import { User } from '../../../../models/user.model';
import { DEFAULT_PAGINATION, Pagination } from '../../../../dtos/shared.dto';
import { UserService } from '../../../../services/user.service';
import { RoleService } from '../../../../services/role.service';
import Head from 'next/head';

interface SystemUserListPageState {
  systemUsers: User[];
  search: {
    firstName: string;
    lastName: string;
    email: string;
  };
  filter: {
    role: any[];
  };
  optionRoles: any[];
  selectedRoles: any[];
  pagination: Pagination;
  loading: boolean;
  displaySearchModal: boolean;
  displayFilterModal: boolean;
}

export default function SystemUsersListPage() {
  const router = useRouter();

  const [systemUserListPageState, setSystemUserListPageState] = useState<SystemUserListPageState>({
    systemUsers: [],
    search: {
      firstName: '',
      lastName: '',
      email: '',
    },
    filter: {
      role: [],
    },
    optionRoles: [],
    selectedRoles: [],
    pagination: DEFAULT_PAGINATION,
    loading: true,
    displaySearchModal: false,
    displayFilterModal: false,
  });

  /**
   * Fetch Roles
   */
  useEffect(() => {
    fetchRoles();
  }, []);

  /**
   * Fetch Users
   */
  useEffect(() => {
    if (!_.isEmpty(router.query) && systemUserListPageState.optionRoles.length > 0) {
      const updatedPaginationState = {
        page: parseInt(router.query.page as string),
        limit: parseInt(router.query.limit as string),
      };

      const updatedSearchState = {
        firstName: router.query.firstName as string,
        lastName: router.query.lastName as string,
        email: router.query.email as string,
      };

      /**
       * Ensure role
       * always an array
       * if role is defined
       * on query parameters
       */
      const { role: queryRole = null } = router.query;
      const updatedFilterState = {
        role: queryRole ? (_.isArray(queryRole) ? queryRole : [queryRole]) : [],
      };

      setSystemUserListPageState((prevState) => ({
        ...prevState,
        search: updatedSearchState,
        filter: updatedFilterState,
        pagination: {
          ...prevState.pagination,
          ...updatedPaginationState,
        },
        loading: true,
      }));

      fetchSystemUsers({
        pagination: updatedPaginationState,
        search: updatedSearchState,
        filter: updatedFilterState,
      });
    }
  }, [router.query, systemUserListPageState.optionRoles]);

  /**
   * Fetch System Users
   */
  async function fetchSystemUsers(params: { pagination: any; search: any; filter: any }) {
    const { pagination, search, filter } = params;
    const { role = [] } = filter;
    try {
      const selectedRoles: any[] = [];
      role.map((r: any) => {
        const selectedRole = _.find(systemUserListPageState.optionRoles, {
          value: r,
        });
        if (selectedRole) {
          selectedRoles.push(selectedRole);
        }
      });

      const { users, pagination: paginationResponse } = await UserService.getUserList({
        pagination,
        search,
        filter,
      });

      setSystemUserListPageState((prevState) => ({
        ...prevState,
        selectedRoles,
        systemUsers: users,
        pagination: paginationResponse,
      }));
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    } finally {
      setTimeout(() => {
        setSystemUserListPageState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  /**
   * Fetch Roles
   */
  async function fetchRoles() {
    const { roles = [] } = await RoleService.getRoleList({
      page: 1,
      limit: 1000,
    });
    const optionRoles = roles.map((role: any) => ({
      value: role.key,
      label: role.name,
    }));
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      optionRoles,
      loading: true,
    }));
  }

  /**
   * Delete Role
   */
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

  /**
   * Delete Role Request
   */
  async function sendDeleteRequest(userId: number) {
    try {
      await UserService.deleteUser({
        userId,
      });
      toast.success('User successfully deleted!');
      const { pagination, search, filter } = systemUserListPageState;
      const { page, limit } = pagination;
      await fetchSystemUsers({
        pagination,
        search,
        filter,
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

  /**
   * Goto Page
   */
  function goToPage(page: number) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  }

  /**
   * Search
   */
  function handleOnSearch() {
    displaySearchModal(false);
    const { search, selectedRoles = [] } = systemUserListPageState;
    const { firstName, lastName, email } = search;
    const query = {
      ...router.query,
      page: 1,
      firstName,
      lastName,
      email,
      role: selectedRoles.map((role: any) => role.value),
    } as any;
    router.push(`/dashboard/users/system-users/list?${qs.encode(query)}`);
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  /**
   * Clear Search
   */
  function handleOnClearSearch() {
    displaySearchModal(false);
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      search: {
        firstName: '',
        lastName: '',
        email: '',
      },
    }));
    const query: any = { ...router.query, page: 1 };
    delete query.firstName;
    delete query.lastName;
    delete query.email;
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  /**
   * Filter
   */
  function handleOnFilter() {
    displayFilterModal(false);
    const query = {
      ...router.query,
      page: 1,
      role: systemUserListPageState.filter.role.map((role: any) => role.value),
    } as any;
    router.push(`/dashboard/users/system-users/list?${qs.encode(query)}`);
  }

  /**
   * Clear Filter
   */
  function handleOnClearFilter() {
    displayFilterModal(false);
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      selectedRoles: [],
    }));
    const query: any = {
      ...router.query,
    };
    delete query.role;
    router.push(`/dashboard/users/system-users/list?${qs.encode(query)}`);
  }

  /**
   * Toggle Search Modal
   */
  function displaySearchModal(display: boolean) {
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      displaySearchModal: display,
    }));
  }

  /**
   * Toggle Filter Modal
   */
  function displayFilterModal(display: boolean) {
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      displayFilterModal: display,
    }));
  }

  /**
   * Handle Filter Change
   */
  function handleFilterValueChange(field: string, value: any) {
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        [field]: value,
      },
    }));
  }

  /**
   * Handle Search Change
   */
  function handleSearchValueChange(field: string, value: any) {
    setSystemUserListPageState((prevState) => ({
      ...prevState,
      search: {
        ...prevState.search,
        [field]: value,
      },
    }));
  }

  return (
    <DashboardLayout>
      <Head>
        <title>System Users</title>
      </Head>
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
            <Table title="Users" isLoading={systemUserListPageState.loading}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnSystemUserSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => displaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <button
                    id="btnSystemUserFilterModal"
                    className="btn btn-outline-dark"
                    onClick={() => displayFilterModal(true)}>
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
                  {systemUserListPageState.systemUsers.map((user: any) => {
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
              <TablePagination pagination={systemUserListPageState.pagination} goToPage={goToPage} />
            </Table>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal
        firstName={systemUserListPageState.search.firstName}
        onChangeFirstName={(v) => handleSearchValueChange('firstName', v)}
        lastName={systemUserListPageState.search.lastName}
        onChangeLastName={(v) => handleSearchValueChange('lastName', v)}
        email={systemUserListPageState.search.email}
        onChangeEmail={(v) => handleSearchValueChange('email', v)}
        showModal={systemUserListPageState.displaySearchModal}
        onClose={() => displaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
      {systemUserListPageState.loading ? null : (
        <FilterModal
          selectedRoles={systemUserListPageState.selectedRoles}
          optionRoles={systemUserListPageState.optionRoles}
          handleOnChange={(v) => handleFilterValueChange('role', v)}
          showModal={systemUserListPageState.displayFilterModal}
          onClose={() => displayFilterModal(false)}
          handleOnFilter={handleOnFilter}
          handleOnClearFilter={handleOnClearFilter}
        />
      )}
    </DashboardLayout>
  );
}
