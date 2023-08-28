import { Col, Row } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import config from '../../config';
import { logout, getToken } from "../../session";
import SimpleTable from '../../components/Table/SimpleTable';



const Users = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse] =
        await Promise.all([
          Axios.get(config.url + '/user/all', { headers: { 'x-token': getToken() } }),
        ]);

      if (usersResponse.status === 200) {
        setUserList(usersResponse.data);
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
      accessorKey: 'fullname',
      header: 'Full Name',
      export: true,
      enableColumnActions: true,
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
      accessorKey: 'address',
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
      accessorKey: 'email',
      header: 'Email',
      export: true,
      enableEditing: true,
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
      accessorKey: 'phonenumber',
      header: 'Mobile',
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
      accessorKey: 'userrole',
      header: 'User Role',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 90,
      maxSize: 360,
      size: 180,
      Cell: ({ renderedCellValue }) => {
        let value = ""; // Use let instead of const for reassignment
        if (renderedCellValue === 1 ) {
          value = "Admin";
        }else if(renderedCellValue === 0){
          value = "Editor";
        }else{
          value = "Not found";
        }
      
        return <>{value}</>; // Return the JSX element with the value
      },
      editVariant: 'select',
      formFeild: {
        isFormFeild: true,
        type: "select",
        xs: 6,
        validationType: "requiredField"
      },
      editSelectOptions: [{
        value: '1',
        text: 'Admin'
      }, {
        value: '0',
        text: 'User'
      }],
      // editSelectOptions: userRole.map((usrRole) => ({ value: usrRole.userroleid, text: usrRole.role })),
    },
    {
      accessorKey: 'username',
      header: 'User Name',
      export: true,
      enableEditing: true,
      enableColumnActions: true,
      minSize: 50,
      maxSize: 50,
      size: 50,
      formFeild: {
        isFormFeild: true,
        type: "TextField",
        xs: 12,
        validationType: "requiredField"
      },
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
  ], []);

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

      const usersData = {
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
        await addData(usersData);
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
      const response = await Axios.post(config.url + '/user/create/', values, {
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


  const updateData = async (userid, values) => {
    try {
      setisLoading(true);

      const response = await Axios.put(config.url + '/user/update/' + userid, values, {
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
          userIds: idArray
        };

        const response = await Axios.put(
          config.url + '/user/delete/',
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
              tableHeading="Users"
              columns={columns}
              dataSet={userList}
              isLoading={isLoading}
              idName="userid"
              handleSaveRow={handleSaveRow}
              // handlePrint={handlePrint}
              deletedata={deletedata}
              enableClickToCopy
              enableRowNumbers={false}
              enableEdit={true}
              enableRowSelection={true}
              enableRowVirtualization
              addButtonHeading="Add User"
              enableAddButton={true}
              handleSubmit={handleSubmit}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Users