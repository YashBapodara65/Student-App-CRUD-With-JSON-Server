import React, { useEffect, useState } from "react";
import {
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TextField,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TablePagination from "@mui/material/TablePagination";
import localStorageService from "../services/localStorageService";

const PaginationFormat = ({ records, rows, tableData }) => {
  const [studentData, setStudentData] = useState([]);
  const [updateStudentData, setUpdateStudentData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [totalRecords, setTotalRecords] = useState(null);

  useEffect(() => {
    if (records) {
      setStudentData(records);
    }
  }, [records]);

  // call when searchData and studentData is updated
  useEffect(() => {
    const filterData = studentData.filter((item) => {
      const search = searchData.toLowerCase();
      return (
        item.name.toLowerCase().includes(search) ||
        item.class.toLowerCase().includes(search) ||
        item.grno.toLowerCase().includes(search) ||
        item.rollno.toLowerCase().includes(search)
      );
    });

    setTotalRecords(studentData.length);
    setUpdateStudentData(filterData);
  }, [searchData, studentData]);

  // used for navigate route
  const navigate = useNavigate();

  // used for delete single student record
  const handleDelete = (id) => {
    const filterData = studentData.filter((e) => e.id !== id);
    localStorageService.setItem("studentData", filterData);
    setStudentData(filterData);
    toast.success("Student record has been successfully deleted.");
  };

  // used for duplicate or copy of single student record
  const handleDuplicate = (data) => {
    const newItem = { ...data, id: Date.now() };
    const updated = [...studentData, newItem];
    setStudentData(updated);
    console.log(updated);
    localStorageService.setItem("studentData", updated);
    toast.success("Student record duplicated successfully.!");
  };

  // used for modify or edit of single student record
  const handleEdit = (id) => {
    navigate(`/edit-student-form/${id}`);
  };

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedData =
  rowsPerPage > 0
    ? updateStudentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : updateStudentData;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
          alignItems: "center",
          flexDirection: "column",
          padding: "10px 20px",
        }}
      >
        <div
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <TextField
              id="outlined-search"
              onChange={(e) => setSearchData(e.target.value)}
              value={searchData}
              label="Search field"
              type="search"
            />
            <div>
              <h2 style={{ color: "blue", fontFamily: "sans-serif" }}>
                Total Students : {totalRecords}
              </h2>
            </div>
          </div>
          {updateStudentData.length == 0 ? (
            <Link to={"/form"}>
              <Button variant="contained">Add Student</Button>
            </Link>
          ) : (
            ""
          )}
        </div>
        <TableContainer
          component={Paper}
          style={{ marginTop: "50px", width: "90%" }}
        >
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {rows.map((fieldItem, index) => {
                  return (
                    <TableCell
                      colSpan={fieldItem.col}
                      key={index}
                      align="center"
                    >
                      {fieldItem.name}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  return (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" align="center" scope="row">
                        {index + 1}
                      </TableCell>
                      {tableData.map((col, idx) => {
                        return (
                          <TableCell key={idx} align="center">
                            {item[col.name]}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        <Tooltip title="Duplicate">
                          <IconButton>
                            <ContentCopyIcon
                              onClick={() => handleDuplicate(item)}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton>
                            <EditIcon
                              onClick={() => {
                                handleEdit(item.id);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton>
                            <DeleteIcon onClick={() => handleDelete(item.id)} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      fontSize: "1.2rem",
                      padding: "20px 0px",
                    }}
                  >
                    No available data
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={updateStudentData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default PaginationFormat;
