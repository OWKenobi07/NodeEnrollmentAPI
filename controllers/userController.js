const sql = require('mssql');
const bcrypt = require('bcrypt');
const {sqlConfigMain, sqlStore} = require('../configurations');
const {v4: uuidv4} = require('uuid');




const addupdateUser = async (req, res) =>{

   let cryptPass = bcrypt.hashSync(req.body.password, 10)

    const i = {
        fullname: req.body.userFullname,
        username: req.body.username,
        password: cryptPass,
        emailAddress: req.body.emailAddress,
        mobileNo: req.body.mobileNo

    }


       try {
        let pool = await sql.connect(sqlConfigMain)
        const ps = new sql.PreparedStatement(pool)
        let nId = uuidv4()


        let statement = await sql.query `select username from Users where username = ${i.username}`
        
        if (statement.recordset.length === 0) {
            
            ps.input('uuid', sql.UniqueIdentifier)
            ps.input('username', sql.NVarChar(50))
            ps.input('fullname', sql.NVarChar(50))
            ps.input('emailAddress', sql.NVarChar(50))
            ps.input('mobileNo', sql.NVarChar(50))
            ps.input('password', sql.VarChar(100))

            ps.prepare(`insert into Users (Id, username, Fullname, EmailAddress, MobileNo, Password) values
                    (@uuid, @username, @fullname, @emailAddress, @mobileNo, @password)`, err => {
        
                        if(err){
                            res.send(err.message)
                        }

                ps.execute({uuid: nId, 
                            username: i.username, 
                            fullname: i.fullname,
                            emailAddress: i.emailAddress,
                            mobileNo: i.mobileNo,
                            password: i.password} , (err, result) => {

                    ps.unprepare(err => {
                        if(err){
                            res.send(err.message)
                        }
                    })
                })
                
            })
            res.send({message: 'Successfully saved!', stat: 1})

        } else {
            res.send({message:'Username already exist, Choose another username', stat: 0})
        }
       
        } catch (err) {
            console.log(err)
        }
    

}


function crypt (password){
    bcrypt.genSalt().then(salt =>{
        bcrypt.hash(password, salt).then(hash => {
            return hash
        })
    })
}

// const searchUser = async (req, res) =>{
    
  
//     try{
//       await sql.connect(sqlConfigMain)
//       await sql.query`select * from StudentApplicants`.then(result =>{
    
//         parseInt(result.rowsAffected) !== 0 ? res.send(result.recordset) : res.send("No Records Found!")
//         sql.close()
//       })
//       } catch (err) {
//         console.log(err)
//       }
// }



const loginUser = async (req, res) =>{

    let pool = await sql.connect(sqlConfigMain)
    const ps = new sql.PreparedStatement(pool)
    let nId = uuidv4()
   

    const i = {
        username: req.body.username,
        password: req.body.password
    }


    let statement = await sql.query `select username, fullname, password from Users where username = ${i.username}`

   try {
       
    if(statement.recordset.length === 1){
        var result = bcrypt.compareSync(i.password, statement.recordset[0].password)
        delete statement.recordset[0].password

        if(result){
            req.session.user = statement.recordset
            res.send({message:'Login Successful!', sID: req.session.id, userFullname: req.session.user[0].fullname, stat: 1})
        }else{
            res.send({message:'Username and Password did not match!', stat: 0})
        }
      


    }else{
        res.send({message:'Username do not exist', stat: 0})
    }


   } catch (err) {
       
   }

}

const isLoggedIn = async (req, res) =>{

        const sID = req.query.sID

        sqlStore.get(sID, (error, result) => {
            

            if (error){
                res.send(error)
            }else{
                if(result){
                    res.send(result.user)
                }
            }   
        })

}


module.exports = {
    addupdateUser,
    loginUser,
    isLoggedIn
}