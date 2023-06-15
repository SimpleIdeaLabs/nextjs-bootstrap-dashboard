import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Form, { FormAction, FormBody } from '../../../../components/shared/form';
import Input from '../../../../components/shared/form/inputs';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import { Breadcrumbs } from '../../../../components/shared/breadcrumbs';
import { provinces, searchBaranggay, searchMunicipality, searchProvince } from 'ph-geo-admin-divisions';
import ProfilePhotoModal from '../../../../components/dashboard/users/system-users/profile-photo-modal';
import DashboardLayout from '../../../../layouts/dashboard-layout';
import Spinner from '../../../../components/shared/spinner';

function HealthServiceDetailsPage() {
  const router = useRouter();
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [provinceOptions, setProvinceOptions] = useState<any[]>([]);
  const [province, setProvince] = useState<any>(null);
  const [provinceError, setProvinceError] = useState('');
  const [municipalitiesOptions, setMunicipalitiesOptions] = useState<any[]>([]);
  const [municipality, setMunicipality] = useState<any>(null);
  const [municipalityError, setMunicipalityError] = useState('');
  const [baranggayOptions, setBaranggayOptions] = useState<any[]>([]);
  const [baranggay, setBaranggay] = useState<any>(null);
  const [baranggayError, setBaranggayError] = useState('');
  const [logo, setLogo] = useState<any>(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactNoError, setContactNoError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [displayProfilePhotoModal, setDisplayProfilePhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      await fetchStoreData();
      const _provinceOptions = provinces.map((province) => ({
        value: province.provinceId,
        label: province.name,
      }));
      setProvinceOptions(_provinceOptions);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
    getData();
  }, []);

  /**
   * Fetch Store Details
   */
  async function fetchStoreData() {
    const response = await authenticatedRequest.get(`/store`);
    const {
      data: { data: responseData },
    } = response;
    const { store = null } = responseData;
    if (store) {
      const rawLogo = _.get(store, 'logo', '');
      if (rawLogo) {
        const logoUrl = `${process.env.FILE_UPLOADS_URL}/store/${rawLogo}`;
        const logoBlob = await fetch(logoUrl).then((response) => response.blob());
        const logoObjectURL = URL.createObjectURL(logoBlob);
        setLogo({ preview: logoObjectURL });
      }

      // address
      setAddress1(_.get(store, 'address1', ''));
      setAddress2(_.get(store, 'address2', ''));

      // province
      const storedProvince = _.get(store, 'stateOrProvince', null);
      if (storedProvince) {
        setProvince({
          value: storedProvince.provinceId,
          label: storedProvince.name,
        });
        setMunicipalitiesOptions(
          searchMunicipality({
            provinceId: storedProvince.provinceId,
          }).map((v) => ({
            value: v.municipalityId,
            label: v.name,
          }))
        );
      }

      // municipality
      const storedMunicipality = _.get(store, 'cityOrTown', null);
      if (storedMunicipality) {
        setMunicipality({
          value: storedMunicipality.municipalityId,
          label: storedMunicipality.name,
        });
        setBaranggayOptions(
          searchBaranggay({
            provinceId: storedMunicipality.provinceId,
            municipalityId: storedMunicipality.municipalityId,
          }).map((v) => ({
            value: v.baranggayId,
            label: v.name,
          }))
        );
      }

      // baranggay
      const storedBaranggay = _.get(store, 'baranggay', null);
      if (storedBaranggay) {
        setBaranggay({
          value: storedBaranggay.baranggayId,
          label: storedBaranggay.name,
        });
      }

      setName(_.get(store, 'name', ''));
      setContactNo(_.get(store, 'contactNo', ''));
      setEmail(_.get(store, 'email', ''));
    }
  }

  function resetErrors() {
    setNameError('');
    setContactNoError('');
    setEmailError('');
  }

  /**
   * Update Store
   */
  async function handleUpdateStore() {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('contactNo', contactNo);
      formData.append('email', email);
      formData.append('address1', address1);
      formData.append('address2', address2);
      formData.append('province', province.value);
      formData.append('municipality', municipality.value);
      formData.append('baranggay', baranggay.value);

      if (logo.path) {
        formData.append('logo', logo);
      }

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      const {
        data: { status, message },
      } = await authenticatedRequest.patch(`/store`, formData, config);
      if (!status) {
        throw new Error(message);
      }

      setTimeout(() => {
        setIsLoading(false);
        resetErrors();
        toast.success('Store successfully updated.');
        router.push('/dashboard/settings/health-service-details');
        setIsLoading(false);
      }, 400);
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setNameError(_.get(validationErrors, 'name', null));
          setEmailError(_.get(validationErrors, 'email', null));
          setContactNoError(_.get(validationErrors, 'contactNo', null));
        },
      });
      setIsLoading(false);
    }
  }

  function onProvinceChange(selected: any) {
    setProvince(selected);
    const _municipalityOptions = searchMunicipality({
      provinceId: selected.value,
    }).map((municipality) => ({
      value: municipality.municipalityId,
      label: municipality.name,
    }));
    setMunicipalitiesOptions(_municipalityOptions);
    setMunicipality(null);
    setBaranggay(null);
  }

  function onMunicipalityChange(selected: any) {
    setMunicipality(selected);
    const _baranggayOptions = searchBaranggay({
      provinceId: province.value,
      municipalityId: selected.value,
    }).map((baranggay) => ({
      value: baranggay.baranggayId,
      label: baranggay.name,
    }));
    setBaranggayOptions(_baranggayOptions);
    setBaranggay(null);
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Settings',
              link: '/settings',
              active: false,
            },
            {
              title: 'Health Service Details',
              link: '/dashboard/settings/health-service-details',
              active: true,
            },
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title={'Health Service Details'} loading={isLoading}>
              <FormBody>
                <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                  <img
                    style={{ width: 200, height: 200 }}
                    src={logo ? (logo as any).preview : 'https://via.placeholder.com/150'}
                    className={`rounded-circle align-self-center cursor-pointer shadow`}
                    alt="Avatar"
                    onClick={() => setDisplayProfilePhotoModal(true)}
                    onLoad={() => {
                      logo && URL.revokeObjectURL((logo as any).preview);
                    }}
                  />
                </div>
                <hr className="my-4" />
                <Input
                  type="text"
                  label="Name"
                  id={'name'}
                  value={name}
                  onValueChange={(v) => setName(v)}
                  error={nameError}
                  loading={isLoading}
                />
                <Input
                  type="text"
                  label="Contact No"
                  id={'contactNo'}
                  value={contactNo}
                  onValueChange={(v) => setContactNo(v)}
                  error={contactNoError}
                  loading={isLoading}
                />
                <Input
                  type="email"
                  label="Email"
                  id={'email'}
                  value={email}
                  onValueChange={(v) => setEmail(v)}
                  error={emailError}
                  loading={isLoading}
                />
                <Input
                  type="text"
                  label="Address 1"
                  id={'address1'}
                  value={address1}
                  onValueChange={(v) => setAddress1(v)}
                  error={null}
                  loading={isLoading}
                />
                <Input
                  type="text"
                  label="Address 2"
                  id={'address2'}
                  value={address2}
                  onValueChange={(v) => setAddress2(v)}
                  error={null}
                  loading={isLoading}
                />
                {!isLoading && (
                  <Input
                    type="select"
                    label="Province"
                    id={'province'}
                    options={provinceOptions}
                    value={province}
                    onValueChange={(v) => onProvinceChange(v)}
                    error={provinceError}
                  />
                )}
                {!isLoading && (
                  <Input
                    type="select"
                    label="Municipality"
                    id={'municipality'}
                    options={municipalitiesOptions}
                    value={municipality}
                    onValueChange={(v) => onMunicipalityChange(v)}
                    error={municipalityError}
                  />
                )}
                {!isLoading && (
                  <Input
                    type="select"
                    label="Baranggay"
                    id={'baranggay'}
                    options={baranggayOptions}
                    value={baranggay}
                    onValueChange={(v) => setBaranggay(v)}
                    error={baranggayError}
                  />
                )}
              </FormBody>
              <FormAction>
                <button
                  className="btn btn-outline-primary btn-block"
                  type="button"
                  onClick={handleUpdateStore}
                  disabled={isLoading}>
                  {isLoading ? <Spinner /> : 'Update'}
                </button>
              </FormAction>
            </Form>
          </div>
        </div>
        <ProfilePhotoModal
          showModal={displayProfilePhotoModal}
          onClose={() => setDisplayProfilePhotoModal(false)}
          profilePhoto={logo}
          onUpdateProfilePhoto={(newPhoto) => setLogo(newPhoto)}
        />
      </div>
    </DashboardLayout>
  );
}

export default HealthServiceDetailsPage;
