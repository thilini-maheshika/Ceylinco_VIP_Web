import { Col, Row } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import config from '../../config';
import { logout, getToken } from "../../session";
import SimpleTable from '../../components/Table/SimpleTable';
import { MenuItem } from "@mui/material";
import { Delete } from "@material-ui/icons";
import { getUserrole } from "../../session";
import DialogBox from '../../components/Alert/Confirm'

const Payments = () => {
  const [dealerList, setdealerList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [paymentid, setPaymentid] = useState(0);

  const handleOpen = (id) => {
    setOpen(true);
    setPaymentid(id)
  };


  const handleClose = () => {
    setOpen(false);
    setPaymentid(0)
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [dealerResponse, paymentResponse] =
        await Promise.all([
          Axios.get(config.url + '/dealer/dash/all', { headers: { 'x-token': getToken() } }),
          Axios.get(config.url + '/payment/all/pending', { headers: { 'x-token': getToken() } }),
        ]);

      if (dealerResponse.status === 200) {
        setdealerList(dealerResponse.data);
      }

      if (paymentResponse.status === 200) {
        setPaymentList(paymentResponse.data);
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
      accessorKey: 'dealerid',
      header: 'Dealer',
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 180,
      Cell: ({ renderedCellValue }) => {
        const userRoleObject = dealerList.find(dealer => {
          if (dealer.dealer_id == renderedCellValue) {
            return dealer.dealer_fullname
          }
        });
        const userRoleName = userRoleObject ? userRoleObject.dealer_fullname : "Not Found";
        return <>{userRoleName}</>;
      },
      formFeild: {
        isFormFeild: false,
      },
    },
    {
      accessorKey: 'policy_amount',
      header: 'Policy Amount',
      export: true,
      Cell: ({ renderedCellValue }) => {
        if (renderedCellValue === 0 || renderedCellValue === null || renderedCellValue === "") {
          return <>Pending Payment</>;
        } else {
          return <>{renderedCellValue}</>;
        }
      },
      enableColumnActions: true,
      enableEditing: false,
      minSize: 90,
      maxSize: 360,
      size: 150,
      formFeild: {
        isFormFeild: false,
      },
    },
    {
      accessorKey: 'qutation',
      header: 'Qutation',
      Cell: ({ renderedCellValue }) => {
        const fileExtension = renderedCellValue.split('.').pop().toLowerCase();
        const fullUrl = config.url + '/policy/qutation/' + renderedCellValue;

        if (fileExtension === 'pdf') {
          return (
            <a href={fullUrl} download="file.pdf">
              Download PDF
            </a>
          );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          return <img src={fullUrl} alt="Image" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
        } else {
          return <>Unsupported File Type</>;
        }
      },
      export: true,
      enableEditing: false,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 160,
      formFeild: {
        isFormFeild: false,
      },
    },

    {
      accessorKey: 'commition_amount',
      header: 'Commision',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 160,
      formFeild: {
        isFormFeild: false,
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ renderedCellValue }) => {
        if (renderedCellValue === 0) {
          return <>Pending</>;
        } else if (renderedCellValue === 1) {
          return <>Quotation Sent</>;
        } else if (renderedCellValue === 2) {
          return <>Confirmed by Customer</>;
        } else if (renderedCellValue === 3) {
          return <>Completed Payments</>;
        } else {
          return <>{renderedCellValue}</>;
        }
      },
      editVariant: 'select',
      enableEditing: false,
      minSize: 90,
      maxSize: 360,
      size: 100,
      editSelectOptions: [
        {
          value: '0',
          text: 'Pending',
        },
        {
          value: '1',
          text: 'Quotation Sent',
        },
        {
          value: '2',
          text: 'Paid',
        },
        {
          value: '3',
          text: 'Payment Completed',
        },
      ],
      formField: {
        isFormField: false,
      },
    },
    {
      accessorKey: 'trndate',
      header: 'Date',
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
  ], [dealerList]);



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


  const updateData = async (paymentid, values) => {
    console.log(values)
    try {
      setisLoading(true);

      const response = await Axios.put(config.url + '/payment/update/' + paymentid, values, {
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

  const handleDelete = async () => {
    try {
      setisLoading(true);

      const response = await Axios.delete(
        config.url + '/payment/delete/' + paymentid,
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
        setPaymentid(0);
        handleClose();
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
        setPaymentid(0);
        handleClose();
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
        handleClose();
      }
    } finally {
      setisLoading(false);
      setPaymentid(0);
      handleClose();
    }
  };



  return (
    <>
      <div className="tabled">
        <Row gutter={[22, 0]}>
          <Col xs={24} xl={24}>
            <SimpleTable
              tableHeading="Pending Payment"
              columns={columns}
              dataSet={paymentList}
              isLoading={isLoading}
              idName="paymentid"
              handleSaveRow={handleSaveRow}
              enableClickToCopy
              enableRowNumbers={false}
              enableRowVirtualization
              enableRowSelection={false}
              enableExport={false}
              enableEdit={getUserrole() == 1 ? true : false }
              renderRowActionMenuItems={({ row, closeMenu }) => (
                [
                  <MenuItem key={2} onClick={() => {
                    handleOpen(row.id)
                    closeMenu();
                  }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Delete /> Delete
                  </MenuItem>,
                ]
              )}
            />
          </Col>
        </Row>
        <DialogBox open={open} desc="Are you sure you want to delete this payment?" title="Confirm Delete" buttonText="Delete" handleClose={handleClose} handleDelete={handleDelete} />
      </div>
    </>
  )
}

export default Payments