// import React, { useState, useMemo, useCallback } from "react";
// import {
//   usePagination,
//   useSortBy,
//   useTable,
//   useFilters,
//   useResizeColumns,
//   useFlexLayout,
// } from "react-table";
// import {
//   TextField,
//   IconButton,
//   Select,
//   MenuItem,
//   Tooltip,
// } from "@mui/material";
// import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
// import { RiPlayReverseFill, RiPlayFill } from "react-icons/ri";
// import FilterListSharpIcon from "@mui/icons-material/FilterListSharp";
// import preview from "../assets/images/Preview.png";
// import comment from "../assets/images/comments1.png";
// import DemandCmt from "../assets/images/DemandCmt.png";
// import logfile from "../assets/images/logfile.png";
// import "./reactTableComponent.css"; // Importing CSS

// const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
//   const handleChangeFilter = (e) => {
//     setFilter(e.target.value || undefined);
//   };

//   const handleStopPropagation = (e) => {
//     e.stopPropagation();
//   };

//   return (
//     <TextField
//       size="small"
//       value={filterValue || ""}
//       onChange={handleChangeFilter}
//       onClick={handleStopPropagation} // Stop propagation to prevent sorting
//       InputProps={{
//         className: "default-filter-input",
//       }}
//     />
//   );
// };

// // Higher-order function to handle row actions
// const handleRowAction = (actionType) => (row) => {
//   switch (actionType) {
//     case "preview":
//       console.log("preview:", row);
//       break;
//     case "comment":
//       console.log("Comment:", row);
//       break;
//     case "demandComment":
//       console.log("Demand Comment:", row);
//       break;
//     case "log":
//       console.log("Log:", row);
//       break;
//     default:
//       break;
//   }
// };

// const ReactTableComponent = ({ tableData, tableColumns, isAction }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Memoize table data and columns for performance optimization
//   const tabledata = useMemo(() => tableData, [tableData]);
//   const tablecolumns = useMemo(() => {
//     const columns = [
//       {
//         Header: "S.No",
//         accessor: (row, i) => i + 1,
//         Filter: DefaultColumnFilter,
//         disableFilters: false,
//         disableSortBy: false,
//         width: 72,
//         maxWidth: 60,
//       },
//       ...tableColumns,
//     ];

//     if (isAction) {
//       const actionColumn = {
//         Header: "Action",
//         accessor: "action",
//         Cell: ({ row }) => (
//           <div className="flex gap-2">
//             {["preview", "comment", "demandComment", "log"].map(
//               (actionType, index) => (
//                 <img
//                   key={index}
//                   src={{ preview, comment, DemandCmt, logfile }[actionType]}
//                   className={`action-icon ${isHovered ? "scale-125" : ""}`}
//                   onClick={handleRowAction(actionType)(row)}
//                   alt={actionType}
//                 />
//               )
//             )}
//           </div>
//         ),
//       };

//       return [...columns, actionColumn];
//     }
//     return columns;
//   }, [tableColumns, isAction, isHovered]);

//   const defaultColumn = useMemo(
//     () => ({
//       Filter: DefaultColumnFilter,
//       minWidth: 72,
//       width: 160,
//       maxWidth: 900,
//     }),
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     nextPage,
//     previousPage,
//     canPreviousPage,
//     canNextPage,
//     state: { pageIndex },
//     pageCount,
//     gotoPage,
//     setPageSize,
//     setAllFilters,
//   } = useTable(
//     {
//       columns: tablecolumns,
//       data: tabledata,
//       defaultColumn,
//       initialState: { pageSize: rowsPerPage },
//     },
//     useFilters,
//     useSortBy,
//     usePagination,
//     useResizeColumns,
//     useFlexLayout
//   );

//   // Callback to handle changing rows per page
//   const handleChangeRowsPerPage = useCallback(
//     (event) => {
//       const newPageSize = Number(event.target.value);
//       setRowsPerPage(newPageSize);
//       setPageSize(newPageSize);
//     },
//     [setPageSize]
//   );

//   // Callback to handle input change for pagination
//   const handleInputChange = useCallback(
//     (event) => {
//       let value = Number(event.target.value);
//       if (value > 0 && value <= pageCount) {
//         gotoPage(value - 1);
//       }
//     },
//     [gotoPage, pageCount]
//   );

