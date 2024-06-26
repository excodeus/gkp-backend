const paginateConverter = (page, limit, rawPage) => {
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(rawPage / limit);

    return {offset, totalPages};
};

module.exports = paginateConverter;