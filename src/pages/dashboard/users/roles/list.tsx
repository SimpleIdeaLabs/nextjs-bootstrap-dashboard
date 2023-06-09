import Link from 'next/link';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../../components/tables';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import SearchModal from './_components/search-modal';
import { useEffect, useState } from 'react';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { toast } from 'react-toastify';

export default function UserRolesList() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [keyword, setKeyword] = useState(_.get(router, 'query.keyword', ''));
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalNumberOfPages: 0,
  });
  const [displaySearchModal, setDisplaySearchModal] = useState(false);

  useEffect(() => {
    async function getRoles() {
      const page = router.query.page;
      const limit = router.query.limit;
      let queryKeyword = router.query.keyword;

      if (queryKeyword) {
        setKeyword(queryKeyword);
      } else {
        queryKeyword = '';
      }

      if (page && limit) {
        fetchRoles(+page, +limit, keyword as string);
      }
    }
    getRoles();
  }, [router.query.keyword, router.query.page, router.query.limit]);

  async function fetchRoles(_page: number, _limit: number, _keyword: string) {
    try {
      const response = await authenticatedRequest.get(`/role?page=${_page}&limit=${_limit}&keyword=${_keyword}`);
      const {
        data: { data: responseData },
      } = response;
      setPagination({
        ...responseData.pagination,
      });
      setRoles(responseData.roles);
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    }
  }

  function handleOnSearch() {
    setDisplaySearchModal(false);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, keyword, page: 1 },
    });
  }

  function handleOnClearSearch() {
    setDisplaySearchModal(false);
    setKeyword('');
    router.push({
      pathname: router.pathname,
      query: { ...router.query, keyword: '', page: 1 },
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
      await authenticatedRequest.delete(`/role/${roleId}`);
      toast.success('Role successfully deleted!');
      const { page, limit } = pagination;
      await fetchRoles(page, limit, keyword as string);
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

  return (
    <DashboardLayout>
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
            <Table title="Roles" isLoading={false}>
              <TableHeader>
                <h4 className="card-title mb-0">Roles</h4>
                <div className="btn-group">
                  <button
                    id="btnRoleSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => setDisplaySearchModal(true)}>
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
                  {roles.map((role: any) => {
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
              <TablePagination pagination={pagination} goToPage={goToPage} />
            </Table>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal
        showModal={displaySearchModal}
        handleOnChange={(v) => setKeyword(v)}
        keyword={keyword as string}
        onClose={() => setDisplaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
    </DashboardLayout>
  );
}
