import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { Breadcrumb } from 'antd';
import generateBreadcrumb from 'utils/generateBreadcrumb';
import './style.scss';

const PageHeader = ({
  route: { pageTitle, breadcrumb },
  intl,
}) => {
  const breadcrumbData = generateBreadcrumb(breadcrumb);

  if (isEmpty(pageTitle)) {
    return null;
  }

  return (
    <div className="pageHeader">
      <Breadcrumb className="pageHeader__breadcrumb">
        {map(breadcrumbData, (item, idx) => (
          idx === breadcrumbData.length - 1
            ? (
              <Breadcrumb.Item key={item.href}>
                {intl.formatMessage({ id: item.text })}
              </Breadcrumb.Item>
            )
            : (
              <Breadcrumb.Item key={item.href}>
                <Link href={item.href} to={item.href}>
                  {intl.formatMessage({ id: item.text })}
                </Link>
              </Breadcrumb.Item>
            )
        ))}
      </Breadcrumb>
      <div className="pageHeader__pageTitle">
        {intl.formatMessage({ id: pageTitle })}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  route: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default PageHeader;
