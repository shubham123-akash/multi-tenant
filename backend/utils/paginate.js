// Reads ?page & ?limit from the request, sanitizes them, and returns
// { page, limit, skip } ready to plug into Mongoose .skip()/.limit().
export const getPagination = (req, { defaultLimit = 10, maxLimit = 100 } = {}) => {
  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Builds the pagination metadata block attached to list responses.
export const buildPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};