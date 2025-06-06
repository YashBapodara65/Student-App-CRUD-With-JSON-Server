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
  MenuItem,
  Button,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";

const TableLayout = ({
  records,
  rows,
  tableData,
  tableActions,
  filterValue,
}) => {
  const [studentData, setStudentData] = useState([]);
  const [updateStudentData, setUpdateStudentData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [updateRows, setUpdateRows] = useState([]);

  // get records with dynamic
  useEffect(() => {
    if (records) {
      setStudentData(records);
    }
  }, [records]);

  // get Total Rows
  useEffect(() => {
    setUpdateRows(rows);
  }, [rows]);

  

  const handleSorting = (itemData) => {
    const newOrder = itemData.order == "asc" ? "desc" : "asc";
  
    // Update order only for clicked column, reset others
    const updatedRows = updateRows.map((row) =>
      row.originalName === itemData.originalName
        ? { ...row, order: newOrder }
        : row
    );
  
    const key = itemData.originalName;
    let sortedData = [...studentData];
  
    sortedData.sort((a, b) => {
      if (itemData.type === "string") {
        return newOrder === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else {
        return newOrder === "asc"
          ? Number(a[key]) - Number(b[key])
          : Number(b[key]) - Number(a[key]);
      }
    });
  
    console.log(newOrder);
    setStudentData(sortedData);
    setUpdateRows(updatedRows);
  };
  

  // call when searchData and studentData is updated
  useEffect(() => {
    let filtered = studentData;

    // Apply filter by class
    if (selectedOption !== "all") {
      filtered = filtered.filter((item) => item.class == selectedOption);
    }

    // Apply search filter
    if (searchData) {
      const search = searchData.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.class.toLowerCase().includes(search) ||
          item.grno.toLowerCase().includes(search) ||
          item.rollno.toLowerCase().includes(search)
      );
    }

    setUpdateStudentData(filtered);
    setCurrentPage(1);
  }, [searchData, selectedOption, studentData]);

  // Applying for clear filter
  const handleClearFilter = () => {
    setSearchData("");
    setSelectedOption("all");
    // setUpdateRows(rows);
  };

  const handleFilterChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = updateStudentData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(updateStudentData.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
            flexWrap : "wrap",
            gap:"20px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "20px",
              flexWrap:"wrap"
            }}
          >
            <TextField
              id="outlined-search"
              onChange={(e) => setSearchData(e.target.value)}
              value={searchData}
              label="Search field"
              type="search"
              style={{width:"250px"}}
            />
            <TextField
              id="outlined-select-currency"
              select
              label=""
              defaultValue="EUR"
              onChange={handleFilterChange}
              value={selectedOption}
              style={{ width: "200px" }}
            >
              <MenuItem value={"all"}>All</MenuItem>
              {filterValue.map((element, index) => {
                return (
                  <MenuItem key={index} value={element}>
                    {element}
                  </MenuItem>
                );
              })}
            </TextField>
            {searchData != "" || selectedOption != "all" || updateRows.filter((e)=> e.order).map((e)=> e.order).includes("desc") ? (
              <Button
                onClick={handleClearFilter}
                variant="contained"
                style={{ height: "50px", width:"200px" }}
              >
                Clear All
                <FilterAltOffIcon />
              </Button>
            ) : (
              ""
            )}
          </div>
          {updateStudentData?.length == 0 ? (
            <Link to={"/form"}>
              <Button variant="contained" style={{height:"50px"}}>Add Student</Button>
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
                {updateRows?.map((fieldItem, index) => (
                  <TableCell
                    colSpan={fieldItem.col}
                    key={index}
                    align="center"
                    onClick={() =>
                      fieldItem.order !== undefined && handleSorting(fieldItem)
                    }
                    style={{
                      cursor:
                        fieldItem.order !== undefined ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {fieldItem.name}
                      {fieldItem.order === "asc" && <NorthIcon />}
                      {fieldItem.order === "desc" && <SouthIcon />}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems?.length > 0 ? (
                currentItems?.map((item, index) => {
                  return (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" align="center" scope="row">
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      {tableData.map((col, idx) => {
                        return (
                          <TableCell key={idx} align="center">
                            {item[col.name]}
                          </TableCell>
                        );
                      })}
                      {tableActions.map((action, idx) => {
                        let Icon = action.icon;
                        return (
                          <TableCell key={idx} align="center">
                            <Tooltip title={action.name}>
                              <IconButton>
                                <Icon onClick={() => action.action(item)} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      })}
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
        <Stack spacing={2} style={{ marginTop: "30px" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </>
  );
};

export default TableLayout;
