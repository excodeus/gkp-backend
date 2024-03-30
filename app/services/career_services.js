const paginateConverter = require('../utils/paginate_converter');
const { 
    getCountCareerPages,
    getAllCareer, 
    getCareerById, 
    updateCareer, 
    createCareer, 
    deleteCareer,
} = require('../repositories/career_repository');
const uuid = require('uuid');
const careerModel = require('../models/career');

const getAllCareerAdminService = async(page, limit, status = 'all') => {
    try {
        // count total pages
        const rawPage = await getCountCareerPages();

        // converter pagination
        const {offset, totalPages} = paginateConverter(page, limit, rawPage);
        if (page > totalPages) {
            throw new Error("Page exceed data");
        }

        // status conf
        const configStatus = {
            "closed": 0,
            "open": 1
        };

        // valid status to boolean
        const validStatus = configStatus[status];

        // get data
        if (status === 'all') {
            data = await getAllCareer(limit, offset);
        } else {
            data = await getAllCareer(limit, offset, validStatus);
        }

        return {data, totalPages};
    } catch (error) {
        throw error;
    }
};

// time variable
const currentMillis = Date.now();

const postCareerAdminService = async(payload) => {
    try {

        // add more parameter
        payload.id =  "CR-" + uuid.v4();
        payload.status = true;
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;

        // validate model
        const data = careerModel(payload, true);

        // insert data
        const id = await createCareer(data);

        return {id};
    } catch (error) {
        throw error;
    }
};

const getCareerByIdAdminService = async(id) => {
    try {
        // get data by id
        const data = await getCareerById(id);

        return data;
    } catch (error) {
        throw error;
    }
};

const putCareerByIdAdminService = async(payload, reqId) => {
    try {
        // set time update and id
        payload.id = reqId;
        payload.updated_at = currentMillis;

        // validate model
        const data = careerModel(payload, false);
        // get payload by id
        const id = await updateCareer(data);

        return id;
    } catch (error) {
        throw error;
    }
};

const deleteCareerAdminService = async(id) => {
    try {
        // delete return id
        const data = await deleteCareer(id);

        return {id: data};
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCareerAdminService,
    postCareerAdminService,
    getCareerByIdAdminService,
    putCareerByIdAdminService,
    deleteCareerAdminService,
};