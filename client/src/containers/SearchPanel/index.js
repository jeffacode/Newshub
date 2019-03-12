import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import { setNavigatorBar } from 'redux/modules/app/action';
import {
  fetchSearchResults,
  clearSearchResults,
  subscribe,
  unsubscribe,
} from 'redux/modules/searchPanel/action';
import { getSearchResults } from 'redux/modules/searchPanel/reducer';
import SearchCategory from './components/SearchCategory';

class SearchPanel extends Component {
  constructor(props) {
    super(props);
    const {
      location: { search: searchQuery },
    } = props;
    this.state = {
      searchQuery,
    };
  }

  componentDidMount() {
    const {
      location: { search: searchQuery },
      fetchSearchResults,
      clearSearchResults,
      setNavigatorBar,
      intl,
    } = this.props;
    setNavigatorBar('search', intl.formatMessage({ id: 'search_results' }));
    clearSearchResults(); // 清除搜索数据
    fetchSearchResults(searchQuery); // 获取搜索数据
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { search: searchQuery },
      fetchSearchResults,
      clearSearchResults,
    } = nextProps;

    if (searchQuery !== prevState.searchQuery) {
      clearSearchResults();
      fetchSearchResults(searchQuery);
      return { searchQuery };
    }

    return null;
  }

  onSubscribeBtnClick = (cid, subscribers, subscribed) => {
    const {
      subscribe,
      unsubscribe,
    } = this.props;
    if (subscribed) {
      unsubscribe(cid, subscribers);
    } else {
      subscribe(cid, subscribers);
    }
  }

  render() {
    const { searchResults, intl } = this.props;
    return (
      <div className="newsPanel">
        <SearchCategory
          categories={searchResults}
          onSubscribeBtnClick={this.onSubscribeBtnClick}
          intl={intl}
        />
      </div>
    );
  }
}

SearchPanel.propTypes = {
  searchResults: PropTypes.array.isRequired,
  fetchSearchResults: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  setNavigatorBar: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  searchResults: getSearchResults(state),
});

const mapDispatchToProps = {
  fetchSearchResults,
  clearSearchResults,
  subscribe,
  unsubscribe,
  setNavigatorBar,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPanel));
