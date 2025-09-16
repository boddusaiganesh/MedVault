// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ pageData, onPageChange }) => {
  if (!pageData || pageData.totalPages <= 1) {
    return null; // Don't render if there's only one page or no data
  }

  const { number: currentPage, totalPages } = pageData;

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={pageData.first}
      >
        &larr; Previous
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={pageData.last}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;