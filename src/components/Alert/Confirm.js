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
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Payments = (props) => {

    return (<>
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.desc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={props.handleDelete} color="primary">{props.buttonText}</Button>
            </DialogActions>
        </Dialog>
    </>)

}
export default Payments