import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import './style.scss';

const NewsPagination = ({
  pageSize,
  page,
  total,
  onPaginationChange,
}) => (
  <div className="newsPagination">
    <Pagination
      pageSize={pageSize}
      current={page}
      total={total}
      onChange={onPaginationChange}
    />
  </div>
);

NewsPagination.propTypes = {
  pageSize: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
};

export default NewsPagination;
