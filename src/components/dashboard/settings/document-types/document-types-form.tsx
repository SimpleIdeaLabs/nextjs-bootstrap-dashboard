import _, { set } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../shared/breadcrumbs';
import Form, { FormAction, FormBody } from '../../../shared/form';
import Input from '../../../shared/form/inputs';
import { authenticatedRequest } from '../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../utils/error-handling';
import { FileTypes } from '../../../../constants/file-types.constants';

interface DocumentTypesFormProps {
  mode: 'create' | 'edit';
  documentTypeId?: any;
  handleOnFormSubmit: (payload: any) => void;
}

export interface DocumentTypesFormValue {
  name: string;
  fileTypes: any[];
}

interface DocumentTypesFormState {
  formValues: DocumentTypesFormValue;
  formErrors: any;
  optionFileTypes: any[];
  loading: boolean;
}

export default function DocumentTypesForm(props: DocumentTypesFormProps) {
  const router = useRouter();
  const { documentTypeId = null, mode } = props;
  const [documentTypesFormState, setDocumentTypesFormState] = useState<DocumentTypesFormState>({
    formValues: {
      name: '',
      fileTypes: [],
    },
    formErrors: {},
    optionFileTypes: [],
    loading: false,
  });

  const formProperties = (function () {
    const { formValues } = documentTypesFormState;
    const { name } = formValues;
    if (mode === 'create') {
      return {
        formLabel: 'Create Document Type',
        buttonLabel: 'Create',
        successMessage: `${name} is created!`,
        successRedirect: `/dashboard/settings/document-types/list?page=1&limit=10`,
        breadcrumbLink: {
          title: 'Create',
          link: '/dashboard/settings/document-types/create',
          active: true,
        },
      };
    } else {
      return {
        formLabel: 'Update Document Type',
        buttonLabel: 'Update',
        successMessage: `${name} is updated!`,
        successRedirect: `/dashboard/settings/document-types/${documentTypeId}`,
        breadcrumbLink: {
          title: `Update ${name}`,
          link: `/dashboard/settings/document-types/${documentTypeId}`,
          active: true,
        },
      };
    }
  })();

  useEffect(() => {
    fetchSupportedFileTypes();
  }, []);

  useEffect(() => {
    async function getData() {
      setDocumentTypesFormState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      if (mode === 'edit' && documentTypeId && documentTypesFormState.optionFileTypes.length > 0) {
        await fetchDocumentTypes(Number(documentTypeId as string));
      }
      setDocumentTypesFormState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
    getData();
  }, [mode, documentTypeId, documentTypesFormState.optionFileTypes]);

  /**
   * Fetch Categories
   */
  async function fetchSupportedFileTypes() {
    const optionFileTypes = FileTypes.map((fileType: any) => ({
      value: fileType.id,
      label: fileType.name,
    }));
    setDocumentTypesFormState((prevState) => ({
      ...prevState,
      optionFileTypes,
    }));
  }

  /**
   * Fetch Service
   */
  async function fetchDocumentTypes(documentTypeId: number) {
    const response = await authenticatedRequest.get(`/document-type/${documentTypeId}`);
    const {
      data: { data: responseData },
    } = response;
    const { documentType = null } = responseData;
    if (documentType) {
      const _fileTypeIds = _.get(documentType, 'fileTypes', []);
      const _fileTypes = _.filter(FileTypes, (fileType) => {
        return _.includes(_fileTypeIds, `${fileType.id}`);
      });
      const _selectedFileTypes = _.map(_fileTypes, (_ft) => ({
        value: _ft.id,
        label: _ft.name,
      }));
      setDocumentTypesFormState((prevState) => ({
        ...prevState,
        formValues: {
          ...prevState.formValues,
          name: _.get(documentType, 'name', ''),
          fileTypes: _selectedFileTypes,
        },
      }));
    }
  }

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
    const { formValues } = documentTypesFormState;
    const { name, fileTypes } = formValues;
    try {
      await handleOnFormSubmit({
        name,
        fileTypes: fileTypes.map((f: any) => f.value),
      });
      resetErrors();
      toast.success(formProperties.successMessage);
      router.push(formProperties.successRedirect);
    } catch (error: unknown) {
      handleHttpRequestError({
        error,
        badRequestCallback: (validationErrors: any) => {
          setDocumentTypesFormState((prevState) => ({
            ...prevState,
            formErrors: {
              ...prevState.formErrors,
              name: _.get(validationErrors, 'name', null),
              fileTypes: _.get(validationErrors, 'fileTypes', null),
            },
          }));
        },
      });
    }
  }

  function resetErrors() {
    setDocumentTypesFormState((prevState) => ({
      ...prevState,
      formErrors: {},
    }));
  }

  function handleValueChange(field: string, value: any) {
    setDocumentTypesFormState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [field]: value,
      },
    }));
  }

  const { formValues, formErrors, loading, optionFileTypes = [] } = documentTypesFormState;
  const { name, fileTypes } = formValues;

  return (
    <>
      <div className="container-fluid">
        <Breadcrumbs
          links={[
            {
              title: 'Settings',
              link: '/settings',
              active: false,
            },
            {
              title: 'Document Types',
              link: '/dashboard/settings/document-types/list?page=1&limit=10',
              active: false,
            },
            formProperties.breadcrumbLink,
          ]}
        />
        <div className="row">
          <div className={`col-12 col-md-10 col-lg-6 mx-md-auto`}>
            <Form title={formProperties.formLabel}>
              <FormBody>
                <Input
                  type="text"
                  label="Name"
                  id={'name'}
                  value={name}
                  onValueChange={(v) => handleValueChange('name', v)}
                  error={_.get(formErrors, 'name', null)}
                />
                {!loading && optionFileTypes && optionFileTypes.length > 0 ? (
                  <Input
                    multiSelect
                    type="select"
                    label="File Types"
                    value={fileTypes}
                    id={'categories'}
                    options={optionFileTypes}
                    onValueChange={(fileTypeIds) => handleValueChange('fileTypes', fileTypeIds)}
                    error={_.get(formErrors, 'fileTypes', null)}
                  />
                ) : null}
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
    </>
  );
}
