import Link from 'next/link';

interface FormProps {
  title?: string;
  children: React.ReactNode;
}

export function FormBody(props: any) {
  const { children } = props;
  return <>{children}</>;
}

export function FormAction(props: any) {
  const { children } = props;
  return <>{children}</>;
}

function Form(props: FormProps) {
  const { title, children = [] } = props;

  let formBody = null;
  let formAction = null;

  if (!children) {
    return null;
  }

  (children as any[]).forEach((child) => {
    if (child.type === FormBody) {
      formBody = child;
    } else if (child.type === FormAction) {
      formAction = child;
    }
  });

  return (
    <div className="card text-start">
      <div className="card-body">
        {title && <h4 className="card-title">{title}</h4>}
        {formBody}
        {formAction}
      </div>
    </div>
  );
}

export default Form;
