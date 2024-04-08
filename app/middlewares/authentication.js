const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { responseError } = require('../utils/responses');
const uuid = require('uuid');
const {
  getTokenByUserId,
  updateToken,
  createToken,
} = require('../repositories/token_repository');
const basicAuth = require('express-basic-auth');

// env
require('dotenv').config()
// key
const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_SECRET_KEY;
const usernameBasic = process.env.USERNAME_BASIC;
const passwordBasic = process.env.PASSWORD_BASIC;

const generateToken = async (id, username, email, role = 'user') => {
  try {
    // respon variable
    const token = {};

    // payload jwt sign
    const payload = { id, username, email, role }; 

    // set accesstoken jwt sign
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: process.env.SECRET_KEY_EXP });
    token['access_token'] = accessToken;

    // check mysql auth refresh token not expired
    const authToken = await getTokenByUserId(id);
    if (authToken) {
      const decodedRefreshToken = jwt.decode(authToken.refresh_token);
      if (decodedRefreshToken && decodedRefreshToken.exp < Date.now() / 1000) {
        const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: process.env.REFRESH_SECRET_KEY_EXP });
        token['refresh_token'] = refreshToken;

        await updateToken(id, refreshToken);
      } else {
        token['refresh_token'] = authToken.refresh_token;
      }
    }
    // check mysql not yet have token
    if (!authToken) {
      const token_id = uuid.v4();
      const time_at = Date.now();

      const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: process.env.REFRESH_SECRET_KEY_EXP });
      token['id'] = token_id;
      token['user_id'] = id;
      token['refresh_token'] = refreshToken;
      token['created_at'] = time_at;

      await createToken(token);
    }
    return token;
  } catch (error) {
    throw error;
  }
};

// auth access token user
const authenticateToken = (req, res, next) => {
  try {
    // get and check access token
    let reqToken = req.header('Authorization');
    if (!reqToken) return responseError(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Token not provided');
    reqToken = reqToken.split(' ')[1];
    const token = reqToken;

    if (!token) {
      return responseError(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Token not provided');
    }
    
    // verify jwt token
    jwt.verify(token, secretKey, (err, authUser) => {
      if (err) {
          throw err;
      }
      // payload token data
      req.authUser = authUser;

      next();
    });
  } catch (error) {
    return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// auth refresh token user
const authenticateRefreshToken = async(req, res, next) => {
  try {
    // get and check refresh token
    let reqToken = req.header('Authorization');
    if (!reqToken) return responseError(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Token not provided');
    reqToken = reqToken.split(' ')[1];
    const token = reqToken;
    const decodedToken = jwt.decode(token);
    const authRefreshPayload = await getTokenByUserId(decodedToken.id);
    if (authRefreshPayload.refresh_token !== token) throw new Error('Unauthorized: token not valid')

    if (!token) {
      return responseError(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Refresh token not provided');
    }
    // verify jwt token
    jwt.verify(token, refreshKey, async(err, authRefreshUser) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          try {
            const { id, username, email, role } = decodedToken;
  
            // Generate new refresh token
            const newAccessToken = jwt.sign({ id, username, email, role }, secretKey, { expiresIn: process.env.SECRET_KEY_EXP });
            const newRefreshToken = jwt.sign({ id, username, email, role }, refreshKey, { expiresIn: process.env.REFRESH_SECRET_KEY_EXP });
            await updateToken(id, newRefreshToken);
  
            const token = {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            }
            
            req.authRefreshUser = token;
            return next();
          } catch (error) {
            throw err;
          }
        }
        throw err;
      }

      const { id, username, email, role } = decodedToken;
  
      // Generate new refresh token
      const newAccessToken = jwt.sign({ id, username, email, role }, secretKey, { expiresIn: process.env.SECRET_KEY_EXP });
      const newRefreshToken = jwt.sign({ id, username, email, role }, refreshKey, { expiresIn: process.env.REFRESH_SECRET_KEY_EXP });
      await updateToken(id, newRefreshToken);

      const token = {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      }

      req.authRefreshUser = token;
      next();
    });
  } catch (error) {
    if (error.message === "Unauthorized: token not valid") {
        return responseError(res, httpStatus.UNAUTHORIZED, error.message);
    }
    return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// basic auth register
const basicToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      return responseError(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Basic Auth header is missing');
    }

    // Extract credentials from the header
    const base64Credentials = authorizationHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    const userMatches = basicAuth.safeCompare(username, usernameBasic);
    const passwordMatches = basicAuth.safeCompare(password, passwordBasic);

    if (!userMatches || !passwordMatches) {
      return responseError(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Basic Auth wrong username/password');
    }
    next();
  } catch (error) {
    return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  generateToken,
  basicToken,
  authenticateToken,
  authenticateRefreshToken,
};

