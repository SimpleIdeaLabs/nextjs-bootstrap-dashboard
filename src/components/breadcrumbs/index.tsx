interface BreadcrumbsProps {
  links: {
    title: string;
    link: string;
    active: boolean;
  }[];
}

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { links = [] } = props;
  return (
    <nav className="breadcrumb">
      {links.map((_link) => {
        const { title, link, active } = _link;
        return (
          <a className={`breadcrumb-item ${active ? 'active' : ''}`} href={link} key={_link.title}>
            {title}
          </a>
        );
      })}
    </nav>
  );
}
