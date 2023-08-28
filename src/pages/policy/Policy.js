import { Col, Row } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import config from '../../config';
import { logout, getToken } from "../../session";
import SimpleTable from '../../components/Table/SimpleTable';
import { MenuItem } from "@mui/material";
import { Delete } from "@material-ui/icons";
import PaidIcon from '@mui/icons-material/Paid';
import AddFormModal from "../../components/Modal/AddFormModal";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PreviewIcon from '@mui/icons-material/Preview';

import DialogBox from '../../components/Alert/Confirm'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const Policy = () => {
  const [policyList, setPolicyList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [policy, setPolicy] = useState(0);
  const fileInputRef = useRef();

  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [policyid, setPolicyid] = useState(0);

  const [paymentFormData, setPaymentFormData] = useState({
    data: {},
    errors: {},
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [policyResponse, companyResponse] =
        await Promise.all([
          Axios.get(config.url + '/policy/dash/all', { headers: { 'x-token': getToken() } }),
        ]);

      if (policyResponse.status === 200) {
        setPolicyList(policyResponse.data);
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

  const handleOpen = (id) => {
    setIsOpen(true);
    setPolicy(id)
  };

  const paymentFormSubmit = (event) => {
    // event.preventDefault();
    handlePaymentSubmit(event);
    console.log(event.data.qutation)
    handleClose();
  };


  const handleClose = () => {
    setIsOpen(false);
    setPolicy(0)
    setPaymentFormData({
      data: {},
      errors: {},
    });
  };

  const handleConfirmClose = () => {
    setOpen(false);
    setPolicyid(0)
  };

  const handleConfirmOpen = (id) => {
    setOpen(true);
    setPolicyid(id)
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
      accessorKey: 'customer_fullname',
      header: 'Customer FullName',
      export: true,
      enableColumnActions: true,
      enableEditing: true,
      minSize: 90,
      maxSize: 360,
      size: 150,
    },
    {
      accessorKey: 'customer_address',
      header: 'Customer Address',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 160,
    },
    {
      accessorKey: 'customer_nic',
      header: 'Customer NIC',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 160,
    },
    {
      accessorKey: 'vehicle_type',
      header: 'Vehicle',
      Cell: ({ renderedCellValue }) => {
        if (renderedCellValue === 1) {
          return <>Car</>;
        } else if (renderedCellValue === 2) {
          return <>Van</>;
        } else if (renderedCellValue === 3) {
          return <>Bus</>;
        } else if (renderedCellValue === 4) {
          return <>Truck</>;
        } else if (renderedCellValue === 5) {
          return <>Mortor Cycle</>;
        } else if (renderedCellValue === 6) {
          return <>Three Weel</>;
        } else if (renderedCellValue === 7) {
          return <>Tractor</>;
        } else {
          return <>Other</>;
        }
      },
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 150,
    },
    {
      accessorKey: 'vehicle_reg_no',
      header: 'Vehicle Number',
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 50,
      maxSize: 50,
      size: 50,
    },

    {
      accessorKey: 'policy_price',
      header: 'Policy Amount',
      Cell: ({ renderedCellValue }) => {
        if (renderedCellValue === 0 || renderedCellValue === null || renderedCellValue === "") {
          return <>Pending</>;
        } else {
          return <>{renderedCellValue}</>;
        }
      },
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 50,
      maxSize: 50,
      size: 50,
      formFeild: {
        isFormFeild: false,
        type: "TextField",
        xs: 6,
        validationType: "mobile"
      },
    },
    {
      accessorKey: 'policy_status',
      header: 'Status',
      Cell: ({ renderedCellValue }) => <>{renderedCellValue === 1 ? "Active" : "Deactive"}</>,
      editVariant: 'select',
      minSize: 90,
      maxSize: 360,
      size: 100,
      enableEditing: false,
      editSelectOptions: [{
        value: '1',
        text: 'Completed'
      }, {
        value: '0',
        text: 'Pending'
      }],
      formFeild: {
        isFormFeild: false,
      },
    },
    {
      accessorKey: 'policy_start_date',
      header: 'Register Date',
      editVariant: 'select',
      enableEditing: false,
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

  const policyFormColumns = useMemo(() => [
    {
      accessorKey: 'policy_price',
      header: 'Total Price',
      formFeild: {
        isFormFeild: true,
        type: "number",
        xs: 12,
        validationType: "requiredField"
      },
    },
    {
      accessorKey: 'commition_amount',
      header: 'Commision Amout',
      formFeild: {
        isFormFeild: true,
        type: "number",
        xs: 12,
        validationType: "requiredField"
      },
    },
    {
      accessorKey: 'qutation',
      header: 'Qutation',
      formFeild: {
        isFormFeild: true,
        type: "file",
        validationType: "requiredField",
        xs: 12,
      },
    },
  ], []);

  const handlePaymentSubmit = async (event) => {
    const { data } = event;

    const policyData = {
      policy_id: policy,
      policy_price: data.policy_price,
      commition_amount: data.commition_amount,
    };

    try {
      setisLoading(true);

      const formData = new FormData();
      formData.append('qutation', event.data.qutation); // Assuming 'image' is the field name for the image

      for (const key in policyData) {
        formData.append(key, policyData[key]);
      }

      const response = await Axios.post(config.url + '/policy/createpayment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-token': getToken(),
        },
      });

      if (response.status === 200) {
        fetchData();
        setisLoading(false);
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
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
        toast.warn(error.response ? error.response.data.error : "An error occurred.", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
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


  const handleDelete = async () => {
    try {
      setisLoading(true);

      const response = await Axios.delete(
        config.url + '/policy/delete/' + policyid,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-token': getToken()
          }
        }
      );

      if (response.status === 200) {
        toast.success('Delete Success!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        fetchData();
        setPolicyid(0);
        handleClose();
      } else if (response.status === 401) {
        // Handle unauthorized access if needed
      } else {
        toast.warn('Delete Failed', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized access if needed
      } else {
        toast.error('An error occurred', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setisLoading(false);
      handleConfirmClose();
    }
  };



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

      const policyData = {
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
        await addData(policyData);
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
      const response = await Axios.post(config.url + '/policy/create/', values, {
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


  const updateData = async (policy_id, values) => {
    console.log(values)
    try {
      setisLoading(true);

      const response = await Axios.put(config.url + '/policy/dash/update/' + policy_id, values, {
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
    console.log(dataArray)
    if (dataArray.length > 0) {
      try {
        setisLoading(true);

        const idArray = dataArray.map(data => data.id);

        const data = {
          policy_ids: idArray
        };

        const response = await Axios.put(
          config.url + '/policy/dash/deletes',
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
              tableHeading="Policy List"
              columns={columns}
              dataSet={policyList}
              isLoading={isLoading}
              idName="policy_id"
              handleSaveRow={handleSaveRow}
              // handlePrint={handlePrint}
              deletedata={deletedata}
              enableClickToCopy
              enableRowNumbers={true}
              enableRowVirtualization
              addButtonHeading="Add Policy"
              enableAddButton={false}
              enableRowSelection={false}
              handleSubmit={handleSubmit}
              enableEdit={true}
              renderRowActionMenuItems={({ row, closeMenu }) => (
                [
                  <MenuItem key={1} onClick={() => {
                    handleOpen(row.id)
                    closeMenu();
                  }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PaidIcon /> Create Payment
                  </MenuItem>,
                  <MenuItem key={1} onClick={() => {
                    history.push(`/single-policy/${row.id}`);
                    closeMenu();
                  }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PreviewIcon /> View Policy
                  </MenuItem>,
                  <MenuItem key={2} onClick={() => {
                    handleConfirmOpen(row.id)
                    closeMenu();
                  }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Delete /> Delete
                  </MenuItem>,
                ]
              )}
            />
          </Col>
        </Row>
        {isOpen && (
          <AddFormModal
            enableAddButton={true}
            columns={policyFormColumns}
            addButtonHeading="Create Policy Payment"
            formData={paymentFormData}
            isOpen={isOpen}
            setFormData={setPaymentFormData}
            formSubmit={paymentFormSubmit}
            handleClose={handleClose}
          />
        )}
      </div>
      <DialogBox open={open} desc="Are you sure you want to delete this policy?" title="Confirm Delete" buttonText="Delete" handleClose={handleConfirmClose} handleDelete={handleDelete} />
    </>
  )
}

export default Policy