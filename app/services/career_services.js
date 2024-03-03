const paginateConverter = require('../utils/paginate_converter');
const { 
    getCountCareerPages,
    getAllCareer, 
    getCareerById, 
    updateCareer, 
    createCareer, 
    deleteCareer,
} = require('../repositories/career_repository');
const careerModelValidator = require('../utils/validator/career_model_validator');
const uuid = require('uuid');
const careerModel = require('../models/career');

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

const postCareerAdminService = async(payload) => {
    try {
        // time variable
        const currentMillis = Date.now();

        // add more parameter
        payload.id = uuid.v4();
        payload.status = true;
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;

        // validate model
        const data = careerModel(payload);

        // insert data
        const id = await createCareer(payload);

        return {id};
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCareerAdminService,
    postCareerAdminService,
};