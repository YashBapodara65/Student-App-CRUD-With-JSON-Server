import React, { useEffect, useState } from "react";
import {
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
  TablePagination,
  Skeleton,
  Stack,
  Box,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import SkeletonStructure from "./SkeletonStructure";

const skeleton_data = [
  { type: "rounded", width: 250, height: 50 },
  { type: "rounded", width: 250, height: 50 },
];

const TableLayout = ({
  records,
  rows,
  tableData,
  tableActions,
  filterValue,
  loading,
}) => {
  const [studentData, setStudentData] = useState([]);
  const [updateStudentData, setUpdateStudentData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [updateRows, setUpdateRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // pagination logic
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // get records with dynamic
  useEffect(() => {
    setIsLoading(true)
    if (records) {
      setTimeout(()=>{
        setIsLoading(false);
      },200);
      setStudentData(records);
    } else {
      setIsLoading(false);
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
  }, [searchData, selectedOption, studentData]);

  // Applying for clear filter
  const handleClearFilter = () => {
    setSearchData("");
    setSelectedOption("all");
    setUpdateRows(rows);
  };

  const handleFilterChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const currentItems = updateStudentData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "90%",
              }}
            >
              <Stack direction="row" spacing={5}>
                {skeleton_data.map((item, index) => (
                  <Skeleton
                    key={index}
                    variant={item.type}
                    width={item.width}
                    height={item.height}
                  />
                ))}
              </Stack>
            </Box>
          </div>
          <TableContainer
            component={Paper}
            style={{ width: "90%", margin: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {rows.map((col, index) => (
                    <TableCell key={index} align="center">
                      <Skeleton variant="text" width={100} height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {rows.map((col, colIdx) => (
                      <TableCell key={colIdx} align="center">
                        <Skeleton variant="rectangular" height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
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
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <TextField
                id="outlined-search"
                onChange={(e) => setSearchData(e.target.value)}
                value={searchData}
                label="Search field"
                type="search"
                style={{ width: "250px" }}
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
              {searchData != "" ||
              selectedOption != "all" ||
              updateRows
                .filter((e) => e.order)
                .map((e) => e.order)
                .includes("desc") ? (
                <Button
                  onClick={handleClearFilter}
                  variant="contained"
                  style={{ height: "50px", width: "200px" }}
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
                <Button variant="contained" style={{ height: "50px" }}>
                  Add Student
                </Button>
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
                        fieldItem.order !== undefined &&
                        handleSorting(fieldItem)
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
                {isLoading ? (
                  // While loading
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      style={{ padding: "20px 0", fontSize: "1.2rem" }}
                    >
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) :isLoading == false && records.length > 0 ? (
                  // Data available
                  currentItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" align="center" scope="row">
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      {tableData.map((col, idx) => (
                        <TableCell key={idx} align="center">
                          {item[col.name]}
                        </TableCell>
                      ))}

                      {tableActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <TableCell key={idx} align="center">
                            <Tooltip title={action.name}>
                              <IconButton onClick={() => action.action(item)}>
                                <Icon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  // After loading, but no filtered data
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      style={{ padding: "20px 0", fontSize: "1.2rem" }}
                    >
                      No available data
                    </TableCell>
                  </TableRow>
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
      )}
    </>
  );
};

export default TableLayout;
