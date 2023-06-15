import _ from 'lodash';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SearchModal from '../../../components/dashboard/patients/search-modal';
import { Breadcrumbs } from '../../../components/shared/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../components/shared/tables';
import { DEFAULT_PAGINATION, Pagination } from '../../../dtos/shared.dto';
import DashboardLayout from '../../../layouts/dashboard-layout';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { handleHttpRequestError } from '../../../utils/error-handling';

interface PatientListPageState {
  patients: Patient[];
  search: {
    firstName: string;
    lastName: string;
    controlNo: string;
  };
  pagination: Pagination;
  loading: boolean;
  displaySearchModal: boolean;
}

export default function PatientsList() {
  const router = useRouter();
  const [patientListPageState, setPatientListPageState] = useState<PatientListPageState>({
    patients: [],
    search: {
      firstName: '',
      lastName: '',
      controlNo: '',
    },
    pagination: DEFAULT_PAGINATION,
    loading: true,
    displaySearchModal: false,
  });

  /**
   * Get Patients
   */
  useEffect(() => {
    if (!_.isEmpty(router.query)) {
      const updatedPaginationState = {
        page: parseInt(router.query.page as string),
        limit: parseInt(router.query.limit as string),
      };

      const updatedSearchState = {
        firstName: router.query.firstName as string,
        lastName: router.query.lastName as string,
        controlNo: router.query.controlNo as string,
      };

      setPatientListPageState((prevState) => ({
        ...prevState,
        search: updatedSearchState,
        pagination: {
          ...prevState.pagination,
          ...updatedPaginationState,
        },
        loading: true,
      }));

      fetchPatients({
        pagination: updatedPaginationState,
        search: updatedSearchState,
      });
    }
  }, [router.query]);

  async function fetchPatients(params: { pagination: any; search: any }) {
    try {
      const { pagination, search } = params;
      const { patients = [], pagination: paginationResponse } = await PatientService.getPatientList({
        pagination,
        search,
      });

      setPatientListPageState((prevState) => ({
        ...prevState,
        patients,
        pagination: paginationResponse,
      }));
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    } finally {
      setTimeout(() => {
        setPatientListPageState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
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

  async function sendDeleteRequest(patientId: number) {
    try {
      await PatientService.deletePatient({
        patientId,
      });
      toast.success('Patient successfully deleted!');
      const { pagination, search } = patientListPageState;
      fetchPatients({
        pagination,
        search,
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
    displaySearchModal(false);
    const { search } = patientListPageState;
    const { firstName = '', lastName = '', controlNo = '' } = search;
    const query = {
      ...router.query,
      page: 1,
    } as any;

    if (firstName) {
      query.firstName = firstName;
    }

    if (lastName) {
      query.lastName = lastName;
    }

    if (controlNo) {
      query.controlNo = controlNo;
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function handleOnClearSearch() {
    displaySearchModal(false);
    const query: any = { ...router.query, page: 1 };
    delete query.firstName;
    delete query.lastName;
    delete query.controlNo;
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function displaySearchModal(display: boolean) {
    setPatientListPageState((prevState) => ({
      ...prevState,
      displaySearchModal: display,
    }));
  }

  function handleSearchValueChange(field: string, value: any) {
    setPatientListPageState((prevState) => ({
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
            <Table title="Patients" isLoading={patientListPageState.loading}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnPatientSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => displaySearchModal(true)}>
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
                  {patientListPageState.patients.map((patient: any) => {
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
              <TablePagination pagination={patientListPageState.pagination} goToPage={goToPage} />
            </Table>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal
        firstName={patientListPageState.search.firstName}
        onChangeFirstName={(v) => handleSearchValueChange('firstName', v)}
        lastName={patientListPageState.search.lastName}
        onChangeLastName={(v) => handleSearchValueChange('lastName', v)}
        controlNo={patientListPageState.search.controlNo}
        onChangeControlNo={(v) => handleSearchValueChange('controlNo', v)}
        showModal={patientListPageState.displaySearchModal}
        onClose={() => displaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
    </DashboardLayout>
  );
}
