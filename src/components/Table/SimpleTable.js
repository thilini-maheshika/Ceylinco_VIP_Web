import React, { useState, useRef, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { toast } from 'react-toastify';
import { Box, Button, IconButton, MenuItem, ThemeProvider, Tooltip, Typography } from '@mui/material';
import { ExportToCsv } from 'export-to-csv';
import { createTheme } from '@mui/material/styles';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddFormModal from '../Modal/AddFormModal';


function SimpleTable(props) {
    const [rowSelection, setRowSelection] = useState({});
    const tableInstanceRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const {
        columns,
        dataSet,
        isLoading,
        enableClickToCopy,
        enableRowNumbers,
        idName,
        tableHeading,
        addButtonHeading,
        handleSubmit,
        enableAddButton,
        enableGroup,
    } = props;

    const [formData, setFormData] = useState({
        data: {},
        errors: {},
    });

    const handleExportData = () => {
        if (dataSet) {
            const headersList = columns
                .filter((column) => column.accessorKey && column.export) // Filter out columns without headers
                .map((column) => column.accessorKey); // Get the headers of the remaining columns


            const data = dataSet.map((item) => {
                const rowData = {};

                // Iterate over the columns with headers and include their values in the rowData object
                headersList.forEach((header) => {
                    if (header === 'status') {
                        const formattedStatus = item[header] === 1 ? 'Active' : 'Deactive';
                        rowData[header] = formattedStatus;
                    } else {
                        rowData[header] = item[header];
                    }
                });


                // const formattedStatus = item.supplier_status === 1 ? 'Active' : 'Deactive';
                // rowData.status = formattedStatus;

                return rowData;
            });


            const csvOptions = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                useBom: true,
                useKeysAsHeaders: false,
                headers: headersList,
            };

            const csvExporter = new ExportToCsv(csvOptions);
            csvExporter.generateCsv(data);

        } else {
            toast.warn('No Data Found', {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }
    };


    const theme = createTheme({
        palette: {
            mode: 'light'
        },
    });

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setFormData({
            data: {},
            errors: {},
        });
    };


    const formSubmit = (event) => {
        event.preventDefault();
        handleSubmit(formData);
        handleClose();
    };

    const handleSaveRow = ({ exitEditingMode, row, values }) => {
        // console.log("ROW" + JSON.stringify(row))
        const rowDataID = row.id;
        props.handleSaveRow({ exitEditingMode, rowDataID, values });
    };


    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });

    useEffect(() => {
        //do something when the pagination state changes
    }, [pagination.pageIndex, pagination.pageSize]);

    const handleDeleteRow = (row) => {
        console.log(row)
    }

    return (
        <ThemeProvider theme={theme}>
            <MaterialReactTable
                columns={columns}
                data={dataSet}
                onPaginationChange={setPagination} //hoist pagination state to your state when it changes internally
                initialState={{ density: 'compact' }}
                getRowId={(row) => row[idName]}
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>

                        {addButtonHeading !== undefined && enableAddButton && (
                            <div>
                                <Button style={{ color: '#ffffff', backgroundColor: '#2b3642' }} onClick={handleOpen} startIcon={<AddOutlinedIcon />} variant="contained">
                                    Add
                                </Button>
                            </div>
                        )}

                        <div>
                            <Button
                                style={{ color: '#ffffff', backgroundColor: '#2b3642' }}
                                onClick={() => {
                                    props.deletedata(tableInstanceRef.current?.getSelectedRowModel().rows);
                                }}
                                startIcon={<DeleteOutlineOutlinedIcon />}
                                variant="contained"
                            >
                                Delete
                            </Button>
                        </div>

                        <div>
                            <Button style={{ color: '#ffffff', backgroundColor: '#2b3642' }} onClick={handleExportData} startIcon={<FileDownloadOutlinedIcon />} variant="contained">
                                CSV
                            </Button>
                        </div>

                        <Typography variant="h4">{tableHeading}</Typography>
                    </Box>
                )}
                enableEditing
                enablePagination={true}
                positionPagination="top"
                editingMode="row"
                enableRowSelection
                state={{
                    isLoading: isLoading,
                    pagination
                }}

                onEditingRowSave={handleSaveRow}
                enableClickToCopy={enableClickToCopy}
                enableRowNumbers={enableRowNumbers}
                tableInstanceRef={tableInstanceRef}
                enableRowActions={props.rowAction}
                renderRowActionMenuItems={props.renderRowActionMenuItems}
            />
            {isOpen && (
                <AddFormModal
                    enableAddButton={enableAddButton}
                    columns={columns}
                    formData={formData}
                    isOpen={isOpen}
                    addButtonHeading={addButtonHeading}
                    setFormData={setFormData}
                    formSubmit={formSubmit}
                    handleClose={handleClose}
                    dataSet={dataSet}
                    idName={idName}
                />
            )}
        </ThemeProvider>
    );
}

export default SimpleTable;
