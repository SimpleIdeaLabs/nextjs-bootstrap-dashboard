import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import qs from 'querystring';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../../components/shared/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../../components/shared/tables';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import SearchModal from '../../../../components/dashboard/settings/document-types/search-modal';
import { FileTypes } from '../../../../constants/file-types.constants';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import { DEFAULT_PAGINATION, Pagination } from '../../../../dtos/shared.dto';

interface DocumentTypeListState {
  documentTypes: any[];
  search: {
    name: string;
  };
  pagination: Pagination;
  loading: boolean;
  displaySearchModal: boolean;
}

export default function DocumentTypesListPage() {
  const router = useRouter();
  const [documentTypeListState, setDocumentTypeListState] = useState<DocumentTypeListState>({
    documentTypes: [],
    search: {
      name: '',
    },
    pagination: DEFAULT_PAGINATION,
    loading: true,
    displaySearchModal: false,
  });

  /**
   * Get Document Types
   */
  useEffect(() => {
    if (!_.isEmpty(router.query)) {
      let { page, limit, name: queryName } = router.query;

      const updatedPaginationState = {
        page: Number(page),
        limit: Number(limit),
      };

      const updatedSearchState = {
        name: queryName,
      };

      fetchDocumentTypes({
        pagination: updatedPaginationState,
        search: updatedSearchState,
      });
    }
  }, [router.query]);

  async function fetchDocumentTypes(params: { pagination: any; search: any }) {
    setDocumentTypeListState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    const { pagination, search } = params;
    const { page, limit } = pagination;
    const { name = '' } = search;
    try {
      let requestUrl = `/document-type?page=${page}&limit=${limit}`;

      if (name) {
        requestUrl = `${requestUrl}&name=${name}`;
      }
      const response = await authenticatedRequest.get(requestUrl);
      const {
        data: { data: responseData },
      } = response;
      setDocumentTypeListState((prevState) => ({
        ...prevState,
        documentTypes: responseData.documentTypes,
        pagination: responseData.pagination,
      }));
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    } finally {
      setTimeout(() => {
        setDocumentTypeListState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  async function handleDelete(documentTypeId: number) {
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
              sendDeleteRequest(documentTypeId);
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

  async function sendDeleteRequest(documentTypeId: number) {
    try {
      const { pagination, search } = documentTypeListState;
      await authenticatedRequest.delete(`/document-type/${documentTypeId}`);
      toast.success('Service successfully deleted!');
      const { page, limit } = pagination;
      await fetchDocumentTypes({
        pagination,
        search,
      });
    } catch (error) {
      handleHttpRequestError({
        error,
        badRequestCallback(_, message: any) {
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

  function displaySearchModal(display: boolean) {
    setDocumentTypeListState((prevState) => ({
      ...prevState,
      displaySearchModal: display,
    }));
  }

  function handleSearchValueChange(field: string, value: any) {
    setDocumentTypeListState((prevState) => ({
      ...prevState,
      search: {
        ...prevState.search,
        [field]: value,
      },
    }));
  }

  function handleOnSearch() {
    displaySearchModal(false);
    const { search } = documentTypeListState;
    const { name = '' } = search;
    const query = {
      ...router.query,
      page: 1,
    } as any;

    if (name) {
      query.name = name;
    }

    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    });
  }

  function handleOnClearSearch() {
    displaySearchModal(false);
    setDocumentTypeListState((prevState) => ({
      ...prevState,
      search: {
        name: '',
      },
    }));
    const query: any = { ...router.query, page: 1 };
    delete query.name;
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  const { documentTypes = [], loading, search, pagination } = documentTypeListState;
  const { name = '' } = search;
  return (
    <DashboardLayout>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Settings',
              link: '/',
              active: false,
            },
            {
              title: 'Document Types',
              link: '/dashboard/settings/document-types/list?page=1&limit=10',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className="col-lg-12">
            <Table title="Offered Services" isLoading={loading}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnServiceSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => displaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <Link href="/dashboard/settings/document-types/create" className="btn btn-outline-success">
                    <i className="bi bi-plus-circle-fill"></i> New
                  </Link>
                </div>
              </TableHeader>
              <TableBody>
                <thead>
                  <tr>
                    <th style={{ width: '20px' }}>Actions</th>
                    <th style={{ width: '20px' }}>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {documentTypes.map((documentType: any) => {
                    return (
                      <tr key={documentType.id}>
                        <td scope="row">
                          <button
                            className="btn btn-sm btn-light rounded"
                            type="button"
                            id="triggerId"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-start" aria-labelledby="triggerId">
                            <Link
                              className="dropdown-item"
                              href={`/dashboard/settings/document-types/${documentType.id}`}>
                              <i className="bi bi-pen-fill text-info"></i> Edit
                            </Link>
                            <button className="dropdown-item" onClick={() => handleDelete(documentType.id)}>
                              <i className="bi bi-trash3-fill text-danger"></i> Delete
                            </button>
                          </div>
                        </td>
                        <td scope="row">{documentType.id}</td>
                        <td>{documentType.name}</td>
                        <td>
                          {documentType.fileTypes.map((fileTypeId: any) => {
                            const fileType = _.find(FileTypes, {
                              id: +fileTypeId,
                            });
                            if (!fileType) {
                              return null;
                            }
                            return (
                              <span key={fileType.id} className="badge bg-primary me-1">
                                {fileType.name}
                              </span>
                            );
                          })}
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
        name={name}
        onChangeName={(v) => handleSearchValueChange('name', v)}
        showModal={documentTypeListState.displaySearchModal}
        onClose={() => displaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
    </DashboardLayout>
  );
}
