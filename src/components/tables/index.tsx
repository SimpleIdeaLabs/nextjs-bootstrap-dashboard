interface TableProps {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
}

interface TablePaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
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

  return (
    <div className="card">
      {isLoading ? (
        <>Spinner</>
      ) : (
        <>
          <div className="card-header d-flex justify-content-between align-items-center">{tableHeader}</div>
          <div className="card-body" style={{ height: '65vh', overflowY: 'auto' }}>
            <div className="table-responsive h-100">
              <table
                className="table
              table-hover
              align-middle">
                {tableBody}
              </table>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">{tablePagination}</div>
        </>
      )}
    </div>
  );
}
