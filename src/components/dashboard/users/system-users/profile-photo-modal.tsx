import { useDropzone } from 'react-dropzone';
import Form, { FormAction, FormBody } from '../../../shared/form';

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
      onUpdateProfilePhoto(objFiles[0]);
      onClose();
    },
  });

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
                  </section>
                </FormBody>
                <FormAction></FormAction>
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
          border: none;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default ProfilePhotoModal;
