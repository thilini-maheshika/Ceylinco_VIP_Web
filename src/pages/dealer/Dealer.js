import { Col, Row } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import config from '../../config';
import { logout, getToken } from "../../session";
import SimpleTable from '../../components/Table/SimpleTable';
import { MenuItem } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Dealers = () => {
  const [dealerList, setdealerList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [dealerResponse, companyResponse] =
        await Promise.all([
          Axios.get(config.url + '/dealer/dash/all', { headers: { 'x-token': getToken() } }),
          Axios.get(config.url + '/company/all', { headers: { 'x-token': getToken() } }),
        ]);

      if (dealerResponse.status === 200) {
        setdealerList(dealerResponse.data);
      }

      if (companyResponse.status === 200) {
        setCompanyList(companyResponse.data);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setisLoading(false);
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        toast.warn(error.response.data.error || 'An error occurred', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };


  const columns = useMemo(() => [
    {
      accessorKey: 'dealer_id',
      header: '#',
      export: true,
      enableColumnActions: true,
      enableEditing: true,
      minSize: 90,
      maxSize: 360,
      size: 150,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 12,
        validationType: "requiredField"
      },
    },
    {
      accessorKey: 'dealer_fullname',
      header: 'Full Name',
      export: true,
      enableColumnActions: true,
      enableEditing: true,
      minSize: 90,
      maxSize: 360,
      size: 150,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 12,
        validationType: "requiredField"
      },
    },
    {
      accessorKey: 'dealer_address',
      header: 'Address',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 160,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 12,
        validationType: "requiredField"
      },
    },
    {
      accessorKey: 'dealer_nic',
      header: 'NIC',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 160,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 12,
        validationType: "requiredField"
      },
    },
    {
      accessorKey: 'dealer_email',
      header: 'Email',
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 150,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 12,
        validationType: "email"
      },
    },
    {
      accessorKey: 'dealer_phone',
      header: 'Mobile',
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 50,
      maxSize: 50,
      size: 50,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 6,
        validationType: "mobile"
      },
    },
    {
      accessorKey: 'dealer_whatsapp_number',
      header: 'Whatsapp Number',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 50,
      maxSize: 50,
      size: 50,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 6,
        validationType: "mobile"
      },
    },
    {
      accessorKey: 'company_id',
      header: 'Company',
      export: false,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 180,
      Cell: ({ renderedCellValue }) => {
        const CompanyName = companyList.find(company => company.company_id === renderedCellValue)?.company_name;
        return <>{CompanyName ? CompanyName : "Unknown"}</>;
      },
      editVariant: 'select',
      formFeild: {
        isFormFeild: true,
        type: "select",
        xs: 6,
        validationType: "requiredField"
      },
      editSelectOptions: companyList.map((company) => ({ value: company.company_id, text: company.company_name })),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ renderedCellValue }) => <>{renderedCellValue === 1 ? "Active" : "Deactive"}</>,
      editVariant: 'select',
      minSize: 90,
      maxSize: 360,
      size: 100,
      editSelectOptions: [{
        value: '1',
        text: 'Active'
      }, {
        value: '0',
        text: 'Deactive'
      }],
      formFeild: {
        isFormFeild: false,
      },
    },
    {
      accessorKey: 'reg_date',
      header: 'Register Date',
      editVariant: 'select',
      enableEditing:false,
      minSize: 90,
      maxSize: 360,
      size: 100,
      editSelectOptions: [{
        value: '1',
        text: 'Active'
      }, {
        value: '0',
        text: 'Deactive'
      }],
      formFeild: {
        isFormFeild: false,
      },
    },
  ], [companyList]);

  const handleSubmit = async (formData) => {
    const { data } = formData; // Extract the form data
    if (data.newPassword !== data.confirmPassword) {
      toast.warn("Passwords Do Not Match!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    } else {

      const dealerData = {
        fullname: data.fullname,
        phonenumber: data.phonenumber,
        address: data.address,
        email: data.email,
        username: data.username,
        password: data.newPassword,
        userrole: data.userrole,
      };
      try {
        // Call the addData function with the extracted data
        await addData(dealerData);
        // Additional logic after successful post
      } catch (error) {
        toast.warn(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };


  const addData = async (values) => {
    try {
      setisLoading(true);
      const response = await Axios.post(config.url + '/dealer/create/', values, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setisLoading(false);
        fetchData();
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (response.status === 401) {
        logout();
      } else {
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        toast.warn(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setisLoading(false);
    }
  };


  //Update
  const handleSaveRow = async ({ exitEditingMode, rowDataID, values }) => {
    try {
      await updateData(rowDataID, values); // Pass the supplier_id from the row and the updated values
      exitEditingMode(); // Exit editing mode after successful update
    } catch (error) {
      toast.warn(error.response.data.error, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };


  const updateData = async (dealer_id, values) => {
    console.log(values)
    try {
      setisLoading(true);

      const response = await Axios.put(config.url + '/dealer/dash/update/' + dealer_id, values, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setisLoading(false);
        fetchData();
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (response.status === 401) {
        logout();
      } else {
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        toast.warn(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setisLoading(false);
    }
  };

  const deletedata = async (dataArray) => {
    if (dataArray.length > 0) {
      try {
        setisLoading(true);

        const idArray = dataArray.map(data => data.id);

        const data = {
          dealer_ids: idArray
        };

        const response = await Axios.put(
          config.url + '/dealer/dash/deletes',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-token': getToken()
            }
          }
        );

        if (response.status === 200) {
          setisLoading(false);
          fetchData();
          toast.success('Delete Success!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (response.status === 401) {
          logout();
        } else {
          fetchData();
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.reload();
          logout();
        } else {
          toast.warn(error.response.data.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } finally {
        setisLoading(false);
      }
    } else {
      toast.warn("Data Not Found.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };



  return (
    <>
      <div className="tabled">
        <Row gutter={[22, 0]}>
          <Col xs={24} xl={24}>
            <SimpleTable
              tableHeading="Dealers"
              columns={columns}
              dataSet={dealerList}
              isLoading={isLoading}
              idName="dealer_id"
              enableEdit={true}
              enableRowSelection={true}
              handleSaveRow={handleSaveRow}
              // handlePrint={handlePrint}
              deletedata={deletedata}
              enableClickToCopy
              enableRowNumbers={false}
              enableRowVirtualization
              addButtonHeading="Add Dealer"
              enableAddButton={false}
              handleSubmit={handleSubmit}
              renderRowActionMenuItems={({ row, closeMenu }) => (
                [
                  <MenuItem key={1} onClick={() => {
                    history.push(`/bank-details/${row.id}`);
                    closeMenu();
                  }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PreviewIcon /> View Bank Details
                  </MenuItem>,
                ]
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Dealers