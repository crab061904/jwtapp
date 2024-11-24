//authentication router
import express, { Router } from 'express';
import { login, register } from '../controllers/authentication';

export default (router: Router) => {
  router.post('/auth/register', (req, res, next) => {
    console.log("Register route attached.");
    next();
  }, register);
  
  router.post('/auth/login',login);
};