import express from "express"
import mysql from "mysql"
import cors from "cors"

// Backend
const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Ay112***ry414++",
    database:"Nurses"
})

app.use(express.json());
app.use(cors({origin: true, credentials: true}));

// Get table from SQL 
app.get("/", (req,res)=> {
    const sql = "SELECT * FROM Nurses.Nurses";
    db.query(sql, (err, data)=> {
        if (err) return res.json(err);
        return res.json(data);
    })
})

// Add SQL 
app.post("/post", (req,res)=> {
    const sql= "INSERT INTO Nurses.Nurses(`Name`, `License`, `DOB`, `Age`) VALUES (?)";
    const values = [
        req.body.Name,
        req.body.License,
        req.body.DOB,
        req.body.Age
    ]

    console.log("values")
    console.log(values) 

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Nurse added successfully!")
    })
})

// Edit SQL 
app.put("/edit/:id", (req,res)=> {
    const nurseId = req.params.id;
    const sql= "UPDATE Nurses.Nurses SET `Name` = ?, `License` = ?, `DOB` = ?, `Age` = ? WHERE id = ?";

    const values = [
        req.body.Name,
        req.body.License,
        req.body.DOB,
        req.body.Age
    ]
    db.query(sql, [...values, nurseId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Nurse updated successfully!")
    })
    
})

app.delete("/delete/:id", (req,res)=>{
    const nurseId = req.params.id;
    const sql = "DELETE FROM Nurses.Nurses WHERE id = ?";

    db.query(sql, [nurseId], (err, data)=> {
        if (err) return res.json(err);
        return res.json("Nurse deleted successfully!")
    })
})

app.listen(1768, ()=>{
    console.log("Connected to backend!")
})