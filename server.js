const express = require(`express`)
const app = express()
const PORT = 8000
const cors = require(`cors`)
const path = require(`path`)

app.use(cors())
app.use(express.json())

const userRoute = require(`../presensi_online/routes/user.route`)
const presensiRoute = require(`../presensi_online/routes/presensi.route`)
const auth = require(`./routes/auth.route`)

app.use(`/api/users`, userRoute)    
app.use(`/api/attendance`, presensiRoute)    
app.use(`/api/auth/login`, auth)    


app.listen(PORT, () => {
    console.log(`Server Presensi Online berjalan di PORT ${PORT}`)
}) 