//   // Callback to handle input blur for pagination
//   const handleInputBlur = useCallback(
//     (event) => {
//       let value = Number(event.target.value);
//       if (value > 0 && value <= pageCount) {
//         gotoPage(value - 1);
//       }
//     },
//     [gotoPage, pageCount]
//   );

//   // Callback to clear all filters
//   const handleClearFilters = useCallback(
//     (e) => {
//       e.stopPropagation(); // Stop propagation to prevent sorting
//       setAllFilters([]);
//     },
//     [setAllFilters]
//   );

//   // Rendering table

//   const renderTable = () => (
//     <>
//       <table className="table" {...getTableProps()} border={1}>
//         <thead className="table-header">
//           {headerGroups.map((hg) => {
//             const { key, ...headerGroupProps } = hg.getHeaderGroupProps();

//             return (
//               <tr key={key} {...headerGroupProps}>
//                 {hg.headers.map((column, colIndex) => {
//                   const { key, ...rest } = column.getHeaderProps(
//                     column.getSortByToggleProps({ title: undefined })
//                   );

//                   const firstCol = colIndex === 0;
//                   console.log(firstCol);
//                   return (
//                     <th
//                       key={key}
//                       className={`table-header-cell  ${firstCol ? "border-l-0" : ""}`}
//                       {...rest}
//                     >
//                       <div className="header-content">
//                         <span className="header-text">
//                           {column.render("Header")}
//                           {column.isSorted
//                             ? column.isSortedDesc
//                               ? " 🔽"
//                               : " 🔼"
//                             : ""}
//                         </span>
//                         <div>
//                           {column.canFilter ? column.render("Filter") : null}
//                         </div>
//                       </div>
//                       {column.getResizerProps && (
//                         <div
//                           {...column.getResizerProps()}
//                           className="resizer"
//                         />
//                       )}
//                     </th>
//                   );
//                 })}
//                 <th className="clear-filter-cell ">
//                   <Tooltip title="Clear Filters">
//                     <FilterListSharpIcon onClick={handleClearFilters} />
//                   </Tooltip>
//                 </th>
//               </tr>
//             );
//           })}
//         </thead>
//         <tbody {...getTableBodyProps()} className="table-body">
//           {page.map((row) => {
//             prepareRow(row);
//             const { key, ...rest } = row.getRowProps();
//             return (
//               <tr key={key} className="table-row" {...rest}>
//                 {row.cells.map((cell, cellIndex) => {
//                   const { key, ...rest } = cell.getCellProps();
//                   const isLastCell = cellIndex === row.cells.length - 1;
//                   const firstCell = cellIndex === 0;
//                   return (
//                     <td
//                       key={key}
//                       className={`table-cell ${isLastCell ? "border-r-0" : ""} ${firstCell ? "border-l-0" : ""}`}
//                       {...rest}
//                     >
//                       {cell.render("Cell")}
//                     </td>
//                   );
//                 })}

//                 <td className="w-[23px] max-w-[23px] lastrow-cell " />
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </>
//   );

//   // Rendering pagination

//   const renderPagination = () => (
//     <>
//       <div className="pagination-controls">
//         <IconButton onClick={() => gotoPage(0)} disabled={pageIndex === 0}>
//           <IoPlaySkipBack />
//         </IconButton>
//         <IconButton onClick={() => previousPage()} disabled={pageIndex === 0}>
//           <RiPlayReverseFill />
//         </IconButton>
//         <TextField
//           value={pageIndex + 1}
//           onChange={handleInputChange}
//           onBlur={handleInputBlur}
//           type="number"
//           className="pagination-input"
//           inputProps={{
//             min: 1,
//             max: pageCount,
//             className: "pagination-input-inner no-border-radius",
//           }}
//         />
//         <span> / {pageCount}</span>
//         <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
//           <RiPlayFill />
//         </IconButton>
//         <IconButton
//           onClick={() => gotoPage(pageCount - 1)}
//           disabled={!canNextPage}
//         >
//           <IoPlaySkipForward />
//         </IconButton>
//         <Select
//           className="rows-per-page-select"
//           value={rowsPerPage}
//           onChange={handleChangeRowsPerPage}
//         >
//           {[10, 25].map((rows) => (
//             <MenuItem key={rows} value={rows}>
//               {rows}
//             </MenuItem>
//           ))}
//         </Select>
//         <span>items per page</span>
//       </div>
//       <div className="pagination-info">
//         {pageIndex * rowsPerPage + 1} -{" "}
//         {Math.min((pageIndex + 1) * rowsPerPage, tabledata.length)} of{" "}
//         {tabledata.length} items
//       </div>
//     </>
//   );

