//Load joi library
const joi = require(`joi`)

//Create func to validate request of user
const validatePresensi = (request, response, next) => {
    //define rules for req
    const rules = joi
    .object()
    .keys({
        //user_id is required
        user_id: joi.number().integer().required(),
        //date is required
        date: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        //time is required
        time: joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/).required(),
        //status is required
        status: joi.string().valid(`hadir`,`izin`, `sakit`, `alpha`),
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

module.exports = {validatePresensi}
