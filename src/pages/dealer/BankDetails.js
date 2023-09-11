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


    const [bankdetails, setSinglePolicy] = useState([]);

    const [isLoading, setisLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [policy, setPolicy] = useState(0);
    const fileInputRef = useRef();

    const history = useHistory();

    const [open, setOpen] = useState(false);
    const [accountid, setAccountid] = useState(0);

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
            history.push('/dealer');
        }

        try {
            const [policyResponse] =
                await Promise.all([
                    Axios.get(config.url + '/bank/dash/dealer/' + id, { headers: { 'x-token': getToken() } }),
                ]);

            if (policyResponse.status === 200) {

                if(policyResponse.data[0]){
                    setSinglePolicy(policyResponse.data[0]);
                }else{
                    history.push('/dealer');
                }
            }
        } catch (error) {
            handleErrorResponse(error);
            history.push('/dealer');
        } finally {
            setisLoading(false);
        }
    };


    const handleOpen = (id) => {
        setIsOpen(true);
        setPolicy(id)
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
        setAccountid(0)
    };

    const handleConfirmOpen = (id) => {
        console.log(id)
        setOpen(true);
        setAccountid(id)
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

    const handleDelete = async () => {
        try {
            setisLoading(true);

            const response = await Axios.delete(
                config.url + '/bank/dash/delete/' + accountid,
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

                history.push('/dealer');

                fetchData();
                setAccountid(0);
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
                        ) : bankdetails ? (
                            <Paper elevation={3} style={{ padding: '2%' }} className="single-policy-details">
                                <Typography variant="h5" gutterBottom>
                                    Bank Account Details
                                </Typography>

                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <Typography variant="body1">Bank ID: #{bankdetails.account_id }</Typography>
                                        <Typography variant="body1">Holder Name: {bankdetails.account_name}</Typography>
                                        <Typography variant="body1">Account Number: {bankdetails.account_number}</Typography>
                                        <Typography variant="body1">Bank: {bankdetails.account_bank}</Typography>
                                        <Typography variant="body1">Branch: {bankdetails.account_bank_branch}</Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ margin: '2rem 0' }} />
                                {/* Add more details as needed */}
                                <Grid container spacing={2} style={{ marginTop: '30px' }}>
                                    <Button variant="contained" color="primary" onClick={() => {handleConfirmOpen(bankdetails.account_id)}}>Delete Policy</Button>
                                </Grid>
                            </Paper>

                        ) : (
                            <p>No Dealer Bank Account found</p>
                        )}
                    </Col>
                </Row>
            </div>
            <DialogBox open={open} desc="Are you sure you want to delete this policy?" title="Confirm Delete" buttonText="Delete" handleClose={handleConfirmClose} handleDelete={handleDelete} />
        </>
    )
}

export default SinglePolicy