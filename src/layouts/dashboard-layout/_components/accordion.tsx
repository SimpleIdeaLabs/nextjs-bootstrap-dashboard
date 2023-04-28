import Link from 'next/link';
import { useRouter } from 'next/router';
import { removeQueryParams } from '../../../utils/utils';

interface AccordionProps {
  collapseId: string; // usersCollapse
  linkHeadingId: string; // usersLinkHeading
  parentLink: {
    title: string; // Users
    link: string; // /users
  };
  subLinks: {
    key: string;
    title: string;
    link: string;
  }[];
}

export default function Accordion(props: AccordionProps) {
  const { collapseId, linkHeadingId, parentLink, subLinks = [] } = props;
  const router = useRouter();

  const isParentActive = (rootpath: string) => router.pathname.indexOf(rootpath) > -1;
  const isChildActive = (pathname: string) => {
    return removeQueryParams(router.pathname).indexOf(removeQueryParams(pathname)) > -1;
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`${linkHeadingId}`}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapseId}`}
          aria-expanded="true"
          aria-controls={`${collapseId}`}>
          {parentLink.title}
        </button>
      </h2>
      <div
        id={`${collapseId}`}
        className={`accordion-collapse collapse  ${isParentActive(parentLink.link) ? 'show active' : ''}`}>
        <div className="accordion-body p-2">
          <ul className="list-group">
            {subLinks.map((subLink) => {
              return (
                <li key={subLink.key} className={`list-group-item ${isChildActive(subLink.link) ? 'active' : ''}`}>
                  <Link className={`text-${isChildActive(subLink.link) ? 'primary' : 'grey'}`} href={subLink.link}>
                    {subLink.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .accordion-button:not(.collapsed) {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}
