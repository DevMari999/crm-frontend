import React from 'react';
import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    updatePageInUrl: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, updatePageInUrl }) => {
    let pages = [];
    const range = 5;
    const delta = Math.floor(range / 2);
    let start = Math.max(currentPage - delta, 1);
    let end = Math.min(start + range - 1, totalPages);

    if (totalPages - currentPage < delta) {
        start = Math.max(totalPages - range + 1, 1);
    }

    if (currentPage > 1) {
        pages.push(
            <button key="prev" className="arrow" onClick={() => updatePageInUrl(currentPage - 1)}>
                {"<"}
            </button>
        );
    }

    if (start > 1) {
        pages.push(
            <button key={1} onClick={() => updatePageInUrl(1)}>
                {1}
            </button>
        );
        if (start > 2) {
            pages.push(<span key="start-ellipsis">...</span>);
        }
    }

    for (let i = start; i <= end; i++) {
        pages.push(
            <button
                key={i}
                className={`page-button ${currentPage === i ? 'active-button' : ''}`}
                onClick={() => updatePageInUrl(i)}
            >
                {i}
            </button>
        );
    }

    if (end < totalPages) {
        if (end < totalPages - 1) {
            pages.push(<span key="end-ellipsis">...</span>);
        }
        pages.push(
            <button key={totalPages} onClick={() => updatePageInUrl(totalPages)}>
                {totalPages}
            </button>
        );
    }

    if (currentPage < totalPages) {
        pages.push(
            <button key="next"  className="arrow" onClick={() => updatePageInUrl(currentPage + 1)}>
                {">"}
            </button>
        );
    }

    return <div className="pagination-controls">{pages}</div>;
};

export default Pagination;
