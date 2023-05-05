import _, { set } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import Form, { FormAction, FormBody } from '../../../../components/form';
import Input from '../../../../components/form/inputs';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import ProfilePhotoModal from './profile-photo-modal';
import { ServiceCategories } from '../../../../constants/service.constant';

interface ServiceFormProps {
  mode: 'create' | 'edit';
  serviceId?: any;
  handleOnFormSubmit: (payload: any) => void;
}

export default function ServiceForm(props: ServiceFormProps) {
  const router = useRouter();
  const { serviceId = null } = props;
  const [logo, setLogo] = useState<any>(null);
  const [logoError, setLogoError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [optionCategories, setOptionCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [categoryError, setCategoryError] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [price, setPrice] = useState<any>('');
  const [priceError, setPriceError] = useState('');
  const [displayProfilePhotoModal, setDisplayProfilePhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = props;

  const formProperties = (function () {
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
    async function getData() {
      /**
       * Fetch Service Data
       * If mode is on Edit
       */
      if (mode === 'edit' && serviceId) {
        await fetchServiceData(Number(serviceId as string));
      }
      await fetchCategories();
      setIsLoading(false);
    }
    getData();
  }, [mode, serviceId, isLoading]);

  /**
   * Fetch Categories
   */
  async function fetchCategories() {
    const serviceCategories = _.keys(ServiceCategories).map((key) => _.get(ServiceCategories, key, ''));
    const optionsServiceCategories = serviceCategories.map((category: any) => ({
      value: category.id,
      label: category.name,
    }));
    setOptionCategories(optionsServiceCategories);
  }

  /**
   * Fetch Service
   */
  async function fetchServiceData(serviceId: number) {
    const response = await authenticatedRequest.get(`/service/${serviceId}`);
    const {
      data: { data: responseData },
    } = response;
    const { service = null } = responseData;
    if (service) {
      const rawLogo = _.get(service, 'logo', '');
      if (rawLogo) {
        const logoUrl = `${process.env.FILE_UPLOADS_URL}/services/${rawLogo}`;
        const logoBlob = await fetch(logoUrl).then((response) => response.blob());
        const logoObjectUrl = URL.createObjectURL(logoBlob);
        setLogo({ preview: logoObjectUrl });
      }
      setName(_.get(service, 'name', ''));
      const selectedCategory = _.find(optionCategories, {
        value: _.get(service, 'category', ''),
      });
      setCategory(selectedCategory);
      setPrice(_.get(service, 'price', ''));
      setDescription(_.get(service, 'description', ''));
    }
  }

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
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
          setLogoError(_.get(validationErrors, 'logo', null));
          setNameError(_.get(validationErrors, 'name', null));
          setCategoryError(_.get(validationErrors, 'category', null));
          setDescriptionError(_.get(validationErrors, 'description', null));
          setPriceError(_.get(validationErrors, 'price', null));
        },
      });
    }
  }

  function resetErrors() {
    setNameError('');
    setLogoError('');
    setCategoryError('');
    setDescriptionError('');
    setPriceError('');
  }

  if (isLoading) {
    return null;
  }

  if (mode == 'edit' && !category) {
    return null;
  }

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
            <Form title={formProperties.formLabel}>
              <FormBody>
                <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                  <img
                    style={{ width: 200, height: 200 }}
                    src={logo ? (logo as any).preview : 'https://via.placeholder.com/150'}
                    className={`rounded-circle align-self-center cursor-pointer shadow ${
                      logoError ? 'border border-danger' : ''
                    }`}
                    alt="Avatar"
                    onClick={() => setDisplayProfilePhotoModal(true)}
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
                  onValueChange={(v) => setName(v)}
                  error={nameError}
                />
                {!isLoading && optionCategories && optionCategories.length > 0 ? (
                  <Input
                    type="select"
                    label="Categories"
                    value={category}
                    id={'categories'}
                    options={optionCategories}
                    onValueChange={(categoriesId) => setCategory(categoriesId)}
                    error={categoryError}
                  />
                ) : null}
                <Input
                  type="text"
                  label="Description"
                  id={'description'}
                  value={description}
                  onValueChange={(v) => setDescription(v)}
                  error={descriptionError}
                />
                <Input
                  type="number"
                  label="Price"
                  id={'price'}
                  value={price}
                  onValueChange={(v) => setPrice(v)}
                  error={priceError}
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
        onClose={() => setDisplayProfilePhotoModal(false)}
        profilePhoto={logo}
        onUpdateProfilePhoto={(newPhoto) => setLogo(newPhoto)}
      />
    </>
  );
}
