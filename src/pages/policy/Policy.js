import { Col, Row } from "antd";
import Axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import config from "../../config";
import { logout, getToken } from "../../session";
import SimpleTable from "../../components/Table/SimpleTable";

import { SuccessAlert, WarningAlert } from "../../components/Alert/Alert";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";

function Policy(){

  const [pending, setPending] = useState(true);
  const [user, setUser] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [success, setSuccess] = useState({
    message: "",
    has: false,
  });
  const [error, setError] = useState({
    message: "",
    has: false,
  });
  

  const history = useHistory();

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get(config.url + "/policy/all", {
        headers: {
          "Content-Type": "application/json",
          "x-token": getToken(),
        },
      });
  
      if (response.status === 200) {
        const updatedUser = response.data.map((item) => {
          return {
            ...item,
            vehicle_image: <img src={"/policy/files/1686813377737-site_logo.png"} alt="Vehicle" />,
            //cr_image: <img src={item.cr_image} alt="CR" />,
            // previous_insurance_card_image: (
            //   <img src={item.previous_insurance_card_image} alt="Insurance Card" />
            // ),
          };
        });
  
        setUser(updatedUser);
      } else {
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        console.log(error);
        setError({ message: error.message, has: true });
      }
    } finally {
      setisLoading(false);
    }
  };
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "vehicle_type",
        header: "Vehicle Type",
        Cell: ({ renderedCellValue }) => (
          <>{renderedCellValue === 1 ? "Full" : "Third_party"}</>
        ),
        editVariant: "select",
        editSelectOptions: [
          {
            value: "1",
            text: "Third Party",
          },
          {
            value: "0",
            text: "Full",
          },
        ],
      },
      {
        accessorKey: "customer_fullname",
        header: "Customer Fullname",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "customer_address",
        header: "Address",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "customer_nic",
        header: "NIC",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "customer_phone",
        header: "Phone",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "vehicle_reg_no",
        header: "Vehicle Reg.No",
        enableEditing: false,
        enableColumnActions: true,
      },
      {
        accessorKey: "engine_no",
        header: "Engine No",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "chassis_no",
        header: "Chassis No",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "model",
        header: "Model",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "years_of_make",
        header: "Make Year",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "leasing_company",
        header: "Leasing Company",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "vehicle_color",
        header: "Vehicle Color",
        enableEditing: false,
        enableColumnActions: true,
      },
      {
        accessorKey: "horse_power",
        header: "Horse Power",
        enableEditing: false,
        enableColumnActions: true,
      },
      {
        accessorKey: "value_of_vehicle",
        header: "Value",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "use_perpose",
        header: "Use Purpose",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "cr_image",
        header: "CR Image",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "vehicle_image",
        header: "Vehicle Image",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "previous_insurance_card_image",
        header: "Previous Insurance Card Image",
        export: true,
        enableColumnActions: true,
      },
      {
        accessorKey: "policy_price",
        header: "Policy Price",
        enableEditing: false,
        enableColumnActions: true,
      },
      {
        accessorKey: "policy_type",
        header: "Policy Type",
        Cell: ({ renderedCellValue }) => (
          <>{renderedCellValue === 1 ? "Full" : "Third_party"}</>
        ),
        editVariant: "select",
        editSelectOptions: [
          {
            value: "1",
            text: "Third Party",
          },
          {
            value: "0",
            text: "Full",
          },
        ],
      },
      {
        accessorKey: "policy_status",
        header: "Policy Status",
        Cell: ({ renderedCellValue }) => (
          <>{renderedCellValue === 1 ? "Active" : "Deactive"}</>
        ),
        editVariant: "select",
        editSelectOptions: [
          {
            value: "1",
            text: "Active",
          },
          {
            value: "0",
            text: "Deactive",
          },
        ],
      },
      {
        accessorKey: "policy_start_date",
        header: "Policy Start Date",
        enableEditing: false,
        enableColumnActions: true,
      },
  
    ],
    []
  );

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            {success.has === true ? (
              <SuccessAlert message={success.message} />
            ) : (
              <></>
            )}
            {error.has === true ? (
              <WarningAlert message={error.message} />
            ) : (
              <></>
            )}
            <SimpleTable
              tableHeading="Policy List"
              columns={columns}
              getData={user}
              isLoading={isLoading}
              //handleSaveRow={handleSaveRow}
              //deletedata={deletedata}
              idName="policy_id"
              enableClickToCopy
              enableRowNumbers={false}
              enableRowVirtualization={false}
              //isModalOpen={isModalOpen}
              //setIsModalOpen={setIsModalOpen}
              //showAddButton={false}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Policy;
