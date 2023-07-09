import React, { useState, useRef } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Modal, ThemeProvider, Typography, Button, Select, MenuItem, TextField, FormControl, InputLabel, FormControlLabel } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Checkbox, Form, Input } from 'antd';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(
    props,
    ref
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const { Option } = Select;

function SimpleTable(props) {
    const [rowSelection, setRowSelection] = useState({});
    const tableInstanceRef = useRef(null);

    const { columns, getData, isLoading, enableClickToCopy, enableRowNumbers, enableRowVirtualization, tableHeading, idName, handleSubmit, addButtonHeading } = props;

    const [open, setOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const onFinish = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData);
        handleSubmit(formDataObject);
      };
      
      

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
        const data = rows.map((row) => {
            const { fullname, trndate, status } = row.original;
            const formattedStatus = status === 1 ? 'Active' : 'Deactive';
            return { fullname, trndate, status: formattedStatus };
        });

        csvExporter.generateCsv(data);
    };

    const handleExportData = () => {
        const data = getData.map((item) => {
            const { fullname, trndate, status } = item;
            const formattedStatus = status === 1 ? 'Active' : 'Deactive';
            return { fullname, trndate, status: formattedStatus };
        });

        csvExporter.generateCsv(data);
    };

    const theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#fff',
            },
            background: {
                default: '#fff',
            },
            secondary: {
                main: '#fff',
            },
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#1890ff',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1890ff',
                            },
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        '&.Mui-focused': {
                            color: '#1890ff',
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <MaterialReactTable
                columns={columns}
                data={getData}
                getRowId={(row) => row[idName]}
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '2rem', p: '0.5rem', flexWrap: 'wrap' }}>
                        <Typography variant="h4">{tableHeading}</Typography>
                        <Button
                            color="primary"
                            onClick={handleOpenModal}
                            startIcon={<AddIcon />}
                            variant="contained"
                        >
                            Add User
                        </Button>

                        <Button
                            color="primary"
                            onClick={handleClickOpen}
                            startIcon={<DeleteIcon />}
                            variant="contained"
                        >
                            Delete
                        </Button>

                        <Button
                            color="primary"
                            onClick={handleExportData}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Excel
                        </Button>
                    </Box>
                )}
                enableEditing
                enablePagination={false}
                editingMode="row"
                enableRowSelection
                enableColumnOrdering
                state={{
                    isLoading: isLoading,
                }}
                onEditingRowSave={props.handleSaveRow}
                enableColumnActions={false}
                enableClickToCopy={enableClickToCopy}
                enableRowNumbers={enableRowNumbers}
                enableRowVirtualization={enableRowVirtualization}
                muiTableBodyRowProps={({ row }) => ({
                    onClick: row.getToggleSelectedHandler(),
                    sx: {
                        cursor: 'pointer',
                    },
                })}
                tableInstanceRef={tableInstanceRef}
            />
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle style={{ color: "Black" }}>{"Delete Records?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        When you select "Yes," selected records will be deleted. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        style={{ color: "Black" }}
                        variant="outlined"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <div>
                        <Button
                            color="primary"
                            onClick={async () => {
                                const selectedRows = tableInstanceRef.current?.getSelectedRowModel().rows;
                                if (selectedRows && selectedRows.length > 0) {
                                    await props.deletedata(selectedRows);
                                    handleClose(); // Close the dialog after successful deletion

                                } else {
                                    console.log('No rows selected.');
                                }
                            }}
                            startIcon={<DeleteIcon />}
                            variant="contained"
                        >
                            Delete
                        </Button>

                    </div>


                </DialogActions>
            </Dialog>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-user-modal-title"
                aria-describedby="add-user-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#E8E9EB',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <form name="basic" onSubmit={onFinish} autoComplete="off">
                        <Typography variant="h5" align="center" marginBottom={5}>
                            Add Users
                        </Typography>

                        <TextField
                            label="Full Name"
                            name="fullname"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }} // Add margin-bottom
                        />

                        <TextField
                            label="Phone Number"
                            name="phonenumber"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }} // Add margin-bottom
                        />

                        <TextField
                            label="Address"
                            name="address"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }} // Add margin-bottom
                        />

                        <TextField
                            label="Email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }} // Add margin-bottom
                        />

                        <TextField
                            label="Username"
                            name="username"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }} // Add margin-bottom
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }} // Add margin-bottom
                        />

                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <InputLabel id="select-label">Select</InputLabel>
                            <Select
                                labelId="select-label"
                                name="userrole"
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#1890ff',
                                        },
                                    },
                                    '& .MuiMenuItem-root': {
                                        fontFamily: 'Arial, sans-serif',
                                    },
                                }}
                            >
                                <MenuItem value="1">Admin</MenuItem>
                                <MenuItem value="0">Editor</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox name="remember" />}
                            sx={{ mt: 2, marginRight: 2 }}
                            label="Remember me"

                        />

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" type="submit" sx={{ marginRight: '10px' }}>
                                Submit
                            </Button>
                            <Button variant="contained" onClick={handleCloseModal} type="button" sx={{ marginLeft: '10px' }}>
                                Cancel
                            </Button>
                        </Box>

                    </form>
                </Box>
            </Modal>

        </ThemeProvider>
    );
}

export default SimpleTable;
