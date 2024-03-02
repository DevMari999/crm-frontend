import "./Pagination.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    updatePageInUrl: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, updatePageInUrl}) => {
    let pages = [];
    const range = 5;
    const delta = Math.floor(range / 2);
    let start = Math.max(currentPage - delta, 1);
    let end = Math.min(start + range - 1, totalPages);

    if (totalPages - currentPage < delta) {
        start = Math.max(totalPages - range + 1, 1);
    }

    pages.push(
        <button key="prev" onClick={() => updatePageInUrl(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            {"<"}
        </button>
    );

    for (let i = start; i <= end; i++) {
        pages.push(
            <button
                key={i}
                className={`page-button ${currentPage === i ? "active-button" : ""}`}
                onClick={() => updatePageInUrl(i)}
            >
                {i}
            </button>
        );
    }

    if (end < totalPages) {
        pages.push(<span key="ellipsis">...</span>);
        pages.push(
            <button key={totalPages} onClick={() => updatePageInUrl(totalPages)}>
                {totalPages}
            </button>
        );
    }

    pages.push(
        <button key="next" onClick={() => updatePageInUrl(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}>
            {">"}
        </button>
    );

    return <div className="pagination-controls">{pages}</div>;
};

export default Pagination;
