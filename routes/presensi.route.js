const express = require('express')
const { authorize } = require(`../controllers/auth.controller`)
const presensiController = require('../controllers/presensi.controller')
const { validatePresensi } = require('../middlewares/presensi_validation')
const app = express()
app.use(express.json())

// Endpoint
app.post('/', [authorize],[validatePresensi] ,presensiController.addPresensi)
app.get('/history/:id', [authorize],presensiController.getPresensiId)
app.get('/summary/:id/:bulan', [authorize],presensiController.getRekapBulanAnalis)
app.get('/summary/:id', [authorize],presensiController.getRekapBulan)

module.exports = app
