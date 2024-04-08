const { 
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
} = require('../repositories/user_repository');
const uuid = require('uuid');
const userModel = require('../models/user');
const { hash, compare } = require('../utils/hash_compare');
const { generateToken } = require('../middlewares/authentication');
const { deleteToken } = require('../repositories/token_repository');

// time variable
const currentMillis = Date.now();

const registerUserAdminService = async(payload) => {
    try {
        const user = await getUserByUsername(payload.username);
        if (user) throw new Error("User already exist");

        // add more parameter
        payload.id = "US-" +uuid.v4();
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;

        // hash password
        const hashPassword = await hash(payload.password)
        payload.password = hashPassword

        // validate model
        const data = userModel(payload, true);

        // insert data
        const id = await createUser(data);

        return {id};
    } catch (error) {
        throw error;
    }
};

const loginUserAdminService = async (payload) => {
    try {
        const user = await getUserByUsername(payload.username);
        if (user === undefined) throw new Error("User not found");

        const isPasswordMatch = await compare(payload.password, user.password);
        if (!isPasswordMatch) throw new Error('Wrong username or password');

        const tokenData = await generateToken(user.id, user.username, user.email, user.role)

        const { access_token, refresh_token } = tokenData;
        const token = { access_token, refresh_token };
        return token;
    } catch (error) {
        throw error;
    }
};

const logoutUserAdminService = async (authUser) => {
    const authTokenPayload = await getUserByUsername(authUser.username);
    if (!authTokenPayload) throw new Error('Unauthorized: token not valid')
    
    const userId = await deleteToken(authTokenPayload.id);
    
    return userId;
};

const putUserByIdAdminService = async(payload, reqId) => {
    try {
        // set time update and id
        payload.id = reqId;
        payload.updated_at = currentMillis;

        // validate model
        const data = userModel(payload, false);
        // get payload by id
        const id = await updateUser(data.value.id, data.value);

        return id;
    } catch (error) {
        throw error;
    }
};

const deleteUserAdminService = async(id) => {
    try {
        // delete return id
        const userId = await deleteUser(id);

        return userId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    registerUserAdminService,
    loginUserAdminService,
    logoutUserAdminService,
    putUserByIdAdminService,
    deleteUserAdminService,
};