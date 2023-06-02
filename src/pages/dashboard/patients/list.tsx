import Link from 'next/link';
import { Breadcrumbs } from '../../../components/shared/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../components/shared/tables';
import DashboardLayout from '../../../layouts/dashboard-layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { authenticatedRequest } from '../../../utils/axios-util';
import { handleHttpRequestError } from '../../../utils/error-handling';
import { toast } from 'react-toastify';
import qs from 'querystring';
import SearchModal from '../../../components/dashboard/patients/search-modal';
import Head from 'next/head';

export default function PatientsList() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Search Fields
   */
  const [qFirstName, setQFirstName] = useState(_.get(router, 'query.firstName', ''));
  const [qLastName, setQLastName] = useState(_.get(router, 'query.lastName', ''));
  const [qControlNo, setQControlNo] = useState(_.get(router, 'query.controlNo', ''));
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
   * Get Patients
   */
  useEffect(() => {
    async function getPatients() {
      if (!optionRoles.length) {
        return;
      }

      let { page, limit, firstName: queryFirstName, lastName: queryLastName, controlNo: queryControlNo } = router.query;

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

      if (queryControlNo) {
        setQControlNo(queryControlNo);
      } else {
        queryControlNo = '';
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
        await fetchPatients({
          _page: Number(page),
          _limit: Number(limit),
          queryFirstName: queryFirstName as string,
          queryLastName: queryLastName as string,
          queryControlNo: queryControlNo as string,
          queryFilterRole: queryFilterRole as string[],
        });
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
    getPatients();
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

  async function fetchPatients(params: {
    _page: number;
    _limit: number;
    queryFirstName: string;
    queryLastName: string;
    queryControlNo: string;
    queryFilterRole: any[];
  }) {
    const { _page, _limit, queryFirstName, queryLastName, queryControlNo, queryFilterRole = [] } = params;
    try {
      let requestUrl = `/patient?page=${_page}&limit=${_limit}`;

      if (queryFirstName || queryLastName || queryControlNo) {
        if (queryFirstName) {
          requestUrl = `${requestUrl}&firstName=${queryFirstName}`;
        }
        if (queryLastName) {
          requestUrl = `${requestUrl}&lastName=${queryLastName}`;
        }
        if (queryControlNo) {
          requestUrl = `${requestUrl}&controlNo=${queryControlNo}`;
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
      setPatients(responseData.patients);
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
      await fetchPatients({
        _page: Number(page),
        _limit: Number(limit),
        queryFirstName: qFirstName as string,
        queryLastName: qLastName as string,
        queryControlNo: qControlNo as string,
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
      controlNo: qControlNo,
      role: selectedRoles.map((role: any) => role.value),
    } as any;
    router.push(`/dashboard/patients/list?${qs.encode(query)}`);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, firstName: qFirstName, lastName: qLastName, controlNo: qControlNo },
    });
  }

  function handleOnClearSearch() {
    setDisplaySearchModal(false);
    setQFirstName('');
    setQLastName('');
    setQControlNo('');
    const query: any = { ...router.query, page: 1 };
    delete query.firstName;
    delete query.lastName;
    delete query.controlNo;

    router.push({
      pathname: router.pathname,
      query,
    });
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Patients</title>
      </Head>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Patients',
              link: '',
              active: false,
            },
            {
              title: 'Patient Lists',
              link: '/dashboard/patients/list?page=1&limit=10',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className="col-lg-12">
            <Table title="Patients" isLoading={loading}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnPatientSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => setDisplaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <Link href="/dashboard/patients/demographics" className="btn btn-outline-success">
                    <i className="bi bi-plus-circle-fill"></i> New
                  </Link>
                </div>
              </TableHeader>
              <TableBody>
                <thead>
                  <tr>
                    <th style={{ width: '20px' }}>Actions</th>
                    <th style={{ width: '20px' }}>Control No</th>
                    <th style={{ width: '20px' }}>Avatar</th>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {patients.map((patient: any) => {
                    return (
                      <tr key={patient.id}>
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
                            <Link className="dropdown-item" href={`/dashboard/patients/demographics/${patient.id}`}>
                              <i className="bi bi-person-vcard-fill text-info"></i> Demographics
                            </Link>
                            <Link className="dropdown-item" href={`/dashboard/patients/additional-data/${patient.id}`}>
                              <i className="bi bi-clipboard-data-fill text-info"></i> Additional Data
                            </Link>
                            <Link className="dropdown-item" href={`/dashboard/patients/documents/${patient.id}`}>
                              <i className="bi bi-file-earmark-medical-fill text-info"></i> Documents
                            </Link>
                            <button className="dropdown-item" onClick={() => handleDelete(patient.id)}>
                              <i className="bi bi-trash3-fill text-danger"></i> Delete
                            </button>
                          </div>
                        </td>
                        <td scope="row">{`${_.get(patient, 'controlNo', '')}`.toUpperCase()}</td>
                        <td scope="row">
                          <div className="rounded-circle overflow-hidden shadow" style={{ width: 60, height: 60 }}>
                            <img
                              src={`${process.env.FILE_UPLOADS_URL}/patient/photos/${patient.profilePhoto}`}
                              alt="Avatar"
                              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                            />
                          </div>
                        </td>
                        <td>{patient.firstName}</td>
                        <td>{patient.middleName}</td>
                        <td>{patient.lastName}</td>
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
        controlNo={qControlNo as string}
        onChangeControlNo={setQControlNo}
        showModal={displaySearchModal}
        onClose={() => setDisplaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
    </DashboardLayout>
  );
}
