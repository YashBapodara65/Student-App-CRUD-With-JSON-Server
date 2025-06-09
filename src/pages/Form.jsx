import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Skeleton
} from '@mui/material';
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import appTitle from "../services/studentAppTitle";
import api from "../services/apiStorageService";
import { v4 } from "uuid";

const skeletonFields = [
  { type: "text", height: 40 },
  { type: "text", height: 40 },
  { type: "text", height: 40 },
  { type: "text", height: 40 },
  { type: "text", height: 40 },
  { type: "rectangular", height: 60 },
];

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Set document title
  useEffect(() => {
    appTitle(id ? "Edit Student Data" : "Add Student Data");
  }, [id]);

  const [store, setStore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [duplicateVal, setDuplicateVal] = useState({ grnoVal: "", rollnoVal: "" });

  const [studentData, setStudentData] = useState({
    id: v4(),
    name: "",
    class: "",
    grno: "",
    rollno: ""
  });

  useEffect(()=>{
    if(id)
    {
      fetchDataById();
    }
    else
    {
      setStudentData({
        id: v4(),
        name: "",
        class: "",
        grno: "",
        rollno: ""
      })
    }
  },[id])

  const fetchDataById = async () => {
    try {
      const savedData = await api.getData();
  
      if (Array.isArray(savedData) && savedData.length > 0) {
        setStudentData(savedData);
      } else {
        setStudentData([]); // empty or failed fetch
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStudentData([]); // fallback in case something throws
    }
    // setStudentData(editData)
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.getData();
        setStore(data || []);
        if (id) {
          const existing = data.find(item => item.id === id);
          if (existing)
          {
            setStudentData(existing);
          }  
          else navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setStore({
          id: v4(),
          name: "",
          class: "",
          grno: "",
          rollno: ""
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, class: cls, grno, rollno } = studentData;

    const fieldErrors = {
      name: !name.trim(),
      class: !cls.toString().trim(),
      grno: !grno.toString().trim(),
      rollno: !rollno.toString().trim()
    };

    setErrors(fieldErrors);
    setDuplicateVal({ grnoVal: "", rollnoVal: "" });

    if (Object.values(fieldErrors).some(Boolean)) return;

    const isDuplicate = (key) =>
      store.some(item =>
        item.class === cls && item[key] === studentData[key] && item.id !== studentData.id
      );

    if (!id) {
      if (isDuplicate("grno")) {
        setDuplicateVal(prev => ({ ...prev, grnoVal: "Please change GR no" }));
        return;
      }
      if (isDuplicate("rollno")) {
        setDuplicateVal(prev => ({ ...prev, rollnoVal: "Please change Roll no" }));
        return;
      }

      try {
        await api.postData(studentData);
        toast.success("Student record added successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error adding data:", err);
      }
    } else {
      if (isDuplicate("grno")) {
        setDuplicateVal(prev => ({ ...prev, grnoVal: "Please change GR no" }));
        return;
      }
      if (isDuplicate("rollno")) {
        setDuplicateVal(prev => ({ ...prev, rollnoVal: "Please change Roll no" }));
        return;
      }

      try {
        await api.updateData(studentData.id, studentData);
        toast.success("Student record updated successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error updating data:", err);
      }
    }
  };

  const renderField = (label, name, type = "text", isNumber = false) => (
    <Box sx={{ width: "100%" }}>
      <TextField
        label={label}
        name={name}
        type={type}
        inputProps={isNumber ? { min: 1 } : {}}
        value={studentData[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        sx={{ mb: 1 }}
      />
      {errors[name] && <span style={{ color: "red" }}>{label} is required *</span>}
      {duplicateVal[`${name}Val`] && <span style={{ color: "red" }}>{duplicateVal[`${name}Val`]} *</span>}
    </Box>
  );

  return (
      isLoading && id
      ?
      <Box display="flex" justifyContent="center" mt={6}>
        <Box
          sx={{
            width: 500,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {skeletonFields.map((item, i) => (
            <Skeleton key={i} variant={item.type} width="100%" height={item.height} />
          ))}
        </Box>
      </Box>
        :
    <Box display="flex" justifyContent="center">
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          width: 500,
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          mt: 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <h2>{id ? "Edit" : "Add"} Student Form</h2>
        {renderField("Student Name", "name")}
        {renderField("Student Class", "class", "number", true)}
        {renderField("Student GR.No.", "grno", "number", true)}
        {renderField("Student Roll No", "rollno", "number", true)}

        <Box display="flex" gap={2} width="100%">
          <Button type="submit" sx={{ flex: 1 }} variant="contained" color={id ? "warning" : "primary"}>
            {id ? "Edit Data" : "Add Data"}
          </Button>
          <Link to="/" style={{ textDecoration: "none", flex: 1 }}>
            <Button fullWidth variant="contained" color="inherit">Back</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
