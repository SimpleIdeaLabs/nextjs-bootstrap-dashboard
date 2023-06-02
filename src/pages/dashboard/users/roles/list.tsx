import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import RoleSearchModal from '../../../../components/dashboard/users/roles/role-search-modal';
import { Breadcrumbs } from '../../../../components/shared/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../../components/shared/tables';
import { Pagination } from '../../../../dtos/shared.dto';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { Role } from '../../../../models/role.model';
import { RoleService } from '../../../../services/role.service';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import Head from 'next/head';

interface UserRoleListPageState {
  roles: Role[];
  filter: {
    keyword: string;
  };
  pagination: Pagination;
  displaySearchModal: boolean;
  loading: boolean;
}

export default function UserRolesList() {
  const router = useRouter();
  const [userRoleListPageState, setUserRoleListPageState] = useState<UserRoleListPageState>({
    roles: [],
    filter: {
      keyword: _.get(router, 'query.keyword', '') as string,
    },
    pagination: {
      page: parseInt(router.query.page as string) || 1,
      limit: parseInt(router.query.limit as string) || 10,
      total: 0,
      totalNumberOfPages: 0,
    },
    displaySearchModal: false,
    loading: true,
  });

  useEffect(() => {
    if (!_.isEmpty(router.query)) {
      const updatedPaginationState = {
        page: parseInt(router.query.page as string),
        limit: parseInt(router.query.limit as string),
      };

      setUserRoleListPageState((prevState) => ({
        ...prevState,
        filter: {
          keyword: router.query.keyword as string,
        },
        pagination: {
          ...prevState.pagination,
          ...updatedPaginationState,
        },
        loading: true,
      }));

      fetchRoles(updatedPaginationState, router.query.keyword as string);
    }
  }, [router.query]);

  async function fetchRoles(pagination: any, keyword: any) {
    const { page, limit } = pagination;
    try {
      const { roles = [], pagination } = await RoleService.getRoleList({
        page,
        limit,
        keyword,
      });
      setTimeout(() => {
        setUserRoleListPageState((prevState) => ({
          ...prevState,
          roles,
          pagination,
          loading: false,
        }));
      }, 200);
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    }
  }

  function handleOnSearch() {
    displaySearchModal(false);
    const { filter } = userRoleListPageState;
    const { keyword } = filter;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, keyword, page: 1 },
    });
  }

  function handleOnClearSearch() {
    displaySearchModal(false);
    setUserRoleListPageState((prevState) => ({
      ...prevState,
      filter: {
        keyword: '',
      },
    }));
    const query = router.query;
    delete query.keyword;
    router.push({
      pathname: router.pathname,
      query: { ...query, page: 1 },
    });
  }

  function goToPage(page: number) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  }

  async function sendDeleteRequest(roleId: number) {
    try {
      await RoleService.deleteRole({ roleId });
      toast.success('Role successfully deleted!');
      const { pagination, filter } = userRoleListPageState;
      const { page, limit } = pagination;
      const { keyword } = filter;
      await fetchRoles(
        {
          page,
          limit,
        },
        keyword
      );
    } catch (error) {
      handleHttpRequestError({
        error,
        badRequestCallback(_, message) {
          toast.error(message);
        },
      });
    }
  }

  async function handleDelete(roleId: number) {
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
              sendDeleteRequest(roleId);
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

  function displaySearchModal(display: boolean) {
    setUserRoleListPageState((prevState) => ({
      ...prevState,
      displaySearchModal: display,
    }));
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Roles</title>
      </Head>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Users',
              link: '/roles',
              active: false,
            },
            {
              title: 'Roles',
              link: '/dashboard/users/roles/list?page=1&limit=10',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className="col-lg-12">
            <Table title="Roles" isLoading={userRoleListPageState.loading}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnRoleSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => displaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <Link href="/dashboard/users/roles/create" className="btn btn-outline-success">
                    <i className="bi bi-plus-circle-fill"></i> New
                  </Link>
                </div>
              </TableHeader>
              <TableBody>
                <thead>
                  <tr>
                    <th style={{ width: '20px' }}>Actions</th>
                    <th style={{ width: '50px' }}>ID</th>
                    <th>Name</th>
                    <th style={{ width: '20px' }}>Count</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {userRoleListPageState.roles.map((role: any) => {
                    return (
                      <tr key={role.id}>
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
                            <Link className="dropdown-item" href={`/dashboard/users/roles/${role.id}`}>
                              <i className="bi bi-pen-fill text-info"></i> Edit
                            </Link>
                            <button className="dropdown-item" onClick={() => handleDelete(role.id)}>
                              <i className="bi bi-trash3-fill text-danger"></i> Delete
                            </button>
                          </div>
                        </td>
                        <td scope="row">{role.id}</td>
                        <td>{role.name}</td>
                        <td>
                          <span className="badge rounded-pill text-bg-primary">{role.userCount}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableBody>
              <TablePagination pagination={userRoleListPageState.pagination} goToPage={goToPage} />
            </Table>
          </div>
        </div>
      </div>
      {/* Modals */}
      <RoleSearchModal
        showModal={userRoleListPageState.displaySearchModal}
        handleOnChange={(v) => {
          setUserRoleListPageState((prevState) => ({
            ...prevState,
            filter: {
              keyword: v,
            },
          }));
        }}
        keyword={userRoleListPageState.filter.keyword as string}
        onClose={() => displaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
    </DashboardLayout>
  );
}
