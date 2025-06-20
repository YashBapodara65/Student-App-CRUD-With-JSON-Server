import React, { useEffect, useState } from "react";
import TableLayout from "../components/TableLayout";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DialogBox from "../components/Dialog";
import Counter from "../components/Counter";
import appTitle from "../services/studentAppTitle";
import api from "../services/apiStorageService";
import {v4} from "uuid"

const Home = () => {
  const [studentData, setStudentData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [totalCount, setTotalCount] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [loading, setLoading] = useState(true);

  appTitle("Dashboard Page");

  // used for navigate route
  const navigate = useNavigate();

  const totalRows = [
    { name: "No.", col: 1 },
    {
      name: "Name",
      col: 1,
      type: "string",
      order: "asc",
      originalName: "name",
    },
    {
      name: "Class",
      col: 1,
      type: "number",
      order: "asc",
      originalName: "class",
    },
    {
      name: "GR No.",
      col: 1,
      type: "number",
      order: "asc",
      originalName: "grno",
    },
    {
      name: "Roll No.",
      col: 1,
      type: "number",
      order: "asc",
      originalName: "rollno",
    },
    { name: "Actions", col: 3 },
  ];

  const tableData = [
    { name: "name" },
    { name: "class" },
    { name: "grno" },
    { name: "rollno" },
  ];

  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    setDeleteId(id);
  };

  useEffect(() => {
    let classes = studentData.map((item) => Number(item.class));
    classes = [...new Set(classes)];
    setFilterValue(classes);
  }, [studentData]);

  // used for delete single student record
  const handleDelete = async (id) => {
    try {
      await api.deleteData(id); // wait for deletion to complete

      const filterData = studentData.filter((e) => e.id !== id);
      setStudentData(filterData);
      toast.success("Student record has been successfully deleted.");
    } catch (err) {
      toast.error("Failed to delete student record.",err);
    }
  };  

  // used for duplicate or copy of single student record
  const handleDuplicate = async (data) => {
    const newItem = { ...data, id: v4() };
  
    try {
      await api.postData(newItem); // await to ensure the API call completes
      const updated = [...studentData, newItem];
      setStudentData(updated);
      toast.success("Student record duplicated successfully!");
    } catch (err) {
      console.error("Duplicate failed:", err);
      toast.error("Failed to duplicate student record.");
    }
  };  

  // used for modify or edit of single student record
  const handleEdit = (id) => {
    console.log(id);
    navigate(`/edit-student-form/${id}`);
  };

  const tableActions = [
    {
      name: "duplicate",
      icon: ContentCopyIcon,
      action: (data) => handleDuplicate(data),
    },
    { name: "edit", icon: EditIcon, action: (data) => handleEdit(data.id) },
    {
      name: "delete",
      icon: DeleteIcon,
      action: (data) => handleOpenDialog(data.id),
    },
  ];

  useEffect(() => {  
    setTimeout(()=>{
      fetchData();
      setLoading(false);
    },500) // Simulate API delay
  }, []);

  const fetchData = async () => {
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
  };
  
  

  useEffect(() => {
    counterCall();
  }, [studentData]);

  const counterCall = () => {
    setTotalCount([
      {
        name: "Students",
        length : studentData.length
      },
    ]);
  };

  return (
    <>
      <Counter counters={totalCount} loading={loading} records={studentData} />
      <TableLayout
        loading={loading}
        records={studentData}
        tableActions={tableActions}
        rows={totalRows}
        tableData={tableData}
        filterValue={filterValue}
        filterByValue={"class"}
      />
      <DialogBox
        open={openDialog}
        close={() => setOpenDialog(false)}
        onDelete={() => handleDelete(deleteId)}
      />
    </>
  );
};

export default Home;
