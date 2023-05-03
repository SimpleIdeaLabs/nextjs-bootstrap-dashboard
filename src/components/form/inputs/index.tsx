import Select from 'react-select';

interface InputProps {
  id: string;
  type: 'text' | 'password' | 'email' | 'checkbox' | 'select';
  label: string;
  value: any;
  onValueChange: (value: any) => void;
  error: any;
  placeholder?: string;
  options?: {
    value: any;
    label: string;
  }[];
  multiSelect?: boolean;
}

function Input(props: InputProps) {
  const { id, type, label = 'Label', value = '', onValueChange, error = null, placeholder = '' } = props;

  function displayError() {
    if (!error) return null;
    return <p className="form-text text-danger">{error}</p>;
  }

  switch (type) {
    case 'text':
      return (
        <div className="mb-3">
          <label htmlFor={id} className="form-label">
            {label}
          </label>
          <input
            type="text"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={id}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
          {displayError()}
        </div>
      );

    case 'email':
      return (
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            {label}
          </label>
          <input
            type="email"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={id}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
          {displayError()}
        </div>
      );

    case 'password':
      return (
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            {label}
          </label>
          <input
            type="password"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={id}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
          {displayError()}
        </div>
      );

    case 'checkbox':
      return (
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" value="" id="" />
          <label className="form-check-label">{label}</label>
        </div>
      );

    case 'select':
      const { options = [], multiSelect = false } = props;
      return (
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            {label}
          </label>
          <Select
            className={'form-control'}
            options={options}
            isMulti={multiSelect}
            onChange={(v) => onValueChange(v)}
            defaultValue={value}
          />
          {displayError()}
        </div>
      );

    default:
      return <>Unsupported</>;
  }
}

export default Input;
