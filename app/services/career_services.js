const paginateConverter = require('../utils/paginate_converter');
const { 
    getCountCareerPages,
    getAllCareer, 
    getCareerById, 
    updateCareer, 
    createCareer, 
    deleteCareer,
} = require('../repositories/career_repository');

const getAllCareerAdminService = async(page, limit, status = 'all') => {
    try {
        // count total pages
        const rawPage = await getCountCareerPages();

        // converter pagination
        let {offset, totalPages} = paginateConverter(page, limit, rawPage);

        // get data
        const data = await getAllCareer(limit, offset, status);

        return data, totalPages;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCareerAdminService
};