import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../pages/Form";
import api from "../services/apiStorageService";

const EditForm = () => {
  const [studentData, setStudentData] = useState({
    id: "",
    name: "",
    class: "",
    grno: "",
    rollno: "",
  });

  // get id value from the URL
  let { id } = useParams();
  // used for navigate route
  let navigate = useNavigate();

  // only once time call
  useEffect(() => {
    if (!id) {
      navigate("/");
    } else {
      const fetchData = async () => {
        try
        {
          let savedData = await api.getData();
          if(savedData.length > 0)
          {
            let res = savedData.filter((item) => item.id == id);
            if(res.length > 0)
            {
              setStudentData(res[0])
            }
            else
            {
              navigate("/");
            }
          }
        }
        catch(err)
        {
          console.error("Failed to get data",err);
        }
      }
      fetchData();
    }
  }, []);

  return (
    <>
      <Form editData={studentData} />
    </>
  );
};

export default EditForm;
