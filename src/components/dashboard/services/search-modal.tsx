import Form, { FormBody, FormAction } from '../../shared/form';
import Input from '../../shared/form/inputs';

interface SearchModalProps {
  name: string;
  onChangeName: (v: string) => void;
  showModal: boolean;
  onClose: () => void;
  handleOnSearch: () => void;
  handleOnClearSearch: () => void;
}

const SearchModal = (props: SearchModalProps) => {
  const { name, onChangeName, showModal, onClose, handleOnSearch, handleOnClearSearch } = props;

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
              <h5 className="modal-title">Search</h5>
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
                  <Input
                    type="text"
                    label="Name"
                    id="name"
                    value={name}
                    onValueChange={(v) => onChangeName(v)}
                    error={null}
                  />
                </FormBody>
                <FormAction>
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-primary btn-block mb-3"
                      type="button"
                      onClick={() => handleOnSearch()}>
                      Search
                    </button>
                    <button
                      className="btn btn-outline-danger btn-block"
                      type="button"
                      onClick={() => {
                        handleOnClearSearch();
                      }}>
                      Clear Search
                    </button>
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
    </>
  );
};

export default SearchModal;
