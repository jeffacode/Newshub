const parseSearchQuery = searchQuery => (
  searchQuery
    .substring(1)
    .split('&')
    .reduce((prev, current) => {
      const pair = current.split('=');
      prev[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      return prev;
    }, {})
);

export default parseSearchQuery;
