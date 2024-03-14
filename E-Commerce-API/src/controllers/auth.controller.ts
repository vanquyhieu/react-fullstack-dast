import {Request, Response, NextFunction} from 'express'
import authService from '../services/auth.service';
import { sendJsonSuccess } from '../helpers/responseHandler';

const login = async(req:Request, res: Response, next: NextFunction)=>{
  try {
    /**
     * payload = {email, password}
     */
    const payload = req.body;
    const result = await authService.login(payload);    
    console.log('<<=== 🚀 result ===>>',payload,result);

    sendJsonSuccess(res)(result); 
  } catch (error) {
    next(error)
  }
}
const loginAdmin = async(req:Request, res: Response, next: NextFunction)=>{
  try {
    /**
     * payload = {email, password}
     */
    const payload = req.body;
    const result = await authService.loginAdmin(payload);    
    console.log('<<=== 🚀 result ===>>',payload,result);

    sendJsonSuccess(res)(result); 
  } catch (error) {
    next(error)
  }
}
const logout = async(req:Request, res: Response, next: NextFunction)=>{
  try {
    /**
     * payload = {email, password}
     */
    const payload = req.body
    const result = await authService.logout(payload);
    console.log('<<=== 🚀 result ===>>',payload,result);
    sendJsonSuccess(res)(result); 
  } catch (error) {
    next(error)
  }
}
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id} = res.locals.user;
    console.log('getProfileClient',_id)
    const user = await authService.getProfile(_id);
    console.log('getProfileClient', user)
    sendJsonSuccess(res)(user);
  } catch (error) {
    next(error);
  }
};
const getProfileAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id} = res.locals;
    console.log(`res.locals`,res.locals);
    const user = await authService.getProfile(_id);
    
    sendJsonSuccess(res)(user);
  } catch (error) {
    next(error);
  }
};
const freshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const token = await authService.refreshToken(user);
    sendJsonSuccess(res)(token);
  } catch (error) {
    next(error);
  }
};
const freshTokenAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const tokens = await authService.refreshToken(user);
    sendJsonSuccess(res)(tokens);
  } catch (error) {
    next(error);
  }
};  
export default {
  login,
  loginAdmin,
  logout,
  getProfile,
  getProfileAdmin,
  freshToken,
  freshTokenAdmin,
}