const { 
    getAllCategory, 
    updateCategory, 
    createCategory, 
    deleteCategory,
} = require('../repositories/category_repository');
const uuid = require('uuid');
const categoryModel = require('../models/category');

const getAllCategoryAdminService = async() => {
    try {
        // get all data
        const data = await getAllCategory();

        return {data};
    } catch (error) {
        throw error;
    }
};

// time variable
const currentMillis = Date.now();

const postCategoryAdminService = async(payload) => {
    try {
        // add more parameter
        payload.id = "CT-" +uuid.v4();
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;

        // validate model
        const data = categoryModel(payload, true);

        // insert data
        const id = await createCategory(data);

        return {id};
    } catch (error) {
        throw error;
    }
};

const putCategoryByIdAdminService = async(payload, reqId) => {
    try {
        // set time update and id
        payload.id = reqId;
        payload.updated_at = currentMillis;

        // validate model
        const data = categoryModel(payload, false);
        // get payload by id
        const id = await updateCategory(data);

        return id;
    } catch (error) {
        throw error;
    }
};

const deleteCategoryAdminService = async(id) => {
    try {
        // delete return id
        const data = await deleteCategory(id);

        return {id: data};
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCategoryAdminService,
    postCategoryAdminService,
    putCategoryByIdAdminService,
    deleteCategoryAdminService,
};