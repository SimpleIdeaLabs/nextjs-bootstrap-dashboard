import _, { set } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '../../../../../components/shared/breadcrumbs';
import Form, { FormAction, FormBody } from '../../../../../components/shared/form';
import Input from '../../../../../components/shared/form/inputs';
import { authenticatedRequest } from '../../../../../utils/axios-util';
import { handleHttpRequestError } from '../../../../../utils/error-handling';
import { FileTypes } from '../../../../../constants/file-types.constants';

interface DocumentTypesFormProps {
  mode: 'create' | 'edit';
  documentTypeId?: any;
  handleOnFormSubmit: (payload: any) => void;
}

export default function DocumentTypesForm(props: DocumentTypesFormProps) {
  const router = useRouter();
  const { documentTypeId = null } = props;
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [optionFileTypes, setOptionFileTypes] = useState<any[]>([]);
  const [fileTypes, setFileTypes] = useState<any[]>([]);
  const [fileTypesError, setFileTypesError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = props;

  const formProperties = (function () {
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
    async function getData() {
      /**
       * Fetch Service Data
       * If mode is on Edit
       */
      if (mode === 'edit' && documentTypeId) {
        await fetchDocumentTypes(Number(documentTypeId as string));
      }
      await fetchSupportedFileTypes();
      setIsLoading(false);
    }
    getData();
  }, [mode, documentTypeId, isLoading]);

  /**
   * Fetch Categories
   */
  async function fetchSupportedFileTypes() {
    const _optionFileTypes = FileTypes.map((fileType: any) => ({
      value: fileType.id,
      label: fileType.name,
    }));
    setOptionFileTypes(_optionFileTypes);
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
      setName(_.get(documentType, 'name', ''));
      const _fileTypeIds = _.get(documentType, 'fileTypes', []);
      const _fileTypes = _.filter(FileTypes, (fileType) => {
        return _.includes(_fileTypeIds, `${fileType.id}`);
      });
      const _selectedFileTypes = _.map(_fileTypes, (_ft) => ({
        value: _ft.id,
        label: _ft.name,
      }));
      setFileTypes(_selectedFileTypes);
    }
  }

  /**
   * Handle Form Submit
   */
  async function _handleOnformSubmit() {
    const { handleOnFormSubmit } = props;
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
          setNameError(_.get(validationErrors, 'name', null));
          setFileTypesError(_.get(validationErrors, 'fileTypes', null));
        },
      });
    }
  }

  function resetErrors() {
    setNameError('');
  }

  if (isLoading) {
    return null;
  }

  if (mode === 'edit' && !fileTypes.length) {
    return null;
  }

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
                  onValueChange={(v) => setName(v)}
                  error={nameError}
                />
                {!isLoading && optionFileTypes && optionFileTypes.length > 0 ? (
                  <Input
                    multiSelect
                    type="select"
                    label="File Types"
                    value={fileTypes}
                    id={'categories'}
                    options={optionFileTypes}
                    onValueChange={(fileTypeIds) => setFileTypes(fileTypeIds)}
                    error={fileTypesError}
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
