import React, { useState, useEffect } from "react";
import ConsultantsTable from "./ConsultantsTable ";
import UsingDataGrid from "./usingDataGrid";

function App() {
  const [consultants, setConsultants] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    mobile: "",
    email: "",
    division: "",
    district: "",
    ulb: "",
  });

  useEffect(() => {
    fetch("/consultantsData.json")
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((item) => ({
          name: item.ConsultantName,
          type: item.ConsultantTypeName,
          mobile: item.MobileNo,
          email: item.EmailAddress,
          division: item.DivisionName,
          district: item.DistrictName,
          ulb: item.UlbName,
        }));
        setConsultants(processedData);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const handleClearFilters = () => {
    setFilters({
      name: "",
      type: "",
      mobile: "",
      email: "",
      division: "",
      district: "",
      ulb: "",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-200 ">
      <div className="p-4 w-[80%] rounded  bg-white m-3 ">
        <div className="flex  justify-between">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4">
            List of Consultants
          </h1>
          <button
            className=" mb-2 px-2 py-2 bg-indigo-600 text-white hover:bg-gray-300 rounded"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
        <UsingDataGrid
          consultants={consultants}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
}

export default App;
