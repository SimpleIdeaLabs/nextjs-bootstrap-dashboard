import Link from 'next/link';
import Form, { FormBody, FormAction } from '../../../../../components/form';
import { useDropzone } from 'react-dropzone';

interface ProfilePhotoModalProps {
  profilePhoto: any;
  onUpdateProfilePhoto: (newPhoto: any) => void;
  showModal: boolean;
  onClose: () => void;
}

const ProfilePhotoModal = (props: ProfilePhotoModalProps) => {
  const { showModal, onClose, onUpdateProfilePhoto } = props;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpeg', '.jpg'],
    },
    onDrop: (files) => {
      const objFiles = files.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      console.log('objFiles', objFiles);
      onUpdateProfilePhoto(objFiles[0]);
    },
  });

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        tabIndex={-1}
        role="dialog"
        style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Profile Photo</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <Form>
                <FormBody>
                  <section className="dropzone">
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />
                      <p>Drag and drop some files here, or click to select files</p>
                    </div>
                    <aside>
                      <h4>Files</h4>
                      <ul>{files}</ul>
                    </aside>
                  </section>
                </FormBody>
                <FormAction>
                  <div className="d-grid">
                    <Link className="btn btn-primary btn-block" href="/dashboard/dashboard-analytics">
                      Upload
                    </Link>
                  </div>
                </FormAction>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}></div>
      <style jsx>{`
        .dropzone {
          border: 1px solid black;
        }
      `}</style>
    </>
  );
};

export default ProfilePhotoModal;
