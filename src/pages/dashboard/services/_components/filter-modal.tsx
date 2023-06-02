import Form, { FormBody, FormAction } from '../../../../components/shared/form';
import Input from '../../../../components/shared/form/inputs';

interface FilterModalProps {
  selectedCategory: any;
  optionCategories: any[];
  showModal: boolean;
  onClose: () => void;
  handleOnFilter: () => void;
  handleOnChange: (value: any) => void;
  handleOnClearFilter: () => void;
}

const FilterModal = (props: FilterModalProps) => {
  const {
    selectedCategory,
    showModal,
    onClose,
    optionCategories,
    handleOnFilter,
    handleOnClearFilter,
    handleOnChange,
  } = props;
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
              <p className="modal-title">
                <h5>Filter</h5>
              </p>
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
                    label="Category"
                    value={selectedCategory}
                    id={'category'}
                    options={optionCategories}
                    onValueChange={(roles) => handleOnChange(roles)}
                    error={null}
                  />
                </FormBody>
                <FormAction>
                  <div className="d-grid">
                    <button className="btn btn-outline-primary btn-block mb-3" onClick={() => handleOnFilter()}>
                      Filter
                    </button>
                    <button
                      className="btn btn-outline-danger btn-block"
                      type="button"
                      onClick={() => {
                        handleOnChange(null);
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
