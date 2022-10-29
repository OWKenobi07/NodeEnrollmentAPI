const sql = require('mssql');
const configurations = require('../configurations');

const {v4: uuidv4} = require('uuid');

const sqlConfigMain = configurations.sqlConfigMain

const sampleDisplayMessage = (req, res) =>{
    res.send("This is a sample route!")
}

const sampleSqlSelect = async(req, res) =>{
    
    try {
        await sql.connect(sqlConfigMain)
        await sql.query`select * from Users`.then(result =>{
         
           parseInt(result.rowsAffected) >= 1 ? res.send(result.recordset) : res.send("No Records Found!")
          
        })
        sql.close()
    
       } catch (err) {
         console.log(err)
       }
}

// const sampleSqlSelectParams = async (req, res) =>{
    
//     try {
//         await sql.connect(sqlConfigMain)
//         await sql.query`select * from Users where username = ${req.params.username}`.then(result =>{
         
//            parseInt(result.rowsAffected) >= 1 ? res.send(result.recordset) : res.send("No Records Found!")
          
//         })
//         sql.close()
    
//        } catch (err) {
//          console.log(err)
//        }

// }

const sampleSqlSelectParams = async (req, res) =>{
    
    try {
      await sql.connect(sqlConfigMain)
      await sql.query`select * from Users where username = ${req.params.username}`.then(result =>{
       
         parseInt(result.rowsAffected) >= 1 ? res.send(result.recordset) : res.send("No Records Found!")
        
      })
      sql.close()
  
     } catch (err) {
       console.log(err)
     }

}

const sampleSqlInsert = async (req, res) =>{

    const i ={
        Fname: req.body.Fname,
        Mname: req.body.Mname,
        Lname: req.body.Lname,
      }
    
   
    
      try{
        await sql.connect(sqlConfigMain)
    
        let statement = await sql.query`select * from sampletable where Fname = ${i.Fname} and Mname = ${i.Mname} and Lname = ${i.Lname}`
    
        if(statement.recordset.length === 0){
          let uuid = uuidv4();

          await sql.query`insert into sampletable (ID, Fname, Mname, Lname) 
          values ( ${uuid}, ${i.Fname} , ${i.Mname}, ${i.Lname} )`
          res.send("Successfully Saved")
        }else{
          res.send("Already Exist!")
        }
    
        sql.close()
      }catch(err){
        console.log(err)
      }
      
}

const sampleSPInsert = async (req, res) =>{

  const i ={
    Fname: req.body.Fname,
    Mname: req.body.Mname,
    Lname: req.body.Lname,
  }


  try {
    await sql.connect(sqlConfigMain)

    let statement = await sql.query`select * from sampletable where Fname = ${i.Fname} and Mname = ${i.Mname} and Lname = ${i.Lname}`
    
        if(statement.recordset.length === 0){
          const uuid = uuidv4();
          const sqlReq = new sql.Request()

          sqlReq.input('ID', uuid)
          sqlReq.input('Fname', i.Fname)
          sqlReq.input('Mname', i.Mname)
          sqlReq.input('Lname', i.Lname)

          sqlReq.execute('spSampleInsert', (err, result)=>{
             
            if(err === null){
              res.send('Successfully saved');
            } else{
              res.send(err.message)    
            }
           
          })

          
          
        }else{
          res.send("Already Exist!")
        }

    
  } catch (err) {
    console.log(err)
  }

}

const sampleUUID = (req, res) =>{
  res.send(uuidv4())
}

module.exports = {
    sampleDisplayMessage,
    sampleSqlSelect,
    sampleSqlSelectParams,
    sampleSqlInsert,
    sampleUUID,
    sampleSPInsert,
}