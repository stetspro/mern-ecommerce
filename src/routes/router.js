import { Router } from "express";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { passportCall } from "../utils.js";

export default class AppRouter {

  constructor() {
    this.router = Router()
    this.init()
  }

  getRouter() {
    return this.router
  }

  init() { }

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.generateCustomResponse,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }
  
  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.generateCustomResponse,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.generateCustomResponse,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.generateCustomResponse,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }

  applyCallbacks(callbacks) {
    return callbacks.map(callback => async (...params) => {

      try {
        // params( req, res, next)
        // apply apunta directamente a la funcion callback
        // this es para que se utilize en el contexto de la calase R2_Router
        await callback.apply(this, params)
      } catch (error) {
        console.log(error)
        params[1].status(500).send(error)
      }

    })
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = payload => res.json({ status: 'success', payload })
    res.sendServerError = error => res.status(500).json({ status: 'error', error })
    res.sendUserError = error => res.status(400).json({ status: 'error', error })
    res.sendNoAuthenticatedError = (error = 'No auth') => res.status(401).json({ status: 'error', error })
    res.sendNoAuthorizadError = (error = 'No authorized') => res.status(403).json({ status: 'error', error })
    res.sendNotFound = (error = 'Not found') => res.status(404).json({ status: 'error', error })

    next()
  }

  handlePolicies = policies => (req, res, next) => {
    if(policies.includes('PUBLIC')) return next()

    if(policies.length > 0) {
      passportCall('jwt', policies)(req, res, next)
    } else {
      return res.sendNoAuthenticatedError('This resource is private ')
    }
  }

}