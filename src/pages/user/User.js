// Imports
import { Col, Row } from "antd";
import Axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import config from '../../config';
import { logout, getToken } from "../../session";
import SimpleTable from '../../components/Table/SimpleTable';

import { SuccessAlert, WarningAlert } from "../../components/Alert/Alert";

function User() {
    const [pending, setPending] = useState(true);
    const [user, setUser] = useState([]);
    const [isLoading, setisLoading] = useState(true)
    const [success, setSuccess] = useState({
        message: "",
        has: false
    });
    const [error, setError] = useState({
        message: "",
        has: false
    });

    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 2 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const addData = async (values) => {

        try {
            setPending(true);

            const response = await Axios.post(config.url + '/user/create/', values, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': getToken()
                }
            });

            if (response.status === 201) {
                setPending(false);
                fetchData();
            } else if (response.status === 401) {
                logout();
            } else {
                fetchData();
            }

        } catch (error) {
            if (error.response.status === 401) {
                window.location.reload();
                logout();
            }
        } finally {
            setPending(false);
        }
    };


    const handleSubmit = async (formData) => {
        //console.log(formData)
       console.log(JSON.stringify(formData));
        try {
            // Call the postData function with the form data
            await addData(formData);
            setSuccess({ message: "Data successfully added!", has: true });
        } catch (error) {
            // Handle errors
            console.log('Error posting data:', error);
            setError({ message: "Error adding data!", has: true });
        }
    };

    const fetchData = async () => {
        try {
            const response = await Axios.get(config.url + '/user/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': getToken()
                }
            });

            if (response.status === 200) {
                setUser(response.data);
            } else {
                fetchData();
            }
        } catch (error) {
            if (error.response.status === 401) {
                window.location.reload();
                logout();
            } else {
                console.log(error)
                setError({ message: error.message, has: true })
            }
        } finally {
            setisLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'fullname',
            header: 'Full Name',
            export: true,
            enableColumnActions: true
        },
        {
            accessorKey: 'phonenumber',
            header: 'Phone',
            export: true,
            enableColumnActions: true
        },
        {
            accessorKey: 'address',
            header: 'Address',
            export: true,
            enableColumnActions: true
        },
        {
            accessorKey: 'email',
            header: 'Email',
            export: true,
            enableColumnActions: true
        },
        {
            accessorKey: 'username',
            header: 'Username',
            export: true,
            enableColumnActions: true
        },
        {
            accessorKey: 'userrole',
            header: 'User Role',
            Cell: ({ renderedCellValue }) => <>{renderedCellValue === 1 ? "Admin" : "Editor"}</>,
            editVariant: 'select',
            editSelectOptions: [{
                value: '1',
                text: 'Admin'
            }, {
                value: '0',
                text: 'Editor'
            }]
        },

        {
            accessorKey: 'trndate',
            header: 'Date',
            enableEditing: false,
            enableColumnActions: true
        },
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ renderedCellValue }) => <>{renderedCellValue === 1 ? "Active" : "Deactive"}</>,
            editVariant: 'select',
            editSelectOptions: [{
                value: '1',
                text: 'Active'
            }, {
                value: '0',
                text: 'Deactive'
            }]
        },
    ], []);


    const handleSaveRow = async ({ exitEditingMode, row, values }) => {
        await updateData(row.id, values);
        exitEditingMode();
    };

    const updateData = async (userid, values) => {
        const data = {
            fullname: values.fullname,
            phonenumber: values.phonenumber,
            address: values.address,
            email: values.email,
            username: values.username,
            userrole: values.userrole,
            status: values.status
        };

        try {
            setPending(true);

            const response = await Axios.put(config.url + '/user/update/' + userid, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': getToken()
                }
            });

            if (response.status === 200) {
                setPending(false);
                setSuccess({ message: "Update Success! ", has: true });
                fetchData();
            } else if (response.status === 401) {
                logout();
            } else {
                fetchData();

            }

        } catch (error) {
            if (error.response.status === 401) {
                window.location.reload();
                logout();
            }
        } finally {
            setPending(false);
        }
    };

    const deletedata = async (dataArray) => {

        if (dataArray.length > 0) {
            console.log(dataArray);

            // Create a new array with only the 'id' values
            const idArray = dataArray.map(data => data.id);
            const data = {
                userId: idArray
            }

            console.log(idArray);

            try {
                setPending(true);

                const response = await Axios.put(config.url + '/user/delete/' + idArray, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': getToken()
                    }
                });

                if (response.status === 200) {
                    setPending(false);
                    fetchData();
                } else if (response.status === 401) {
                    logout();
                } else {
                    fetchData();
                }

            } catch (error) {
                if (error.response.status === 401) {
                    window.location.reload();
                    logout();
                }
            } finally {
                setPending(false);
            }
        } else {
            // Handle case when dataArray is empty
        }
    };

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs={24} xl={24}>
                        {success.has === true ? <SuccessAlert message={success.message} /> : <></>}
                        {error.has === true ? <WarningAlert message={error.message} /> : <></>}
                        <SimpleTable
                            tableHeading="User List"
                            columns={columns}
                            getData={user}
                            isLoading={isLoading}
                            handleSaveRow={handleSaveRow}
                            deletedata={deletedata}
                            idName="userid"
                            enableClickToCopy
                            enableRowNumbers={false}
                            enableRowVirtualization={false}
                            addButtonHeading="Add User"
                            handleSubmit={handleSubmit}
                        />
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default User;
