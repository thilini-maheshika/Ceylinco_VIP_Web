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
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Paper, Typography, Button, Grid, Box, Divider } from '@mui/material';


const SinglePolicy = () => {

    const { id } = useParams();


    const [sinhlePolicy, setSinglePolicy] = useState([]);
    const [dealer, setDealer] = useState([]);
    const [company, setCompany] = useState([]);
    const [payment, setPayment] = useState([]);
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
    }, [id, history]);

    const fetchData = async () => {
        if (!id) {
            history.push('/policy');
        }

        try {
            const [policyResponse] =
                await Promise.all([
                    Axios.get(config.url + '/policy/' + id, { headers: { 'x-token': getToken() } }),
                ]);

            if (policyResponse.status === 200) {
                setSinglePolicy(policyResponse.data[0]);
                fetchDataDealer(policyResponse.data[0].dealer_id);
            }
        } catch (error) {
            handleErrorResponse(error);
            history.push('/policy');
        } finally {
            setisLoading(false);
        }
    };

    const fetchDataDealer = async (dealer_id) => {

        try {
            const [dealerResponse] =
                await Promise.all([
                    Axios.get(config.url + '/dealer/dash/' + dealer_id, { headers: { 'x-token': getToken() } }),
                ]);

            if (dealerResponse.status === 200) {
                setDealer(dealerResponse.data[0])
                fetchDataCompany(dealerResponse.data[0].company_id)
            }
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setisLoading(false);
        }
    }

    const fetchDataCompany = async (company_id) => {

        try {
            const [companyResponse] =
                await Promise.all([
                    Axios.get(config.url + '/company/' + company_id, { headers: { 'x-token': getToken() } }),
                ]);

            if (companyResponse.status === 200) {
                setCompany(companyResponse.data[0])
            }
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setisLoading(false);
        }
    }

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

    const getVehicleType = (type) => {
        switch (type) {
            case 1:
                return "Car";
            case 2:
                return "Van";
            case 3:
                return "Bus";
            case 4:
                return "Truck";
            case 5:
                return "Motorcycle";
            case 6:
                return "Three Wheel";
            case 7:
                return "Tractor";
            default:
                return "Other";
        }
    };

    const getPurpos = (perpos) => {
        switch (perpos) {
            case 1:
                return "Private";
            case 2:
                return "Rent";
            case 3:
                return "Hire";
            default:
                return "Other";
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

    const crimageUrl = config.url + '/policy/files/' + sinhlePolicy.cr_image;
    const vehicleimageimageUrl = config.url + '/policy/files/' + sinhlePolicy.vehicle_image;
    const privious_insurence_card_imageimageUrl = config.url + '/policy/files/' + sinhlePolicy.privious_insurence_card_image;

    return (
        <>
            <div className="tabled">

                <Row gutter={[22, 0]}>
                    <Col xs={24} xl={24}>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : sinhlePolicy ? (
                            <Paper elevation={3} style={{ padding: '2%' }} className="single-policy-details">
                                <Typography variant="h5" gutterBottom>
                                    Policy Details
                                </Typography>

                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <Typography variant="body1">Policy ID: #{sinhlePolicy.policy_id}</Typography>
                                        <Typography variant="body1">Vehicle Type: {getVehicleType(sinhlePolicy.vehicle_type)}</Typography>
                                        <Typography variant="body1">Customer Fullname: {sinhlePolicy.customer_fullname}</Typography>
                                        <Typography variant="body1">Customer Address: {sinhlePolicy.customer_address}</Typography>
                                        <Typography variant="body1">Customer NIC: {sinhlePolicy.customer_nic}</Typography>
                                        <Typography variant="body1">Customer Email: <a href={`mailto:${sinhlePolicy.customer_email}`}>{sinhlePolicy.customer_email}</a></Typography>
                                        <Typography variant="body1">Customer Phone: <a href={`tel:${sinhlePolicy.customer_phone}`}>{sinhlePolicy.customer_phone}</a></Typography>
                                        <Typography variant="body1">Vehicle Registration Number: {sinhlePolicy.vehicle_reg_no}</Typography>
                                        <Typography variant="body1">Engine Number: {sinhlePolicy.engin_no}</Typography>
                                        <Typography variant="body1">Chassis Number: {sinhlePolicy.chassis_no}</Typography>
                                        <Typography variant="body1">Model: {sinhlePolicy.model}</Typography>
                                        <Typography variant="body1">Policy Type: {sinhlePolicy.policy_type === 1 ? 'Full Insurance' : 'Third Party'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <Typography variant="body1">Years of Make: {sinhlePolicy.years_of_make}</Typography>
                                        <Typography variant="body1">Leasing Company: {sinhlePolicy.leasing_company}</Typography>
                                        <Typography variant="body1">Vehicle Color: {sinhlePolicy.vehicle_color}</Typography>
                                        <Typography variant="body1">Horse Power: {sinhlePolicy.horse_power}</Typography>
                                        <Typography variant="body1">Value of Vehicle: {sinhlePolicy.value_of_vehicle}</Typography>
                                        <Typography variant="body1">Use Purpose: {getPurpos(sinhlePolicy.use_perpose)}</Typography>

                                    </Grid>
                                </Grid>

                                <Divider sx={{ margin: '1rem 0' }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        {sinhlePolicy.cr_image && (
                                            <Box>
                                                <Typography variant="body1">CR Image:</Typography>
                                                <img style={{ width: '50%', marginTop: '20px' }} src={crimageUrl} alt="CR Image" />
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        {sinhlePolicy.vehicle_image && (
                                            <Box>
                                                <Typography variant="body1">Vehicle:</Typography>
                                                <img style={{ width: '50%', marginTop: '20px' }} src={vehicleimageimageUrl} alt="CR Image" />
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        {sinhlePolicy.privious_insurence_card_image && (
                                            <Box>
                                                <Typography variant="body1">Previous Insurance Card:</Typography>
                                                <img style={{ width: '50%', marginTop: '20px' }} src={privious_insurence_card_imageimageUrl} alt="CR Image" />
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>

                                {/* <Divider sx={{ margin: '1rem 0' }} /> */}

                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={12} md={12}>
                                        {sinhlePolicy.policy_price ? (
                                            <Typography style={{ fontSize: '20px', color: 'red' }} variant="body1">
                                                Policy Price: {sinhlePolicy.policy_price}
                                            </Typography>
                                        ) : (
                                            <>
                                                <Typography style={{ fontSize: '18px', color: 'red' }} variant="body1">
                                                    Price Pending.. Not Created Payment yet
                                                </Typography>
                                                <a onClick={() => { handleOpen(sinhlePolicy.policy_id) }} >Create Payment</a>
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                                <Divider sx={{ margin: '2rem 0' }} />
                                {dealer ? (
                                    <Grid container spacing={2}>
                                        <Typography variant="h5" gutterBottom>
                                            Dealer Details
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <Typography variant="body1">Dealer Fullname: {dealer.dealer_fullname}</Typography>
                                                <Typography variant="body1">Dealer Address: {dealer.dealer_address}</Typography>
                                                <Typography variant="body1">Dealer NIC: {dealer.dealer_nic}</Typography>
                                                <Typography variant="body1">Dealer Phone: {dealer.dealer_phone}</Typography>
                                                <Typography variant="body1">Dealer Whatsapp: {dealer.dealer_whatsapp_number}</Typography>
                                                <Typography variant="body1">Dealer Email: <a href={`mailto:${dealer.dealer_email}`}>{dealer.dealer_email}</a></Typography>
                                                <Typography variant="body1">Active: {dealer.status == 1 && dealer.is_delete == 0 ? "Active" : "Not Active"}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (<></>)}
                                <Divider sx={{ margin: '2rem 0' }} />
                                {company ? (
                                    <Grid container spacing={2}>
                                        <Typography variant="h5" gutterBottom>
                                            Finance Company Details
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <Typography variant="body1">Finance Company Name: {company.company_name}</Typography>
                                                <Typography variant="body1">Branch: {company.company_branch}</Typography>
                                                <Typography variant="body1">Address: {company.company_address}</Typography>
                                                <Typography variant="body1">Phone: {company.company_phone}</Typography>
                                                <Typography variant="body1">Email: <a href={`mailto:${company.company_email}`}>{company.company_email}</a></Typography>
                                                <Typography variant="body1">Active: {company.status == 0 && company.is_delete == 0 ? "Active" : "Not Active"}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (<></>)}
                                {/* Add more details as needed */}
                                <Grid container spacing={2} style={{ marginTop: '30px' }}>
                                    <Button variant="contained" color="primary" onClick={handleConfirmOpen}>Delete Policy</Button>
                                </Grid>
                            </Paper>

                        ) : (
                            <p>No policy found with ID {id}</p>
                        )}
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

export default SinglePolicy