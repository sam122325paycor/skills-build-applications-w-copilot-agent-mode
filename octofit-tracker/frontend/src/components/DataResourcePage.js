import React, { useEffect, useMemo, useRef, useState } from 'react';

const getEndpoint = (path) => {
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  if (codespace) {
    return `https://${codespace}-8000.app.github.dev/api/${path}/`;
  }

  const { protocol, hostname } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const codespacesFrontendMatch = hostname.match(/^(.*)-3000\.app\.github\.dev$/);

  if (isLocalhost) {
    return `${protocol}//${hostname}:8000/api/${path}/`;
  }

  if (codespacesFrontendMatch) {
    return `https://${codespacesFrontendMatch[1]}-8000.app.github.dev/api/${path}/`;
  }

  return `/api/${path}/`;
};

const formatCellValue = (value) => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const getColumnValue = (column, record) => {
  const value = record[column.key];

  if (column.render) {
    return column.render(value, record);
  }

  return formatCellValue(value);
};

const getSearchableText = (record, columns) =>
  columns
    .map((column) => {
      if (column.searchValue) {
        return column.searchValue(record[column.key], record);
      }

      return formatCellValue(record[column.key]);
    })
    .join(' ')
    .toLowerCase();

// columns prop: array of { key, label, render? }
// If not provided, auto-discovers up to 6 columns from the data.
const DataResourcePage = ({ title, resourcePath, columns: columnsProp }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const modalTitleId = `${resourcePath}-details-title`;

  const endpoint = useMemo(() => getEndpoint(resourcePath), [resourcePath]);

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const results = data.results || data;
        setRecords(Array.isArray(results) ? results : []);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint]);

  const columns = useMemo(() => {
    if (columnsProp) return columnsProp;
    const keySet = new Set();
    records.forEach((item) => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach((key) => keySet.add(key));
      }
    });
    return Array.from(keySet).slice(0, 6).map((key) => ({ key, label: key }));
  }, [records, columnsProp]);

  const filteredRecords = useMemo(() => {
    if (!query.trim()) {
      return records;
    }

    const q = query.toLowerCase();
    return records.filter((item) => getSearchableText(item, columns).includes(q));
  }, [records, query, columns]);

  useEffect(() => {
    if (!selectedRecord) {
      triggerRef.current?.focus();
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedRecord(null);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = [
        ...document.querySelectorAll(
          '.resource-details-modal button, .resource-details-modal [href], .resource-details-modal input, .resource-details-modal select, .resource-details-modal textarea, .resource-details-modal [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((element) => !element.hasAttribute('disabled'));

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedRecord]);

  return (
    <div className="card shadow-sm border-0 page-card">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
          <h2 className="h3 mb-0 text-primary-emphasis">{title}</h2>
          <a className="link-primary fw-semibold" href={endpoint} target="_blank" rel="noreferrer">
            Open API endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-8 col-lg-6">
            <label className="form-label fw-semibold" htmlFor={`${resourcePath}-search`}>
              Search records
            </label>
            <input
              id={`${resourcePath}-search`}
              type="search"
              className="form-control"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-auto d-flex align-items-end">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                {columns.map((col) => (
                  <th scope="col" key={col.key}>
                    {col.label}
                  </th>
                ))}
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Loading {title.toLowerCase()}...
                  </td>
                </tr>
              )}

              {!loading && filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-4 text-muted">
                    No records found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredRecords.map((record, index) => (
                  <tr key={record.id || `${resourcePath}-${index}`}>
                    <th scope="row">{index + 1}</th>
                    {columns.map((col) => (
                      <td key={`${record.id || index}-${col.key}`}>
                        {getColumnValue(col, record)}
                      </td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={(event) => {
                          triggerRef.current = event.currentTarget;
                          setSelectedRecord(record);
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="presentation"
            onClick={() => setSelectedRecord(null)}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div
                className="modal-content resource-details-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={modalTitleId}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="modal-header">
                  <h5 className="modal-title" id={modalTitleId}>
                    {title} record details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    ref={closeButtonRef}
                    onClick={() => setSelectedRecord(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0 bg-light p-3 rounded small text-wrap">
                    {JSON.stringify(selectedRecord, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
};

export default DataResourcePage;