//   return (
//     <div className="table-container">
//       <div className="overflow-auto">{renderTable()}</div>
//       <div>
//         <span className="total-items">Total Items: {tabledata.length}</span>
//       </div>
//       <div className="pagination">{renderPagination()}</div>
//     </div>
//   );
// };

// export default ReactTableComponent;

// .default-filter-input {
//   height: 25px;
//   font-size: 14px;
//   background-color: white;
//   margin-top: 10px;
//   border-radius: 0;
//   border-right: none;
// }

// .table-container {
//   border: 2px solid #e0e0e0;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   max-height: 600px;
// }

// .table {
//   width: 100%;
//   border-collapse: collapse;
// }

// .table-header {
//   background-color: white;
//   font-size: 16px;
//   font-weight: 600;
//   position: sticky;
//   top: 0;
// }

// .table-header-cell {
//   padding: 5px;
//   text-align: left;
//   background-color: #f3f3f3;
//   font-weight: 500;
//   border: 1px solid #e0e0e0;
//   position: relative;
//   text-overflow: ellipsis;
//   overflow: hidden;
// }

// .header-text {
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

// .header {
//   padding-right: 34px;
// }

// .header-content {
//   display: flex;
//   flex-direction: column;
// }

// .resizer {
//   display: inline-block;
//   width: 15px;
//   height: 100%;
//   position: absolute;
//   right: 0;
//   top: 0;
//   border-color: #e0e0e0;
//   transform: translateX(50%);
//   touch-action: none;
//   background-color: transparent;
// }

// .clear-filter-icon {
//   position: absolute;
//   right: 0;
//   top: 20%;
//   transform: translateY(-50%) !important;
//   height: 45px !important;
//   cursor: pointer;
//   border-top: none;
//   border: 1px solid #e0e0e0;
//   background-color: transparent;
//   padding-top: 8px;
// }

// .table-body {
//   font-size: 16px;
//   font-weight: normal;
//   max-height: 500px;
//   overflow-y: auto;
// }

// .table-row {
//   background-color: white;
// }

// .table-row:nth-of-type(even) {
//   background-color: #f3f3f3;
// }

// .table-cell {
//   padding: 6px;
//   text-align: center;
//   border: 1px solid #e0e0e0;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }

// .total-items {
//   margin-left: 8px;
//   margin-top: 8px;
// }

// .pagination {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   padding-bottom: 10px;
// }

// .pagination-controls {
//   display: flex;
//   align-items: center;
//   flex-wrap: wrap;
// }

// .pagination-input {
//   margin: 0 8px !important;
// }

// .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
//   border-radius: 0 !important;
// }

// .pagination-input-inner {
//   text-align: center;
//   padding: 0 !important;
// }

// .rows-per-page-select {
//   height: 25px;
//   width: 70px;
//   margin-right: 10px;
//   border-radius: 0 !important;
// }

// .pagination-info {
//   margin-right: 8px;
// }

// .action-icon {
//   width: 100%;
//   height: 24px;
//   border-radius: 2px;
//   transition: transform 1s;
// }

// @media (max-width: 768px) {
//   .table-container {
//     max-height: none;
//   }

//   .table-header-cell {
//     font-size: 14px;
//   }

//   .table-cell {
//     font-size: 14px;
//   }

//   .pagination {
//     flex-direction: column;
//     align-items: flex-start;
//   }

//   .pagination-controls {
//     margin-bottom: 10px;
//   }

//   .pagination-input {
//     width: 50px;
//   }
// }
// .clear-filter-cell {
//   text-align: center;

//   background-color: #f3f3f3;
//   font-weight: 500;
//   border: 1px solid #e0e0e0;
//   width: 23px;
//   border-right-width: 0px;
//   max-width: 23px;
// }
// .lastrow-cell {
//   text-align: center;
//   border: 1px solid #e0e0e0;
//   border-left-width: 0px;
//   border-right-width: 0px;
// }

