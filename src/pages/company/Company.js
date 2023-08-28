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

import DialogBox from '../../components/Alert/Confirm'

const Payments = () => {
    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [company_id, setCompanyid] = useState(0);

    const handleOpen = (id) => {
        setOpen(true);
        setCompanyid(id)
    };


    const handleClose = () => {
        setOpen(false);
        setCompanyid(0)
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [companyResponse] =
                await Promise.all([
                    Axios.get(config.url + '/company/all', { headers: { 'x-token': getToken() } }),
                ]);

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
            accessorKey: 'company_name',
            header: 'Company Name',
            export: true,
            enableEditing: true,
            enableColumnActions: true,
            minSize: 90,
            maxSize: 360,
            size: 180,
        },
        {
            accessorKey: 'company_branch',
            header: 'Branch',
            export: true,
            enableEditing: true,
            enableColumnActions: true,
            minSize: 90,
            maxSize: 360,
            size: 160,
        },
        {
            accessorKey: 'company_address',
            header: 'Address',
            export: true,
            enableEditing: true,
            enableColumnActions: true,
            minSize: 90,
            maxSize: 360,
            size: 160,
        },
        {
            accessorKey: 'company_phone',
            header: 'Phone',
            export: true,
            enableEditing: true,
            enableColumnActions: true,
            minSize: 90,
            maxSize: 360,
            size: 160,
        },
        {
            accessorKey: 'company_email',
            header: 'Email',
            export: true,
            enableEditing: true,
            enableColumnActions: true,
            minSize: 90,
            maxSize: 360,
            size: 160,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ renderedCellValue }) => {
                if (renderedCellValue === 0) {
                    return <>Active</>;
                } else if (renderedCellValue === 1) {
                    return <>Not Active</>;
                }
            },
            editVariant: 'select',
            enableEditing: true,
            minSize: 90,
            maxSize: 360,
            size: 100,
            editSelectOptions: [{
                value: '0',
                text: 'Active'
            }, {
                value: '1',
                text: 'Deactive'
            }],
        },
    ], []);



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


    const updateData = async (company_id, values) => {
        console.log(values)
        try {
            setisLoading(true);

            const response = await Axios.put(config.url + '/company/update/' + company_id, values, {
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
                config.url + '/company/delete/' + company_id,
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
                setCompanyid(0);
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
                setCompanyid(0);
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
            setCompanyid(0);
            handleClose();
        }
    };



    return (
        <>
            <div className="tabled">
                <Row gutter={[22, 0]}>
                    <Col xs={24} xl={24}>
                        <SimpleTable
                            tableHeading="Finance Company List"
                            columns={columns}
                            dataSet={companyList}
                            isLoading={isLoading}
                            idName="company_id"
                            handleSaveRow={handleSaveRow}
                            enableClickToCopy
                            enableRowNumbers={false}
                            enableRowVirtualization
                            enableRowSelection={false}
                            enableExport={false}
                            enableEdit={true}
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
                <DialogBox open={open} desc="Are you sure you want to delete this this Company?" title="Confirm Delete" buttonText="Delete" handleClose={handleClose} handleDelete={handleDelete} />
            </div>
        </>
    )
}

export default Payments