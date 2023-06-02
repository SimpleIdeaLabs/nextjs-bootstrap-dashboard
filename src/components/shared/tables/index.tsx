import { Pagination } from '../../../dtos/shared.dto';

interface TableProps {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
}

interface TablePaginationProps {
  pagination: Pagination;
  goToPage: (page: number) => void;
  changeLimit?: (newLimit: number) => void;
}

export function TableHeader(props: any) {
  const { children } = props;
  return <>{children}</>;
}

export function TableBody(props: any) {
  const { children } = props;
  return <>{children}</>;
}

export function TablePagination(props: TablePaginationProps) {
  const {
    pagination: { page, totalNumberOfPages, total },
    goToPage,
  } = props;

  const previousPage = page === 1 ? 1 : page - 1;
  const nextPage = page === totalNumberOfPages ? totalNumberOfPages : page + 1;

  const pagesToDisplay = ((): number[] => {
    let lastPage = page + 3;
    if (lastPage > totalNumberOfPages) {
      lastPage = totalNumberOfPages;
    } else {
      lastPage = lastPage;
    }
    const arr = [];
    for (let i = page; i <= lastPage; i++) {
      arr.push(i);
    }
    return arr;
  })();

  return (
    <>
      <div className="d-flex flex-row align-items-center me-3">
        <div className="me-1">
          <span className="badge rounded-pill text-bg-primary p-2">Total Records: {total}</span>
        </div>
        <div className="me-1">
          <span className="badge rounded-pill text-bg-primary p-2">
            {page}/{totalNumberOfPages} pages
          </span>
        </div>
      </div>
      <nav aria-label="Page navigation example">
        <ul className="pagination mb-0">
          {page !== 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => goToPage(previousPage)}>
                Previous
              </button>
            </li>
          )}
          {pagesToDisplay.length > 1 &&
            pagesToDisplay.map((p: number) => {
              return (
                <li className={`page-item ${page === p ? 'active' : ''} `} key={p}>
                  <button className="page-link" onClick={() => goToPage(p)}>
                    {p}
                  </button>
                </li>
              );
            })}
          {page !== totalNumberOfPages && (
            <li className="page-item">
              <button className="page-link" onClick={() => goToPage(nextPage)}>
                Next
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default function Table(props: TableProps) {
  const { children, title, isLoading = false } = props;
  let tableHeader = null;
  let tableBody = null;
  let tablePagination = null;

  if (!children || !Array.isArray(children) || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  (children as any[]).forEach((child) => {
    if (child.type === TableHeader) {
      tableHeader = child;
    } else if (child.type === TableBody) {
      tableBody = child;
    } else if (child.type === TablePagination) {
      tablePagination = child;
    }
  });

  function displayLoadingTable() {
    return (
      <div className="table-responsive">
        <table className="table table-primary">
          <tbody>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row" colSpan={2}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row" colSpan={3}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row" colSpan={2}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row" colSpan={3}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row" colSpan={2}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row" colSpan={3}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row" colSpan={2}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row" colSpan={3}>
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
              <td scope="row">
                <div className="placeholder w-100 taller-placeholder"></div>
              </td>
            </tr>
          </tbody>
        </table>
        <style jsx>
          {`
            .taller-placeholder {
              height: 30px;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="card">
      <>
        <div className="card-header d-flex justify-content-between align-items-center">{tableHeader}</div>
        <div className="card-body placeholder-glow" style={{ height: '65vh', overflowY: 'auto' }}>
          <div className="table-responsive h-100">
            {isLoading ? (
              displayLoadingTable()
            ) : (
              <table className="table table-hover align-middle table-striped">{tableBody}</table>
            )}
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end">{tablePagination}</div>
      </>
    </div>
  );
}
