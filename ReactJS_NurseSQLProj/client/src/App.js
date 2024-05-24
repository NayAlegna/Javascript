import CsvDownloadButton from 'react-json-to-csv'
import xlsx from 'json-as-xlsx'
import './App.css';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import 'reactjs-popup/dist/index.css';

// Frontend
function App() {

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    const [inputData, setInputData] = useState({Name: "", License: null, DOB: null, Age: null, ID: null})

    // Function that formats a date 
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Function to download XLSX file
    const downloadXLSX = () => {
        const formattedData = [
            {
                sheet: "Nurses",
                columns: [
                    { label: "ID", value: "ID" },
                    { label: "Name", value: "Name" },
                    { label: "License", value: "License" },
                    { label: "Date of Birth", value: "DOB" },
                    { label: "Age", value: "Age" }
                ],
                content: data.map(d => ({
                    ID: d.ID,
                    Name: d.Name,
                    License: d.License,
                    DOB: formatDate(d.DOB),
                    Age: d.Age
                }))
            }
        ];
        let settings = {
            fileName: "NursesXLSX",
        }
        xlsx(formattedData, settings);
    }

    // Function to submit for Add Nurse
    const handleSubmitAdd = async event => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:1768/post", inputData)
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    // Function to submit for Edit Nurse
    const handleSubmitEdit = async event => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:1768/edit/${inputData.ID}`, inputData)
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    // Function to submit for Edit Nurse
    const handleSubmitDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:1768/delete/${id}`)
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    console.log(inputData);
    
    useEffect(()=> {
        const fetchData = async ()=> {
            try {
                // This gets data from .json 
                const res = await axios.get("http://localhost:1768")
                setColumns(Object.keys(res.data[0]));
                setData(res.data);
                
            } catch(err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="App">
            <h1>Nurse Database</h1>
            <table className = "table">
                <thead>
                    <tr>
                        { columns.map((c, i) => (
                            <th key={i}>{c}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        // Map data by each row
                        data.map((d,i) => (
                            <tr key={i}>
                                <td>{d.ID}</td>
                                <td>{d.Name}</td>
                                <td>{d.License}</td>
                                <td>{formatDate(d.DOB)}</td>
                                <td>{d.Age}</td>
                                <Popup trigger=
                                    {<button> Edit</button>} 
                                    modal nested>
                                    {
                                        close => (
                                            <div className='modal'>
                                                <div className='content'>
                                                    <h4>Edit Nurse</h4>
                                                </div>
                                                <form onSubmit={
                                                    handleSubmitEdit
                                                    }>
                                                    <div className='EditBox'>
                                                        Name: <input type="text" placeholder={d.Name} name="Name" onChange={(e)=>{ setInputData({...inputData, Name: e.target.value, ID: d.ID})}}/>
                                                        <br></br><br></br>
                                                        License: <input type="number" placeholder={d.License}required name="License" onChange={(e)=>{ setInputData({...inputData, License: e.target.value, ID: d.ID})}}/>
                                                        <br></br><br></br>
                                                        Date of Birth: <input type="date" placeholder={d.DOB}required name="DOB" onChange={(e)=>{ setInputData({...inputData, DOB: e.target.value, ID: d.ID})}}/>
                                                        <br></br><br></br>
                                                        Age: <input type="number" placeholder={d.Age}required name="Age" onChange={(e)=>{ setInputData({...inputData, Age: e.target.value, ID: d.ID})}}/>
                                                        <br></br><br></br>
                                                    </div>
                                                    <div>
                                                        <button onClick=
                                                            {() => close()}>
                                                                Cancel
                                                        </button>
                                                        <input type="submit" value="Edit"></input>
                                                    </div>
                                                </form>
                                            </div>
                                        )
                                    }
                                </Popup>
                                <Popup trigger=
                                    {<button> Delete</button>} 
                                    modal nested>
                                    {
                                        close => (
                                            <div className='modal'>
                                                <div className='content'>
                                                    <h4>Delete Nurse</h4>
                                                </div>
                                                <div>
                                                        <button onClick=
                                                            {() => close()}>
                                                                Cancel
                                                        </button>
                                                        <input type="submit" value="Delete" onClick={()=>handleSubmitDelete(d.ID)}></input>
                                                    </div>
                                            </div>
                                        )
                                    }
                                </Popup>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <Popup trigger=
                        {<button> Add Nurse</button>} 
                        modal nested>
                        {
                            close => (
                                <div className='modal'>
                                    <div className='content'>
                                        <h4>Add Nurse</h4>
                                    </div>
                                    <form onSubmit= { handleSubmitAdd }>
                                        <div className='AddBox'>
                                            Name: <input type="text" required name="Name" onChange={(e)=>{ setInputData({...inputData, Name: e.target.value})}}/>
                                            <br></br><br></br>
                                            License: <input type="number" required name="License" onChange={(e)=>{ setInputData({...inputData, License: e.target.value})}}/>
                                            <br></br><br></br>
                                            Date of Birth: <input type="date" required name="DOB" onChange={(e)=>{ setInputData({...inputData, DOB: e.target.value})}}/>
                                            <br></br><br></br>
                                            Age: <input type="number" required name="Age" onChange={(e)=>{ setInputData({...inputData, Age: e.target.value})}}/>
                                            <br></br><br></br>
                                            
                                        </div>
                                        <div>
                                            <button onClick=
                                                {() => close()}>
                                                    Cancel
                                            </button>
                                            <input type="submit" data-dismiss="modal" value="Add"></input>
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                    </Popup>
                    
            <CsvDownloadButton 
                data={data}
                filename="NursesCSV.csv"
                >CSV Data</CsvDownloadButton>

            <button onClick={downloadXLSX}> XLSX Data </button>

        </div>
    );
}

export default App;
