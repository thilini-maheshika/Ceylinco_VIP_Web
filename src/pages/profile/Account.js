/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Row } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import config from '../../config';
import { logout, getToken, getUserid } from "../../session";
import AddFormModal from "../../components/Modal/AddFormModal";
import EditFormModal from "../../components/Modal/EditFormModal";


import DialogBox from '../../components/Alert/Confirm'
import { Paper, Typography, Grid, Divider } from '@mui/material';

const Profile = () => {

    const currentUserID = getUserid();


    const [user, setSingleUser] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [policy, setPolicy] = useState(0);

    const [openchangepassword, setChangePasswordOpen] = useState(false);
    const [openedit, setOpenEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [userid, setUserid] = useState(0);

    const [userEditFormData, setuserEditFormData] = useState({
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
            const [userResponse] =
                await Promise.all([
                    Axios.get(config.url + '/user/me/' + currentUserID, { headers: { 'x-token': getToken() } }),
                ]);

            if (userResponse.status === 200) {
                setSingleUser(userResponse.data[0]);
                setuserEditFormData((prevFormData) => ({
                    ...prevFormData,
                    data: {
                        ...prevFormData.data,
                        fullname: userResponse.data[0].fullname,
                        phonenumber: userResponse.data[0].phonenumber,
                        address: userResponse.data[0].address,
                        email: userResponse.data[0].email,
                    },
                }));
            }else{
                window.location.reload();
                logout();
            }
        } catch (error) {
            handleErrorResponse(error);
            window.location.reload();
            logout();
        } finally {
            setisLoading(false);
        }
    };

    const handleOpen = (id) => {
        setChangePasswordOpen(true);
        setUserid(id)
    };

    const handleOpenEdit = (id) => {
        setOpenEdit(true);
        setUserid(id)
    };

    const userEditFormSubmit = async (event) => {

        handleClose();
        const { data } = event;


        const userData = {
            fullname: data.fullname,
            phonenumber: data.phonenumber,
            address: data.address,
            email: data.email,
        };

        try {
            setisLoading(true);

            const response = await Axios.put(config.url + '/user/me/update/' + userid, userData, {
                headers: {
                    'Content-Type': 'application/json',
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

        handleClose();

    };

    const changePasswordFormSubmit = async (event) => {
        handleClose();
        const { data } = event;

        if (data.confirmPassword === data.newPassword) {

            const passwordData = {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            };

            try {
                setisLoading(true);

                const response = await Axios.put(config.url + '/user/me/changePassword/' + userid, passwordData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': getToken(),
                    },
                });

                if (response.status === 200) {
                    fetchData();
                    setisLoading(false);
                    window.location.reload();
                    logout();

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

        }
        handleClose();

    };

    const handleClose = () => {
        setIsOpen(false);
        setOpenEdit(false);
        setChangePasswordOpen(false);
        setUserid(0)
        setuserEditFormData({
            data: {},
            errors: {},
        });
    };

    const handleConfirmClose = () => {
        setOpen(false);
        setUserid(0)
    };

    const handleConfirmOpen = (id) => {
        setOpen(true);
        setUserid(id)
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



    const userForm = useMemo(() => [
        {
            accessorKey: 'fullname',
            header: 'Full Name',
            formFeild: {
                isFormFeild: true,
                type: "text",
                value: user.fullname,
                xs: 12,
                validationType: ""
            },
        },
        {
            accessorKey: 'phonenumber',
            header: 'Phone Number',
            formFeild: {
                isFormFeild: true,
                type: "text",
                value: user.phonenumber,
                xs: 12,
                validationType: ""
            },
        },
        {
            accessorKey: 'address',
            header: 'Address',
            formFeild: {
                isFormFeild: true,
                value: user.address,
                type: "text",
                validationType: "",
                xs: 12,
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            formFeild: {
                isFormFeild: true,
                value: user.address,
                type: "text",
                validationType: "",
                xs: 12,
            },
        },
    ], [user]);

    const userChangePasswordForm = useMemo(() => [
        {
            accessorKey: 'currentPassword',
            header: 'Current Password',
            formFeild: {
                isFormFeild: true,
                type: "password",
                value: user.phonenumber,
                xs: 12,
                validationType: "requiredField"
            },
        },
        {
            accessorKey: 'newPassword',
            header: 'New Password',
            formFeild: {
                isFormFeild: true,
                value: user.address,
                type: "password",
                validationType: "requiredField",
                xs: 12,
            },
        },
        {
            accessorKey: 'confirmPassword',
            header: 'Confirm Password',
            formFeild: {
                isFormFeild: true,
                value: user.address,
                type: "password",
                validationType: "requiredField",
                xs: 12,
            },
        },
    ], [user]);


    const handleDelete = async () => {
        try {
            setisLoading(true);

            const response = await Axios.delete(
                config.url + '/user/me/delete' + setUserid,
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
                setUserid(0);
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

    return (
        <>
            <div className="tabled">

                <Row gutter={[22, 0]}>
                    <Col xs={24} xl={24}>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : user ? (
                            <Paper elevation={3} style={{ padding: '2%' }} className="single-policy-details">
                                <Typography variant="h5" gutterBottom>
                                    Welcome! {user.fullname}
                                </Typography>

                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <Typography variant="body1">User ID: #{user.userid}</Typography>
                                        <Typography variant="body1">Fullname: {user.fullname}</Typography>
                                        <Typography variant="body1">Address: {user.address}</Typography>
                                        <Typography variant="body1">Username: {user.username}</Typography>
                                        <Typography variant="body1">Email: <a href={`mailto:${user.email}`}>{user.email}</a></Typography>
                                        <Typography variant="body1">Phone: <a href={`tel:${user.phonenumber}`}>{user.phonenumber}</a></Typography>
                                        <Typography variant="body1">User Role: {user.userrole === 1 ? 'Admin' : 'Editor'}</Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ margin: '1rem 0' }} />


                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <a onClick={() => { handleOpen(user.userid) }} >Change Password</a>
                                </Grid>
                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <a onClick={() => { handleOpenEdit(user.userid) }} >Change Details</a>
                                </Grid>
                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <a onClick={() => { handleConfirmOpen(user.userid) }} >Deactive Account</a>
                                </Grid>
                            </Paper>

                        ) : (
                            <p>No policy found with ID {currentUserID}</p>
                        )}
                    </Col>
                </Row>
                {openchangepassword && (
                    <AddFormModal
                        enableAddButton={true}
                        columns={userChangePasswordForm}
                        addButtonHeading="Change Password"
                        formData={userEditFormData}
                        isOpen={openchangepassword}
                        setFormData={setuserEditFormData}
                        formSubmit={changePasswordFormSubmit}
                        handleClose={handleClose}
                    />
                )}
                {openedit && (
                    <AddFormModal
                        enableAddButton={true}
                        columns={userForm}
                        addButtonHeading="Edit Account"
                        formData={userEditFormData}
                        isOpen={openedit}
                        setFormData={setuserEditFormData}
                        formSubmit={userEditFormSubmit}
                        handleClose={handleClose}
                    />
                )}
            </div>
            <DialogBox open={open} desc="Are you sure you want to Deactive?" title="Confirm Delete" buttonText="Delete" handleClose={handleConfirmClose} handleDelete={handleDelete} />
        </>
    )
}

export default Profile