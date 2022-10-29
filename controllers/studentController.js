const sql = require('mssql');
const {sqlConfigMain} = require('../configurations');
const {v4: uuidv4} = require('uuid');



const saveNewStudentRec = async (req, res) =>{

        const i = {
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            middleName: req.body.middleName, 
            suffix: req.body.suffix,
            gender: req.body.gender,
            dBirth: req.body.dBirth,
            mobileNo: req.body.mobileNo,
            emailAddress: req.body.emailAddress,
            address: req.body.address,
            barangay: req.body.barangay,
            municipality: req.body.municipality,
            province: req.body.province,
            fLastName: req.body.fLastName,
            fFirstName: req.body.fFirstName,
            fMiddleName: req.body.fMiddleName,
            fSuffix: req.body.fSuffix,
            fDbirth: req.body.fDbirth,
            fOccupation: req.body.fOccupation,
            fMobileNo: req.body.fMobileNo,
            mLastName: req.body.mLastName,
            mFirstName: req.body.mFirstName,
            mMiddleName: req.body.mMiddleName,
            mSuffix: req.body.mSuffix,
            mDbirth: req.body.mDbirth,
            mOccupation: req.body.mOccupation,
            mMobileNo: req.body.mMobileNo,
            primaryEducation: req.body.primaryEducation,
            primaryStartYear: req.body.primaryStartYear,
            primaryGradYear: req.body.primaryGradYear,
            secondaryEducation: req.body.secondaryEducation,
            secondaryStartYear: req.body.secondaryStartYear,
            secondaryGradYear: req.body.secondaryGradYear  
        }

        try {

            await sql.connect(sqlConfigMain)

            let statement = await sql.query`select * from StudentApplicants where Lastname = ${i.lastName} 
            and Firstname = ${i.firstName} and Middlename = ${i.middleName}`

            if (statement.recordset.length === 0) {
                let uuid = uuidv4()

                await sql.query`insert into StudentApplicants (ID, Lastname, Firstname, Middlename, Suffix, Gender, Dbirth, Address, 
                    Barangay, Municipality, Province, MobileNumber, EmailAddress, Fa_Lastname, Fa_Firstname, Fa_Middlename, Fa_Suffix, 
                    Fa_Dbirth, Fa_Occupation, Fa_MobileNumber, Mo_Lastname, Mo_Firstname, Mo_Middlename, Mo_Suffix, Mo_Dbirth, Mo_Occupation, Mo_MobileNumber, 
                    PrimaryEducation, PrimaryStartYear, PrimaryGradYear, SecondaryEducation, SecondaryStartYear, 
                    SecondaryGradYear) values (${uuid}, ${i.lastName}, ${i.firstName}, ${i.middleName}, ${i.suffix},
                    ${i.gender}, ${i.dBirth}, ${i.address}, ${i.barangay}, ${i.municipality}, ${i.province}, ${i.mobileNo},${i.emailAddress},
                    ${i.fLastName}, ${i.fFirstName}, ${i.fMiddleName}, ${i.fSuffix}, ${i.fDbirth}, ${i.fOccupation}, ${i.fMobileNo},
                    ${i.mLastName}, ${i.mFirstName}, ${i.mMiddleName}, ${i.mSuffix}, ${i.mDbirth}, ${i.mOccupation}, ${i.mMobileNo},      
                    ${i.primaryEducation}, ${i.primaryStartYear}, ${i.primaryGradYear}, ${i.secondaryEducation},
                    ${i.secondaryStartYear}, ${i.secondaryGradYear})`
                
                res.send({message: 'Successfully enrolled new student', stat: 1})
                
            } else {
                res.send({message: 'Student already exist'})
            }
            
        } catch (err) {
            res.send(err)
        }

}


const saveEnrollment = async (req, res) =>{

    const i ={
        studentID: req.body.studentID,
        reason: req.body.reason,
        action: req.body.action,
        lastName: req.body.addedItem.Lastname,
        firstName: req.body.addedItem.Firstname,
        middleName: req.body.addedItem.Middlename, 
        suffix: req.body.addedItem.Suffix,
        gender: req.body.addedItem.Gender
    }
    

    try {

        await sql.connect(sqlConfigMain)

        let statement = await sql.query`select * from Students where StudentApplicant_ID = ${i.studentID}`

        if (statement.recordset.length === 0) {
            let uuid = uuidv4()

            await sql.query`insert into Students(ID, StudentApplicant_ID, Lastname, Firstname, Middlename, Suffix, Gender) 
            values (${uuid}, ${i.studentID}, ${i.lastName}, ${i.firstName}, ${i.middleName}, ${i.suffix}, ${i.gender})`

            await sql.query`update StudentApplicants set EnrollmentStatus = 'ENROLLED' where ID = ${i.studentID}`
            
            res.send({message: 'Student Accepted!', stat: 1})
            
        } else {
            res.send({message: 'Student record already exist'})
        }
      
        
    } catch (err) {
        res.send({message: err})   
    }

}

const loadStudents = async(req, res) =>{

    try {
        await sql.connect(sqlConfigMain)
        await sql.query`select * from Students`.then(result =>{
         
           parseInt(result.rowsAffected) >= 1 ? res.send(result.recordset) : res.send("No Records Found!")
          
        })
        sql.close()
    
       } catch (err) {
         console.log(err)
       }

}

const studentApplicants = async (req, res) =>{
    
    let pool = await sql.connect(sqlConfigMain)
    const transaction = new sql.Transaction(pool)
    transaction.begin(err => {
        

        if(err){
            req.send(err.message)
        }

        let rolledBack = false
        transaction.on('rollback', aborted => {
            // emited with aborted === true
    
            rolledBack = true
        })
    
        const request = new sql.Request(transaction)
        request.query(`select * from StudentApplicants where EnrollmentStatus = 'PENDING'`, (err, result) => {
            
            if(err){
                res.send(err.message)
            }
    
            transaction.commit(err => {

                if(err){
                    if (!rolledBack) {
                        transaction.rollback(err => {
                            // ... error checks
                        })
                    }
                }
                res.send(result.recordset)
    
            })
        })
    })
    
}

module.exports = {
    saveNewStudentRec,
    saveEnrollment,
    loadStudents,
    studentApplicants,
}