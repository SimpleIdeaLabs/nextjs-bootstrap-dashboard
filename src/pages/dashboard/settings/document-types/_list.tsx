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
import SearchModal from './_components/search-modal';
import { FileTypes } from '../../../../constants/file-types.constants';

export default function DocumentTypesListPage() {
  const router = useRouter();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Search Fields
   */
  const [qName, setQName] = useState(_.get(router, 'query.name', ''));
  const [displaySearchModal, setDisplaySearchModal] = useState(false);

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
   * Get Document Types
   */
  useEffect(() => {
    async function getDocumentTypes() {
      let { page, limit, name: queryName } = router.query;

      if (queryName) {
        setQName(queryName);
      } else {
        queryName = '';
      }

      if (page && limit) {
        await fetchDocumentTypes({
          _page: Number(page),
          _limit: Number(limit),
          queryName: queryName as string,
        });
        setIsLoading(false);
      }
    }
    getDocumentTypes();
  }, [router.query]);

  async function fetchDocumentTypes(params: { _page: number; _limit: number; queryName: string }) {
    const { _page, _limit, queryName } = params;
    try {
      let requestUrl = `/document-type?page=${_page}&limit=${_limit}`;

      if (queryName) {
        requestUrl = `${requestUrl}&name=${queryName}`;
      }
      const response = await authenticatedRequest.get(requestUrl);
      const {
        data: { data: responseData },
      } = response;
      setPagination({
        ...responseData.pagination,
      });
      setDocumentTypes(responseData.documentTypes);
    } catch (error) {
      handleHttpRequestError({
        error,
      });
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
      await authenticatedRequest.delete(`/document-type/${documentTypeId}`);
      toast.success('Service successfully deleted!');
      const { page, limit } = pagination;
      await fetchDocumentTypes({
        _page: Number(page),
        _limit: Number(limit),
        queryName: qName as string,
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

  function handleOnSearch() {
    setDisplaySearchModal(false);
    const query = {
      ...router.query,
      page: 1,
      name: qName as string,
    } as any;
    router.push(`/dashboard/settings/document-types/list?${qs.encode(query)}`);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, name: qName },
    });
  }

  function handleOnClearSearch() {
    setDisplaySearchModal(false);
    setQName('');
    const query: any = { ...router.query, page: 1 };
    delete query.name;

    router.push({
      pathname: router.pathname,
      query,
    });
  }

  return (
    <>
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
            <Table title="Offered Services" isLoading={false}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnServiceSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => setDisplaySearchModal(true)}>
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
        name={qName as string}
        onChangeName={setQName}
        showModal={displaySearchModal}
        onClose={() => setDisplaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
    </>
  );
}
