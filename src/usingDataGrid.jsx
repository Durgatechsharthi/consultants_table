import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./ResizableTable.css";

const ConsultantsTable = ({ consultants, filters, setFilters }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [inputPage, setInputPage] = useState(1);

  const columns = [
    "name",
    "type",
    "mobile",
    "email",
    "division",
    "district",
    "ulb",
  ];

  const [columnWidths, setColumnWidths] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col]: 150 }), {})
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setInputPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setInputPage(1);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      ...filters,
      name: "",
      type: "",
      mobile: "",
      email: "",
      division: "",
      district: "",
      ulb: "",
    });
  };

  const sortedData = [...consultants].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const filteredData = sortedData.filter((row) =>
    columns.every((column) => {
      const filterValue = filters[column].toLowerCase();
      const cellValue = row[column]?.toString().toLowerCase() || "";
      return filterValue === "" || cellValue.includes(filterValue);
    })
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (
      value &&
      Number(value) <= Math.ceil(filteredData.length / rowsPerPage) &&
      Number(value) >= 1
    ) {
      setPage(Number(value) - 1);
      setInputPage(Number(value));
    } else if (!value) {
      setInputPage("");
    }
  };

  const handleInputBlur = () => {
    if (!inputPage) {
      setInputPage(page + 1);
    }
  };

  const renderPagination = () => (
    <>
      <div className="d-flex flex-col items-center justify-center">
        <div className="pl-2 mb-1">
          Total Items: {filteredData.length} (Showing Items: {rowsPerPage})
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={(event) => handleChangePage(event, 0)}
            disabled={page === 0}
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={(event) => handleChangePage(event, page - 1)}
            disabled={page === 0}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <TextField
            value={inputPage}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            type="number"
            sx={{ margin: "0 8px" }}
            inputProps={{
              min: 1,
              max: Math.ceil(filteredData.length / rowsPerPage),
              style: { textAlign: "center", padding: "0px" },
            }}
          />
          <span> / {Math.ceil(filteredData.length / rowsPerPage)}</span>
          <IconButton
            onClick={(event) => handleChangePage(event, page + 1)}
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
          >
            <NavigateNextIcon />
          </IconButton>
          <IconButton
            onClick={(event) =>
              handleChangePage(
                event,
                Math.max(0, Math.ceil(filteredData.length / rowsPerPage) - 1)
              )
            }
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
          >
            <LastPageIcon />
          </IconButton>
          <Select
            sx={{
              height: "25px",
              width: "70px",
              marginRight: "10px",
            }}
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            style={{ marginLeft: "8px" }}
          >
            {[10, 25].map((rows) => (
              <MenuItem key={rows} value={rows}>
                {rows}
              </MenuItem>
            ))}
          </Select>
          <span>items per page</span>
        </div>
      </div>
      <div>
        {page * rowsPerPage + 1} -{" "}
        {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
        {filteredData.length} items
      </div>
    </>
  );

  const handleResize = (column, newWidth) => {
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [column]: newWidth,
    }));
  };

  const ResizableHandle = ({ column }) => {
    const startX = useRef(0);
    const startWidth = useRef(0);
    const resizerRef = useRef(null);

    const onMouseDown = (e) => {
      startX.current = e.clientX;
      startWidth.current = columnWidths[column];
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      const newWidth = startWidth.current + e.clientX - startX.current;
      if (newWidth > 50) {
        handleResize(column, newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    useEffect(() => {
      const resizer = resizerRef.current;
      resizer.addEventListener("mousedown", onMouseDown);
      return () => {
        resizer.removeEventListener("mousedown", onMouseDown);
      };
    }, []);

    return (
      <div
        ref={resizerRef}
        className="resizable-handle"
        style={{
          height: "100%",
          width: "5px",
          cursor: "col-resize",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
        }}
      />
    );
  };

  return (
    <div className="rounded-m">
      <TableContainer
        component={Paper}
        sx={{ marginBottom: "16px", maxHeight: "500px", overflowY: "auto" }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="bg-[#f5f5f5]">
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    fontWeight: "bold",
                    padding: "8px",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #e0e0e0",
                    position: "relative",
                    width: columnWidths[column],
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    InputProps={{
                      style: {
                        height: "25px",
                        fontSize: "12px",
                        backgroundColor: "white",
                      },
                    }}
                    name={column}
                    value={filters[column]}
                    onChange={handleFilterChange}
                    className="mt-2"
                  />
                  <ResizableHandle column={column} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 1 ? "bg-[#f5f5f5]" : ""}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      sx={{ borderRight: "1px solid #e0e0e0", padding: "8px" }}
                    >
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-between mt-4 mb-3">{renderPagination()}</div>
    </div>
  );
};

export default ConsultantsTable;
