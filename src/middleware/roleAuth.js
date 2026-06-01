import { 
    returnID //Servicio que devuelve los datos del usuario por el id
} from '../services/users/login.services.js';

import { VerifyToken } from '../helpers/GenerateToken.js';

export const checkRolAdmin = async (req,res,next) => {
    
    if (req.cookies.jwt) {
        try {

            const decodificada = await VerifyToken(req)
            const datos = await returnID(decodificada.id)
            if (datos[0].rol === "admin") {
                return next()
            } else {
                res.status(409)
                res.send({
                    error: "No tienes permiso"
                })
            }

        } catch (error) {
            console.log(error)
        }    
    }else{
        res.redirect('/login')
    }

}

export const checkRolUser = async (req,res,next) => {
    
    if (req.cookies.jwt) {
        try {

            const decodificada = await VerifyToken(req)
            const datos = await returnID(decodificada.id)
            if (datos[0].rol === "user") {
                return next()
            } else {
                res.status(409)
                res.send({
                    error: "No tienes permiso"
                })
            }

        } catch (error) {
            console.log(error)
        }    
    }else{
        res.redirect('/login')
    }

}