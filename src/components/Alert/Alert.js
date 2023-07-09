import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import AlertTitle from '@mui/material/AlertTitle/AlertTitle';

export const SuccessAlert = (props) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        console.log(open);
        const timer = setTimeout(() => {
            setOpen(false);
        }, 2500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {props.message}
                </Alert>
            </Collapse>
        </Box>
    );
};


export const WarningAlert = (props) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        console.log(open);
        const timer = setTimeout(() => {
            setOpen(false);
        }, 2500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
                <Alert severity="warning"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    <AlertTitle>Warning</AlertTitle>
                    {props.message}
                </Alert>
            </Collapse>
        </Box>
    );
};
