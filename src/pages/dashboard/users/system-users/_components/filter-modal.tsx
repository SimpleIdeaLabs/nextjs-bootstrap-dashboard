import Form, { FormBody, FormAction } from '../../../../../components/form';
import Input from '../../../../../components/form/inputs';

interface FilterModalProps {
  selectedRoles: any[];
  optionRoles: any[];
  showModal: boolean;
  onClose: () => void;
  handleOnFilter: () => void;
  handleOnChange: (value: any) => void;
  handleOnClearFilter: () => void;
}

const FilterModal = (props: FilterModalProps) => {
  const { selectedRoles, showModal, onClose, optionRoles, handleOnFilter, handleOnClearFilter, handleOnChange } = props;
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
              <h5 className="modal-title">Filter</h5>
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
                    type="select"
                    label="Role"
                    value={selectedRoles}
                    id={'role'}
                    multiSelect
                    options={optionRoles}
                    onValueChange={(roles) => handleOnChange(roles)}
                    error={null}
                  />
                </FormBody>
                <FormAction>
                  <div className="d-grid">
                    <button className="btn btn-primary btn-block mb-3" onClick={() => handleOnFilter()}>
                      Filter
                    </button>
                    <button
                      className="btn btn-danger btn-block"
                      type="button"
                      onClick={() => {
                        handleOnClearFilter();
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

export default FilterModal;
