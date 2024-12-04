const userModel = require(`../models/index`).user
const { request, response } = require("express")
const md5 = require(`md5`)
/** Load Operation from Sequelize */
const Op = require(`sequelize`).Op

//Func untuk tambah user
exports.addUser = (request, response) => {
    let newUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    //Proses masukkan data ke tabel user
    userModel.create(newUser)
    .then(result => {
        return response.json({
            status: `success`,
            message: `Pengguna berhasil ditambahkan`,
            data: {
                id: result.id,
                name: result.name,
                username: result.username,
                role: result.role
            }
        })
    })
    .catch(error => {
        return response.json({
            status: `fail`,
            message: error.message
        })
    })
}

//Func update user
exports.updateUser = async (request, response) => {
    try {
        let dataUser = {
            name: request.body.name,
            username: request.body.username,
            password: md5(request.body.password),
            role: request.body.role,
        }

        // ID pengguna yang akan diperbarui
        let idUser = request.params.id;

        // Proses pembaruan
        let [updated] = await userModel.update(dataUser, { where: { id: idUser } })

        if (updated) {
            // Ambil data pengguna yang diperbarui
            let updatedUser = await userModel.findOne({ where: { id: idUser } })

            return response.json({
                status: `success`,
                message: `Pengguna berhasil diubah`,
                data: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    username: updatedUser.username,
                    role: updatedUser.role,
                },
            })
        } else {
            return response.json({
                status: `fail`,
                message: `User tidak ditemukan atau tidak dapat diubah`,
            });
        }
    } catch (error) {
        return response.json({
            status: `fail`,
            message: error.message,
        })
    }
}

//Func untuk get data berdasarkan ID
exports.getUserId = async (request, response) => {
    try {
        //Id dari params
        const idUser = request.params.id

        //cari user dengan id
        const user = await userModel.findOne({ where: {id: idUser}})

        if (!user) {
            return response.json({
                status: `fail`,
                message: `Id user ${idUser} tidak ditemukan`
            })
        }
        return response.json({
            status: `success`,
            data: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        })
    } catch(error){
        return response.json({
            status: `fail`,
            message: error.message
        })
    }  
}

//Func hapus user
exports.deleteUser = async (request, response) => {
    try{
        const idUser = request.params.id

        const user = await userModel.findOne({ where: { id: idUser}})

        if (!user) {
            return response.json({
                status: `fail`,
                message: `User dengan ID ${idUser} tidak ditemukan`
            })
        }

        //hapus
        await userModel.destroy({ where: { id: idUser}})

        return response.json({
            status: `success`,
            message: `Berhasil menghapus user`,
            data:{
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        })
    } catch(error){
        return response.json({
            status: `fail`,
            message: error.message
        })
    }
}

//func get All
exports.getAllUser = async (request, response) => {
    let users = await userModel.findAll();
    return response.json({
        success: true,
        data: users,
        message: `All Users have been loaded`
    });
};