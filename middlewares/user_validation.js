//Load joi library
const joi = require(`joi`)

//Create func to validate request of user
const validateUser = (request, response, next) => {
    //define rules for req
    const rules = joi
    .object()
    .keys({
        //name is required
        name: joi.string().required(),
        //username is required
        username: joi.string().required(),
        //password is required
        password: joi.string().required(`md5`),
        //role is required
        role: joi.string().valid(`siswa`,`karyawan`),
    })
    .options({ abortEarly: false})

    //get error of validation if it exists
    let {error} = rules.validate(request.body)

    //if error exists
    if (error != null) {
        //get all error message
        let errMessage = error.details.map(it => it.message).join(",")

        //return error  message with code 422
        return response.status(422).json({
            success: false,
            message: errMessage
        })
    }
    //if error doesn't exists, continue to controller
    next()
}

module.exports = {validateUser}
