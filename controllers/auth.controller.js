const express = require(`express`)
const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
const userModel = require(`../models/index`).user

//create func to handle auth process
const authenticate = async (request, response) => {
    let dataLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    //check data username and password on admin table
    let dataUser = await userModel.findOne({ where: dataLogin })

    //if data admin exists
    if (dataUser) {
        /**set payload for generate token.
         * payload is must be string.
         * dataAdmin is object, so we must convert to string.
         */
        let payload = JSON.stringify(dataUser)

        //define secret key as signature
        let secret = `mokleters`

        //generate token
        let token = jwt.sign(payload, secret)

        //define res
        return response.json({
            status: `success`,
            message: `Login berhasil`,
            token: token
        })
    }

    //if data admin is not exists
    return response.json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid username or password`
    })
}

//create func authorize
const authorize = (request, response, next) => {
    //get "Authorization" value form req header
    let headers = request.headers.authorization

    /**when using Bearer Token for authorization,
     * we have to split `headers` to get token key,
     * values of headers = `Bearers Tokenkey`
     */
    let tokenkey = headers && headers.split(" ")[1]

    //check nullable token
    if (tokenkey == null) {
        return response.json({
            success: false,
            message: `Unauthorized User`
        })
    }

    //define secret key (equals with secret key in authentication func)
    let secret = `mokleters`

    //verify token using jwt
    jwt.verify(tokenkey, secret, (error, user) => {
        //check if there is error
        if (error) {
            return response.json({
                success: false,
                message: `Invalid Token`
            })
        }
    })

    //if no problem, go to controller
    next()
}

//export func
module.exports = {authenticate, authorize}