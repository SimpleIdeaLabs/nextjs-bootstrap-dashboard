import _, { set } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ServiceCategories } from '../../../constants/service.constant';
import { authenticatedRequest } from '../../../utils/axios-util';
import { handleHttpRequestError } from '../../../utils/error-handling';
import { Breadcrumbs } from '../../shared/breadcrumbs';
import Form, { FormBody, FormAction } from '../../shared/form';
import Input from '../../shared/form/inputs';
import ProfilePhotoModal from './profile-photo-modal';

interface ServiceFormProps {
  mode: 'create' | 'edit';
  serviceId?: any;
  handleOnFormSubmit: (payload: any) => void;
}

export interface ServiceFormValue {
  logo: any;
  name: string;
  category: any;
  description: string;
  price: string;
}

interface ServiceFormState {
  formValues: ServiceFormValue;
  optionCategories: any[];
  formErrors: any;
  loading: boolean;
  displayProfilePhotoModal: boolean;
}

export default function ServiceForm(props: ServiceFormProps) {
  const router = useRouter();
  const { serviceId = null, mode } = props;
  const [serviceFormState, setServiceFormState] = useState<ServiceFormState>({
    formValues: {
      logo: '',
      name: '',
      category: '',
      description: '',
      price: '',
    },
    optionCategories: [],
    formErrors: {},
    displayProfilePhotoModal: false,
    loading: false,
  });

  const formProperties = (function () {
    const { formValues } = serviceFormState;
    const { name } = formValues;

    if (mode === 'create') {
      return {
        formLabel: 'Create Service',
        buttonLabel: 'Create',
        successMessage: `${name} service is created!`,
        successRedirect: `/dashboard/services/list?page=1&limit=10`,
        breadcrumbLink: {
          title: 'Create',
          link: '/dashboard/services/create',
          active: true,
        },
      };
    } else {
      return {
        formLabel: 'Update Service',
        buttonLabel: 'Update',
        successMessage: `${name} service is updated!`,
        successRedirect: `/dashboard/services/list?page=1&limit=10`,
        breadcrumbLink: {
          title: `Update ${name}`,
          link: `/dashboard/services/${serviceId}`,
          active: true,
        },
      };
    }
  })();

  useEffect(() => {
    async function fetchCategories() {
      const serviceCategories = _.keys(ServiceCategories).map((key) => _.get(ServiceCategories, key, ''));
      const optionsServiceCategories = serviceCategories.map((category: any) => ({
        value: category.id,
        label: category.name,
      }));
      setServiceFormState((prevState) => ({
        ...prevState,
        optionCategories: optionsServiceCategories,
      }));
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function getData() {
      /**
       * Fetch Service Data
       * If mode is on Edit
       */
      setServiceFormState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      if (mode === 'edit' && serviceId && serviceFormState.optionCategories.length > 0) {
        await fetchServiceData(Number(serviceId as string));
      }
      setServiceFormState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
    getData();
  }, [serviceFormState.optionCategories, mode, serviceId]);

  /**
   * Fetch Service
   */
  async function fetchServiceData(serviceId: number) {
    const { optionCategories = [] } = serviceFormState;
    const response = await authenticatedRequest.get(`/service/${serviceId}`);
    const {
      data: { data: responseData },
    } = response;
    const { service = null } = responseData;
    if (service) {
      const rawLogo = _.get(service, 'logo', '');
      let logo: any = null;
      if (rawLogo) {
        const logoUrl = `${process.env.FILE_UPLOADS_URL}/services/${rawLogo}`;
        const logoBlob = await fetch(logoUrl).then((response) => response.blob());
        const logoObjectUrl = URL.createObjectURL(logoBlob);
        logo = { preview: logoObjectUrl };
      }
      const selectedCategory = _.find(optionCategories, {
        value: _.get(service, 'category', ''),
      });
      setServiceFormState((prevState) => ({
        ...prevState,
        formValues: {
          ...prevState.formValues,
          logo,
          name: _.get(service, 'name', ''),
          category: selectedCategory,
          price: _.get(service, 'price', ''),
          description: _.get(service, 'description', ''),
        },
      }));
    }
  }

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
    const { formValues } = serviceFormState;
    const { logo, name, category, description, price } = formValues;
    try {
      await handleOnFormSubmit({
        logo,
        name,
        category: _.get(category, 'value', ''),
        description,
        price,
      });
      resetErrors();
      toast.success(formProperties.successMessage);
      router.push(formProperties.successRedirect);
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setServiceFormState((prevState) => ({
            ...prevState,
            formErrors: {
              logo: _.get(validationErrors, 'logo', null),
              name: _.get(validationErrors, 'name', null),
              category: _.get(validationErrors, 'category', null),
              description: _.get(validationErrors, 'description', null),
              price: _.get(validationErrors, 'price', null),
            },
          }));
        },
      });
    }
  }

  function resetErrors() {
    setServiceFormState((prevState) => ({
      ...prevState,
      formErrors: {},
    }));
  }

  function handleValueChange(field: keyof typeof serviceFormState.formValues, value: any) {
    setServiceFormState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
  }

  function displayLogoModal(display: boolean) {
    setServiceFormState((prevState) => ({
      ...prevState,
      displayProfilePhotoModal: display,
    }));
  }

  const { formValues, formErrors, loading, optionCategories, displayProfilePhotoModal } = serviceFormState;
  const { logo, name, category, description, price } = formValues;
  const logoError = _.get(formErrors, 'logo', null);
  return (
    <>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Services',
              link: '/services',
              active: false,
            },
            {
              title: 'Offered Services',
              link: '/dashboard/services/list?page=1&limit=10',
              active: false,
            },
            formProperties.breadcrumbLink,
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title={formProperties.formLabel} loading={loading}>
              <FormBody>
                <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                  <img
                    style={{ width: 200, height: 200 }}
                    src={logo ? (logo as any).preview : 'https://via.placeholder.com/150'}
                    className={`rounded-circle align-self-center cursor-pointer shadow ${
                      logoError ? 'border border-danger' : ''
                    }`}
                    alt="Avatar"
                    onClick={() => displayLogoModal(true)}
                    onLoad={() => {
                      logo && URL.revokeObjectURL((logo as any).preview);
                    }}
                  />
                  {logoError && <p className="form-text text-danger">{logoError}</p>}
                </div>
                <hr className="my-4" />
                <Input
                  type="text"
                  label="Name"
                  id={'name'}
                  value={name}
                  onValueChange={(v) => handleValueChange('name', v)}
                  error={_.get(formErrors, 'name', null)}
                />
                {!loading && optionCategories && optionCategories.length > 0 ? (
                  <Input
                    type="select"
                    label="Categories"
                    value={category}
                    id={'categories'}
                    options={optionCategories}
                    onValueChange={(categoriesId) => handleValueChange('category', categoriesId)}
                    error={_.get(formErrors, 'category', null)}
                  />
                ) : null}
                <Input
                  type="text"
                  label="Description"
                  id={'description'}
                  value={description}
                  onValueChange={(v) => handleValueChange('description', v)}
                  error={_.get(formErrors, 'description', null)}
                />
                <Input
                  type="number"
                  label="Price"
                  id={'price'}
                  value={price}
                  onValueChange={(v) => handleValueChange('price', v)}
                  error={_.get(formErrors, 'price', null)}
                />
              </FormBody>
              <FormAction>
                <button className="btn btn-outline-primary btn-block" type="button" onClick={_handleOnformSubmit}>
                  {formProperties.buttonLabel}
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
      </div>
      <ProfilePhotoModal
        showModal={displayProfilePhotoModal}
        onClose={() => displayLogoModal(false)}
        profilePhoto={logo}
        onUpdateProfilePhoto={(newPhoto) => handleValueChange('logo', newPhoto)}
      />
    </>
  );
}
