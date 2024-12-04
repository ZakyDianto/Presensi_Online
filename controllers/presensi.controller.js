const { request, response } = require('express')
const { presensi: presensiModel, user: userModel } = require('../models')
const Op = require(`sequelize`).Op
const moment = require('moment')

//func add presensi
exports.addPresensi = async (request, response) => {
    try {
        const { user_id, date, time, status } = request.body

        const formattedDate = new Date(date).toISOString().split('T')[0]

        //masukkan data ke tabel 
        const result = await presensiModel.create({ userID: user_id, date:formattedDate, time, status })

        //respon
        return response.json({
            status: 'success',
            message: 'Presensi berhasil dicatat',
            data: {
                attendance_id: result.id,
                user_id: result.userID,
                date: result.date.toISOString().split('T')[0],
                time: result.time,
                status: result.status,
            },
        })
    } catch (error) {
        return response.json({
            status: 'fail',
            message: error.message,
        })
    }
}

//func get history by id
exports.getPresensiId = async (request, response) => {
    try{
        const { id } = request.params

        const presensiList = await presensiModel.findAll({ where: {userID: id}})

        if (presensiList.length === 0) {
            return response.status(404).json({
                status: 'fail',
                message: `Tidak ada presensi untuk user_id ${id}`,
            })
        }
        return response.json({
            status: `success`,
            data:presensiList.map (presensi => ({
                attendance_id: presensi.id,
                date: presensi.date.toISOString().split('T')[0],
                time: presensi.time,
                status: presensi.status
            }))
        })
    }catch(error){
        return response.json({
            status: `fail`,
            message: error.message
        })
    }  
}

exports.getRekapBulanAnalis = async (req, res) => {
    try {
        const id = req.params.id // Get the user ID from the request parameters
        const month = req.params.bulan || moment().format('YYYY-MM') // Get the month from query parameter or use the current month

        // Fetch attendance records for the user within the specified month
        const presensis = await presensiModel.findAll({
            where: {
                userID: id,
                date: {
                    [Op.startsWith]: month // Match dates that start with the specified month
                }
            }
        })
        console.log('Specified Month:', month)
        console.log('Attendance Records:', presensis)

        // Initialize the attendance summary object
        const summary = {
            hadir: 0,
            izin: 0,
            sakit: 0,
            alpha: 0
        }

        // Iterate through the attendance records to calculate the summary
        presensis.forEach(presensi => {
            switch (presensi.status.toLowerCase()) {
                case 'hadir':
                    summary.hadir += 1
                    break
                case 'izin':
                    summary.izin += 1
                    break
                case 'sakit':
                    summary.sakit += 1
                    break
                case 'alpa':
                    summary.alpha += 1
                    break
            }
        })

        // Respond with the attendance summary
        return res.json({
            status: "success",
            data: {
                user_id: id,
                month: month,
                attendance_summary: summary
            }
        })
     
    } catch (error) {
        // Handle errors and respond with an error message
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


// Function to get the attendance summary for a specific user
exports.getRekapBulan = async (req, res) => {
    try {
        const id = req.params.id // Get the user ID from the request parameters

        // Automatically get the current month in YYYY-MM format
        const currentMonth = moment().format('YYYY-MM')

        // Fetch attendance records for the user within the current month
        const presensis = await presensiModel.findAll({
            where: {
                userID: id,
                date: {
                    [Op.startsWith]: currentMonth // Match dates that start with the current month
                }
            }
        })
        console.log('Current Month:', currentMonth)
        console.log('Attendance Records:', presensis)

        // Initialize the attendance summary object
        const summary = {
            hadir: 0,
            izin: 0,
            sakit: 0,
            alpha: 0
            
        }

        // Iterate through the attendance records to calculate the summary
        presensis.forEach(presensi => {
            switch (presensi.status.toLowerCase()) {
                case 'hadir':
                    summary.hadir += 1
                    break
                case 'izin':
                    summary.izin += 1
                    break
                case 'sakit':
                    summary.sakit += 1
                    break
                case 'alpa':
                    summary.alpha += 1
                    break
            }
        })

        // Respond with the attendance summary
        return res.json({
            status: "success",
            data: {
                user_id: id,
                month: currentMonth,
                attendance_summary: summary
            }
        })
     
    } catch (error) {
        // Handle errors and respond with an error message
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

