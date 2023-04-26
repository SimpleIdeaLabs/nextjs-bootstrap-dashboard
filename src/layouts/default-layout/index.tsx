import { DefaultLayoutProps } from './default-layout.dto';

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children } = props;

  return (
    <>
      <div className="container-fluid">{children}</div>
    </>
  );
}
