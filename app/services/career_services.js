const paginateConverter = require('../utils/paginate_converter');
const { 
    getCountCareerPages,
    getAllCareer, 
    getCareerById, 
    updateCareer, 
    createCareer, 
    deleteCareer,
    getAllCareerClient,
} = require('../repositories/career_repository');
const { 
    createHistory,
    updateHistory,
    deleteHistory
} = require('../repositories/history_repository');
const careerModel = require('../models/career');
const historyModel = require('../models/history');
const uuid = require('uuid');

require('dotenv').config()

const mode_app = process.env.MODE;
const prodHost = process.env.HOST;
const port = process.env.APP_PORT;
const career_url = process.env.CAREER_URL;

const getAllCareerAdminService = async(page, limit, status) => {
    try {
        // status conf
        const configStatus = {
            "closed": 0,
            "open": 1
        };

        // valid status to boolean
        const validStatus = configStatus[status];

        let totalData;
        // count total pages
        if (status === undefined) {
            totalData = await getCountCareerPages();
        } else {
            totalData = await getCountCareerPages(validStatus);
        }

        // converter pagination
        const {offset, totalPages} = paginateConverter(page, limit, totalData);

        let data;
        // get data
        if (status === undefined) {
            data = await getAllCareer(limit, offset);
        } else {
            data = await getAllCareer(limit, offset, validStatus);
        }

        return {data, totalPages, totalData};
    } catch (error) {
        throw error;
    }
};

// time variable
const currentMillis = Date.now();

const createCareerAdminService = async(payload) => {
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

        // create history logs
        const historyId = "HL-" + uuid.v4();
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        const route_path = `${filepath}/${career_url}/${payload.id}`

        history_payload = {
            id: historyId,
            title: payload.name,
            description: payload.description,
            image_url: "",
            route_path: route_path,
            cpga_id: payload.id,
            created_at: payload.created_at,
            updated_at: payload.updated_at,
        };

        const historyData = historyModel(history_payload, true);
        await createHistory(historyData);

        return {id};
    } catch (error) {
        throw error;
    }
};

const getCareerByIdService = async(id) => {
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

        // update history logs
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        const route_path = `${filepath}/${career_url}/${payload.id}`

        history_payload = {
            title: payload.name,
            description: payload.description,
            image_url: "",
            route_path: route_path,
            updated_at: payload.updated_at,
        };

        const historyData = historyModel(history_payload, false);
        await updateHistory(payload.id, historyData);

        return id;
    } catch (error) {
        throw error;
    }
};

const deleteCareerAdminService = async(id) => {
    try {
        // delete return id
        const data = await deleteCareer(id);
        // delete history logs
        await deleteHistory(id);

        return {id: data};
    } catch (error) {
        throw error;
    }
};

const getAllCareerClientService = async() => {
    try {
        // get data
        const data = await getAllCareerClient();

        return {data};
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getAllCareerAdminService,
    createCareerAdminService,
    getCareerByIdService,
    putCareerByIdAdminService,
    deleteCareerAdminService,
    getAllCareerClientService,
};