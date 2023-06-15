import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import qs from 'querystring';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../components/shared/breadcrumbs';
import Table, { TableBody, TableHeader, TablePagination } from '../../../components/shared/tables';
import { authenticatedRequest } from '../../../utils/axios-util';
import { handleHttpRequestError } from '../../../utils/error-handling';
import FilterModal from '../../../components/dashboard/services/filter-modal';
import { ServiceCategories } from '../../../constants/service.constant';
import DashboardLayout from '../../../layouts/dashboard-layout';
import SearchModal from '../../../components/dashboard/services/search-modal';
import Head from 'next/head';
import { Service } from '../../../models/service.model';
import { DEFAULT_PAGINATION, Pagination } from '../../../dtos/shared.dto';

interface ServiceListPageState {
  services: Service[];
  search: {
    name: string;
  };
  filter: {
    category: any;
  };
  optionCategories: any[];
  selectedCategories: any[];
  pagination: Pagination;
  loading: boolean;
  displaySearchModal: boolean;
  displayFilterModal: boolean;
}

export default function ServicesListPage() {
  const router = useRouter();

  const [serviceListPageState, setServiceListPageState] = useState<ServiceListPageState>({
    services: [],
    search: {
      name: '',
    },
    filter: {
      category: '',
    },
    optionCategories: [],
    selectedCategories: [],
    pagination: DEFAULT_PAGINATION,
    loading: true,
    displayFilterModal: false,
    displaySearchModal: false,
  });

  /**
   * Get Services
   */
  useEffect(() => {
    async function getServices() {
      if (serviceListPageState.optionCategories.length > 0 && !_.isEmpty(router.query)) {
        let { page, limit, name: queryName, category: queryFilterCategory } = router.query;

        const updatedPaginationState = {
          page: Number(page),
          limit: Number(limit),
        };

        const updatedSearchState = {
          name: queryName,
        };

        let updatedFilterState = {
          category: [],
        };
        if (queryFilterCategory) {
          const selectedCategories = serviceListPageState.optionCategories.filter((option: any) => {
            return _.includes(queryFilterCategory, option.value);
          });
          updatedFilterState = {
            category: selectedCategories as any,
          };
        }

        await fetchServices({
          pagination: updatedPaginationState,
          search: updatedSearchState,
          filter: updatedFilterState,
        });
      }
    }
    getServices();
  }, [router.query, serviceListPageState.optionCategories]);

  /**
   * Get Categories
   */
  useEffect(() => {
    async function getCategories() {
      await fetchCategories();
    }
    getCategories();
  }, []);

  async function fetchServices(params: { pagination: any; search: any; filter: any }) {
    const { pagination, search, filter } = params;
    const { page, limit } = pagination;
    const { name } = search;
    const { category } = filter;
    try {
      let requestUrl = `/service?page=${page}&limit=${limit}`;

      if (name) {
        requestUrl = `${requestUrl}&name=${name}`;
      }

      if (category) {
        requestUrl = `${requestUrl}&category=${category}`;
      }

      const response = await authenticatedRequest.get(requestUrl);
      const {
        data: { data: responseData },
      } = response;
      setServiceListPageState((prevState) => ({
        ...prevState,
        pagination: responseData.pagination,
        services: responseData.services,
      }));
    } catch (error) {
      handleHttpRequestError({
        error,
      });
    } finally {
      setTimeout(() => {
        setServiceListPageState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }, 200);
    }
  }

  async function fetchCategories() {
    const serviceCategories = _.keys(ServiceCategories).map((key) => _.get(ServiceCategories, key, ''));
    const optionsServiceCategories = serviceCategories.map((category: any) => ({
      value: category.id,
      label: category.name,
    }));
    setServiceListPageState((prevState) => ({
      ...prevState,
      optionCategories: optionsServiceCategories,
    }));
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
    const { pagination, search, filter } = serviceListPageState;
    try {
      await authenticatedRequest.delete(`/service/${serviceId}`);
      toast.success('Service successfully deleted!');
      await fetchServices({
        pagination,
        search,
        filter,
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
    setServiceListPageState((prevState) => ({
      ...prevState,
      displaySearchModal: display,
    }));
  }

  function handleOnSearch() {
    displaySearchModal(false);
    const { search, filter } = serviceListPageState;
    const { name } = search;
    const { category } = filter;
    const query = {
      ...router.query,
      page: 1,
      name,
    } as any;

    if (category) {
      query.category = category;
    }
    router.push(`/dashboard/services/list?${qs.encode(query)}`);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1 },
    });
  }

  function handleOnClearSearch() {
    displaySearchModal(false);
    const query: any = { ...router.query, page: 1 };
    delete query.name;
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function displayFilterModal(display: boolean) {
    setServiceListPageState((prevState) => ({
      ...prevState,
      displayFilterModal: display,
    }));
  }

  function handleOnFilter() {
    const { filter } = serviceListPageState;
    const { category } = filter;
    displayFilterModal(false);
    const query = {
      ...router.query,
      page: 1,
      category: category.value,
    } as any;
    router.push(`/dashboard/services/list?${qs.encode(query)}`);
  }

  function handleOnClearFilter() {
    displayFilterModal(false);
    const query: any = {
      ...router.query,
    };
    delete query.category;
    router.push(`/dashboard/services/list?${qs.encode(query)}`);
  }

  function handleOnSearchValueChange(field: string, value: any) {
    setServiceListPageState((prevState) => ({
      ...prevState,
      search: {
        ...prevState.search,
        [field]: value,
      },
    }));
  }

  function handleOnFilterValueChange(field: string, value: any) {
    setServiceListPageState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        [field]: value,
      },
    }));
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Offered Services</title>
      </Head>

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
            <Table title="Offered Services" isLoading={serviceListPageState.loading}>
              <TableHeader>
                <h4 className="card-title mb-0"></h4>
                <div className="btn-group">
                  <button
                    id="btnServiceSearchModal"
                    className="btn btn-outline-primary"
                    onClick={() => displaySearchModal(true)}>
                    <i className="bi bi-search"></i> Search
                  </button>
                  <button
                    id="btnServiceFilterModal"
                    className="btn btn-outline-dark"
                    onClick={() => displayFilterModal(true)}>
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
                  {serviceListPageState.services.map((service: any) => {
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
                              const selectedCategory = _.find(serviceListPageState.optionCategories, {
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
              <TablePagination pagination={serviceListPageState.pagination} goToPage={goToPage} />
            </Table>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal
        name={serviceListPageState.search.name}
        onChangeName={(v) => handleOnSearchValueChange('name', v)}
        showModal={serviceListPageState.displaySearchModal}
        onClose={() => displaySearchModal(false)}
        handleOnSearch={handleOnSearch}
        handleOnClearSearch={handleOnClearSearch}
      />
      {serviceListPageState.loading ? null : (
        <FilterModal
          selectedCategory={serviceListPageState.filter.category}
          optionCategories={serviceListPageState.optionCategories}
          handleOnChange={(v) => handleOnFilterValueChange('category', v)}
          showModal={serviceListPageState.displayFilterModal}
          onClose={() => displayFilterModal(false)}
          handleOnFilter={handleOnFilter}
          handleOnClearFilter={handleOnClearFilter}
        />
      )}
    </DashboardLayout>
  );
}
