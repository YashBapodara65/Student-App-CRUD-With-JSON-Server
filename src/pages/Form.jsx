import React, { useEffect, useState } from 'react';
import {Box, TextField, Button} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';
import appTitle from "../services/studentAppTitle";
import api from "../services/apiStorageService";
import {v4} from "uuid";
import SkeletonStructure from '../components/SkeletonStructure';

const skeleton_data = [
  {type : "rounded", width:300, height : 140},
  {type : "rounded", width:300, height : 140},
  {type : "rounded", width:300, height : 140},
  {type : "rounded", width:300, height : 140},
  {type : "rounded", width:300, height : 140},
  {type : "rounded", width:300, height : 140},
]

const Form = ({editData}) => {

  (editData?.id == undefined) ? appTitle("Add Student Data") : appTitle("Edit Student Data");
  
  const [store, setStore] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async () => {
      try
      {
        const savedData = await api.getData();
        if(savedData)
        {
          setStore(savedData);
        }
        else
        {
          setStore([])
        }
      }
      catch(err)
      {
        console.log(err);
        setStore([])
      }
    }
    fetchData();
  },[])

  const [studentData, setStudentData] = useState({
    id: v4(),
    name: "",
    class: "",
    grno: "",
    rollno: ""
  });
  
  useEffect(() => {
    if(editData?.id) {
      setStudentData({
        id: editData.id,
        name: editData.name || "",
        class: editData.class || "",
        grno: editData.grno || "",
        rollno: editData.rollno || ""
      });
    }
  }, [editData]);

  const [errors, setErrors] = useState({
    name : false,
    class : false,
    grno : false,
    rollno : false
  });

  const [duplicateVal, setDuplicateVal] = useState({
    grnoVal : "",
    rollnoVal : ""
  })


  // handler for form values
  const handleChange = (e) => {
    let {name, value} = e.target;

    setStudentData({...studentData,[name] : value});

  }

  // handler for checking condition based no value
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({...errors,[name] : value.trim() === ""});
  };

  // handler for remove errors 
  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors({ ...errors, [name]: false });
  };

  // handler for add student record
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setDuplicateVal({
      grnoVal: "",
      rollnoVal: ""
    });
  
    const newErrors = {
      name: studentData.name.trim() === "",
      class: studentData.class.trim() === "",
      grno: studentData.grno.trim() === "",
      rollno: studentData.rollno.trim() === ""
    };
  
    setErrors(newErrors);
  
    if (Object.values(newErrors).includes(true)) {
      return;
    }
  
    if (editData?.id === undefined) {
      // Adding new record
  
      let matchDataByGrno = store.some(item => item.class === studentData.class && item.grno === studentData.grno);
      let matchDataByRollno = store.some(item => item.class === studentData.class && item.rollno === studentData.rollno);
  
      if (matchDataByGrno) {
        setDuplicateVal(prev => ({ ...prev, grnoVal: "Please change GR no" }));
        return;
      }
  
      if (matchDataByRollno) {
        setDuplicateVal(prev => ({ ...prev, rollnoVal: "Please change Roll no" }));
        return;
      }
  
      const newStore = [...store, studentData];
      setStore(newStore);
      try
      {
        await api.postData(studentData);
        toast.success("Student record added successfully!");
        navigate("/");
      }
      catch(err)
      {
        console.error("Failed to post data into api",err);
      }
    } else {
      // Editing existing record
  
      let matchDataByGrno = store.some(
        item =>
          item.class === studentData.class &&
          item.grno === studentData.grno &&
          item.id !== studentData.id
      );
      let matchDataByRollno = store.some(
        item =>
          item.class === studentData.class &&
          item.rollno === studentData.rollno &&
          item.id !== studentData.id
      );
  
      if (matchDataByGrno) {
        setDuplicateVal(prev => ({ ...prev, grnoVal: "Please change GR no" }));
        return;
      }
  
      if (matchDataByRollno) {
        setDuplicateVal(prev => ({ ...prev, rollnoVal: "Please change Roll no" }));
        return;
      }
      try
      {
        await api.updateData(editData?.id,studentData);
        toast.success("Student record updated successfully!");
        navigate("/");
      }
      catch(err)
      {
        console.error("Failed to update data into api",err);
      }
    }
  };
  

  return (
    <>
    <div style={{display:"flex",justifyContent:"center"}}>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ '& .MuiTextField-root': { m: 0, width: '25ch' } }}
      noValidate
      autoComplete="off"
      style={{display:"flex",width:"500px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius:"10px", padding:"30px 50px",flexDirection:"column", gap:"30px", marginTop:"50px", justifyContent:"center", alignItems:"center"}}
    >
        <h1>{editData?.id == undefined ? "Add" : "Edit"} Student Form</h1>
        <div style={{width:"100%"}}>
        <TextField id="outlined-search" name="name" onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} value={studentData.name} style={{width:"100%", marginBottom:"10px"}} label="Student name" type="text" />
        {
          errors.name ? <span style={{color:"red"}}>Student name is required *</span> : ""
        }
      </div>
      <div style={{width:"100%"}}>
        <TextField id="outlined-search" name="class" onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} value={studentData.class} style={{width:"100%", marginBottom:"10px"}} label="Student Class" type="number" />
        {
          errors.class ? <span style={{color:"red"}}>Student class is required *</span> : ""
        }
      </div>
      <div style={{width:"100%"}}>
        <TextField id="outlined-search" name="grno" inputProps={{min:1}} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} value={studentData.grno} style={{width:"100%", marginBottom:"10px"}} label="Student GR.No." type="number" />
        {
          errors.grno ? <span style={{color:"red"}}>Student GR No is required *</span> : ""
        }
        {
          duplicateVal.grnoVal == "" ? "" : <span style={{color:"red"}}>{duplicateVal.grnoVal} *</span>
        }
      </div>
      <div style={{width:"100%"}}>
        <TextField id="outlined-search" inputProps={{min:1}} name="rollno" onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} value={studentData.rollno} style={{width:"100%", marginBottom:"10px"}} label="Student Roll No" type="number" />
        {
          errors.rollno ? <span style={{color:"red"}}>Student Roll No is required *</span> : ""
        }
        {
          duplicateVal.rollnoVal == "" ? "" : <span style={{color:"red"}}>{duplicateVal.rollnoVal} *</span>
        }
      </div>
      <div style={{width:"100%", display:"flex", gap:"20px"}}>
        {
          editData?.id == undefined
          ?
          <Button type='submit' style={{background:"blue", color:"white", padding:"12px 40px"}}>Add Data</Button>
          :
          <Button type='submit' style={{background:"orange", color:"white", padding:"12px 40px"}}>Edit Data</Button>
        }
        <Link to={"/"}>
            <Button
              type="button"
              style={{
                background: "black",
                color: "white",
                padding: "12px 40px",
              }}
            >
              Back
            </Button>
          </Link>
      </div>
    </Box>
    </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop:"40px" }}>
          <div style={{ width: "90%", padding: "16px" }}>
            <SkeletonStructure skeleton_data={skeleton_data} />
          </div>
        </div>
    </>
  )
}

export default Form