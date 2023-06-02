import _ from 'lodash';
import { useRouter } from 'next/router';
import { provinces, searchBaranggay, searchMunicipality } from 'ph-geo-admin-divisions';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../layouts/dashboard-layout';
import PatientFormLayout from '../../../layouts/patient-form-layout';
import { Patient } from '../../../models/patient.model';
import { handleHttpRequestError } from '../../../utils/error-handling';
import { Breadcrumbs } from '../../shared/breadcrumbs';
import Form, { FormAction, FormBody } from '../../shared/form';
import Input from '../../shared/form/inputs';
import { HandleUpdateAdditionalDataParams } from '../../../pages/dashboard/patients/additional-data/[patientId]';

interface SystemUserFormProps {
  handleOnFormSubmit: (params: HandleUpdateAdditionalDataParams) => void;
  patient: Patient | null;
  loading: boolean;
}

export default function DemographicsForm(props: SystemUserFormProps) {
  /**
   * Variables
   */
  const router = useRouter();
  const { loading = true, patient = null } = props;
  const patientId = _.get(props, 'patient.id', null);

  /**
   * States
   */
  const [emergencyContactFirstName, setEmergencyContactFirstName] = useState('');
  const [emergencyContactMiddleName, setEmergencyContactMiddleName] = useState('');
  const [emergencyContactLastName, setEmergencyContactLastName] = useState('');
  const [emergencyContactNo, setEmergencyContactNo] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [provinceOptions, setProvinceOptions] = useState<any[]>([]);
  const [province, setProvince] = useState<any>(null);
  const [municipalitiesOptions, setMunicipalitiesOptions] = useState<any[]>([]);
  const [municipality, setMunicipality] = useState<any>(null);
  const [baranggayOptions, setBaranggayOptions] = useState<any[]>([]);
  const [baranggay, setBaranggay] = useState<any>(null);
  const [postal, setPostal] = useState('');

  useEffect(() => {
    async function setUpAdditionalData() {
      try {
        if (patient) {
          const _provinceOptions = provinces.map((province) => ({
            value: province.provinceId,
            label: province.name,
          }));
          setProvinceOptions(_provinceOptions);
          setEmergencyContactFirstName(_.get(patient, 'emergencyContactFirstName', ''));
          setEmergencyContactMiddleName(_.get(patient, 'emergencyContactMiddleName', ''));
          setEmergencyContactLastName(_.get(patient, 'emergencyContactLastName', ''));
          setEmergencyContactNo(_.get(patient, 'emergencyContactNo', ''));
          // address
          setAddress1(_.get(patient, 'address1', ''));
          setAddress2(_.get(patient, 'address2', ''));

          // province
          const storedProvince = _.get(patient, 'stateOrProvince', null);
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
          const storedMunicipality = _.get(patient, 'cityOrTown', null);
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
          const storedBaranggay = _.get(patient, 'baranggay', null);
          if (storedBaranggay) {
            setBaranggay({
              value: storedBaranggay.baranggayId,
              label: storedBaranggay.name,
            });
          }
        }
      } catch (error) {
        toast.error('Oops something went wrong...');
      }
    }

    if (patient) {
      setUpAdditionalData();
    }
  }, [patient]);

  /**
   * Handle Form Submit
   */
  async function _handleOnFormSubmit() {
    const { handleOnFormSubmit } = props;
    await handleOnFormSubmit({
      payload: {
        emergencyContactFirstName,
        emergencyContactMiddleName,
        emergencyContactLastName,
        emergencyContactNo,
        address1,
        address2,
        province: _.get(province, 'value', ''),
        municipality: _.get(municipality, 'value', ''),
        baranggay: _.get(baranggay, 'value', ''),
        postal,
      },
      onSuccess: () => {
        toast.success("Successfully updated patient's additional data.");
        router.push(`/dashboard/patients/additional-data/${patientId}`);
      },
      onError: (error: unknown) => {
        handleHttpRequestError({
          error,
        });
      },
    });
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
              title: 'Patients',
              link: '/dashboard/patients/list?page=1&limit=10',
              active: false,
            },
            {
              title: `Additional Data`,
              link: `/dashboard/patients/{patientId}/demographics`,
              active: true,
            },
          ]}
        />

        <PatientFormLayout activeTab={1} mode={'edit'} patientId={patientId}>
          <Form title={'Update Patient Additional Data'} loading={loading}>
            <FormBody>
              <Input
                type="text"
                label="Emergency Contact First Name"
                id={'emergencyContactFirstName'}
                value={emergencyContactFirstName}
                onValueChange={(v) => setEmergencyContactFirstName(v)}
                error={null}
                loading={loading}
              />
              <Input
                type="text"
                label="Emergency Contact Middle Name"
                id={'emergencyContactMiddleName'}
                value={emergencyContactMiddleName}
                onValueChange={(v) => setEmergencyContactMiddleName(v)}
                error={null}
                loading={loading}
              />
              <Input
                type="text"
                label="Emergency Contact Last Name"
                id={'emergencyContactLastName'}
                value={emergencyContactLastName}
                onValueChange={(v) => setEmergencyContactLastName(v)}
                error={null}
                loading={loading}
              />
              <Input
                type="text"
                label="Emergency Contact No"
                id={'emergencyContactNo'}
                value={emergencyContactNo}
                onValueChange={(v) => setEmergencyContactNo(v)}
                error={null}
                loading={loading}
              />
              <Input
                type="text"
                label="Address 1"
                id={'address1'}
                value={address1}
                onValueChange={(v) => setAddress1(v)}
                error={null}
                loading={loading}
              />
              <Input
                type="text"
                label="Address 2"
                id={'address2'}
                value={address2}
                onValueChange={(v) => setAddress2(v)}
                error={null}
                loading={loading}
              />
              {!loading && (
                <>
                  <Input
                    type="select"
                    label="Province"
                    id={'province'}
                    options={provinceOptions}
                    value={province}
                    onValueChange={(v) => onProvinceChange(v)}
                    error={null}
                  />
                  <Input
                    type="select"
                    label="Municipality"
                    id={'municipality'}
                    options={municipalitiesOptions}
                    value={municipality}
                    onValueChange={(v) => onMunicipalityChange(v)}
                    error={null}
                  />
                  <Input
                    type="select"
                    label="Baranggay"
                    id={'baranggay'}
                    options={baranggayOptions}
                    value={baranggay}
                    onValueChange={(v) => setBaranggay(v)}
                    error={null}
                  />
                </>
              )}
              <Input
                type="text"
                label="Postal Code"
                id={'postal'}
                value={postal}
                onValueChange={(v) => setPostal(v)}
                error={null}
                loading={loading}
              />
            </FormBody>
            <FormAction>
              <button className="btn btn-outline-primary btn-block" type="button" onClick={_handleOnFormSubmit}>
                Update
              </button>
            </FormAction>
          </Form>
        </PatientFormLayout>
      </div>
    </DashboardLayout>
  );
}
