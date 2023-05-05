import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import qs from 'querystring';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../components/tables';
import { authenticatedRequest } from '../../../utils/axios-util';
import { handleHttpRequestError } from '../../../utils/error-handling';
import FilterModal from './_components/filter-modal';
import SearchModal from './_components/search-modal';
import { ServiceCategories } from '../../../constants/service.constant';

export default function ServicesListPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Search Fields
   */
  const [qName, setQName] = useState(_.get(router, 'query.name', ''));
  const [displaySearchModal, setDisplaySearchModal] = useState(false);

  /**
   * Filter Fields
   */
  const [optionCategories, setOptionCategories] = useState<any[]>([]);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState(router.query['category']);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);

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
   * Get Services
   */
  useEffect(() => {
    async function getServices() {
      if (!optionCategories.length) {
        return;
      }

      let { page, limit, name: queryName, category: queryFilterCategory } = router.query;

      if (queryName) {
        setQName(queryName);
      } else {
        queryName = '';
      }

      if (queryFilterCategory) {
        setFilterCategory(queryFilterCategory);
        const _selectedCategory = optionCategories.filter((option: any) => {
          return _.includes(queryFilterCategory, option.value);
        });
        setSelectedCategory(_selectedCategory);
      } else {
        queryFilterCategory = '';
        setSelectedCategory('');
      }

      if (page && limit) {
        await fetchServices({
          _page: Number(page),
          _limit: Number(limit),
          queryName: queryName as string,
          queryFilterCategory: queryFilterCategory as string,
        });
        setIsLoading(false);
      }
    }
    getServices();
  }, [router.query, optionCategories]);

  /**
   * Get Categories
   */
  useEffect(() => {
    async function getCategories() {
      await fetchCategories();
    }
    getCategories();
  }, []);

  async function fetchServices(params: { _page: number; _limit: number; queryName: string; queryFilterCategory: any }) {
    const { _page, _limit, queryName, queryFilterCategory = [] } = params;
    try {
      let requestUrl = `/service?page=${_page}&limit=${_limit}`;

      if (queryName) {
        requestUrl = `${requestUrl}&name=${queryName}`;
      }

      if (queryFilterCategory) {
        requestUrl = `${requestUrl}&category=${queryFilterCategory}`;
      }

      const response = await authenticatedRequest.get(requestUrl);
      const {
        data: { data: responseData },
      } = response;
      setPagination({
        ...responseData.pagination,
      });
      setServices(responseData.services);
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    }
  }

  async function fetchCategories() {
    const serviceCategories = _.keys(ServiceCategories).map((key) => _.get(ServiceCategories, key, ''));
    const optionsServiceCategories = serviceCategories.map((category: any) => ({
      value: category.id,
      label: category.name,
    }));
    setOptionCategories(optionsServiceCategories);
  }

  async function handleDelete(serviceId: number) {
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
              sendDeleteRequest(serviceId);
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

  async function sendDeleteRequest(serviceId: number) {
    try {
      await authenticatedRequest.delete(`/service/${serviceId}`);
      toast.success('Service successfully deleted!');
      const { page, limit } = pagination;
      await fetchServices({
        _page: Number(page),
        _limit: Number(limit),
        queryName: qName as string,
        queryFilterCategory: filterCategory,
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
    if (filterCategory) {
      query.category = filterCategory;
    }
    router.push(`/dashboard/services/list?${qs.encode(query)}`);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, name: qName, category: filterCategory },
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

  function handleOnFilter() {
    setDisplayFilterModal(false);
    console.log(selectedCategory);
    const query = {
      ...router.query,
      page: 1,
      category: selectedCategory.value,
    } as any;
    router.push(`/dashboard/services/list?${qs.encode(query)}`);
  }

  function handleOnClearFilter() {
    setDisplayFilterModal(false);
    setSelectedCategory(null);
    const query: any = {
      ...router.query,
    };
    delete query.category;
    router.push(`/dashboard/services/list?${qs.encode(query)}`);
  }

  return (
    <>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Services',
              link: '/',
              active: false,
            },
            {
              title: 'Offered Services',
              link: '/dashboard/services/list?page=1&limit=10',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className="col-lg-12">
            <Table title="Offered Services" isLoading={false}>
              <TableHeader>
                <h4 className="card-title mb-0">Offered Services</h4>
                <div className="btn-group">
                  <button
                    id="btnServiceSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => setDisplaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <button
                    id="btnServiceFilterModal"
                    className="btn btn-outline-dark"
                    onClick={() => setDisplayFilterModal(true)}>
                    <i className="bi bi-funnel-fill"></i> Filter
                  </button>
                  <Link href="/dashboard/services/create" className="btn btn-outline-success">
                    <i className="bi bi-plus-circle-fill"></i> New
                  </Link>
                </div>
              </TableHeader>
              <TableBody>
                <thead>
                  <tr>
                    <th style={{ width: '20px' }}>Actions</th>
                    <th style={{ width: '20px' }}>ID</th>
                    <th style={{ width: '20px' }}>Logo</th>
                    <th>Name</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {services.map((service: any) => {
                    const selectedCategory = _.find(ServiceCategories);
                    return (
                      <tr key={service.id}>
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
                            <Link className="dropdown-item" href={`/dashboard/services/${service.id}`}>
                              <i className="bi bi-pen-fill text-info"></i> Edit
                            </Link>
                            <button className="dropdown-item" onClick={() => handleDelete(service.id)}>
                              <i className="bi bi-trash3-fill text-danger"></i> Delete
                            </button>
                          </div>
                        </td>
                        <td scope="row">{service.id}</td>
                        <td scope="row">
                          <div className="rounded-circle overflow-hidden shadow" style={{ width: 60, height: 60 }}>
                            <img
                              src={`${process.env.FILE_UPLOADS_URL}/services/${service.logo}`}
                              alt="Avatar"
                              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                            />
                          </div>
                        </td>
                        <td>{service.name}</td>
                        <td>
                          <span className="badge bg-primary me-1">
                            {(() => {
                              const selectedCategory = _.find(optionCategories, {
                                value: +service.category,
                              });
                              if (!selectedCategory) return null;
                              return selectedCategory.label;
                            })()}
                          </span>
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
      {isLoading ? null : (
        <FilterModal
          selectedCategory={selectedCategory}
          optionCategories={optionCategories}
          handleOnChange={setSelectedCategory}
          showModal={displayFilterModal}
          onClose={() => setDisplayFilterModal(false)}
          handleOnFilter={handleOnFilter}
          handleOnClearFilter={handleOnClearFilter}
        />
      )}
    </>
  );
}
