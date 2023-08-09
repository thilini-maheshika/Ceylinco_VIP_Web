import React, { useState, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Modal,
  ThemeProvider,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  FormControlLabel,
  handleOpenModal,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { createTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Checkbox, Form, Input } from "antd";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const { Option } = Select;

function SimpleTable(props) {
  const [rowSelection, setRowSelection] = useState({});
  const tableInstanceRef = useRef(null);

  const {
    columns,
    getData,
    isLoading,
    enableClickToCopy,
    enableRowNumbers,
    enableRowVirtualization,
    tableHeading,
    idName,
    isModalOpen,
    setIsModalOpen,
  } = props;

  const [open, setOpen] = React.useState(false);
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    const data = rows.map((row) => {
      const { fullname, trndate, status } = row.original;
      const formattedStatus = status === 1 ? "Active" : "Deactive";
      return { fullname, trndate, status: formattedStatus };
    });

    csvExporter.generateCsv(data);
  };

  const handleExportData = () => {
    const data = getData.map((item) => {
      const { fullname, trndate, status } = item;
      const formattedStatus = status === 1 ? "Active" : "Deactive";
      return { fullname, trndate, status: formattedStatus };
    });

    csvExporter.generateCsv(data);
  };

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#fff",
      },
      background: {
        default: "#fff",
      },
      secondary: {
        main: "#fff",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#1890ff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1890ff",
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: "#1890ff",
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
          <Box
            sx={{ display: "flex", gap: "2rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Typography variant="h4">{tableHeading}</Typography>
            {/* <Button
              color="primary"
              onClick={() => setIsModalOpen(true)} // Open the modal
              startIcon={<AddIcon />}
              variant="contained"
            >
              Add User
            </Button> */}

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
        enablePagination={true}
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
            cursor: "pointer",
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
        <DialogTitle style={{ color: "Black" }}>
          {"Delete Records?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            When you select "Yes," selected records will be deleted. Are you
            sure you want to continue?
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
                const selectedRows =
                  tableInstanceRef.current?.getSelectedRowModel().rows;
                if (selectedRows && selectedRows.length > 0) {
                  await props.deletedata(selectedRows);
                  handleClose(); // Close the dialog after successful deletion
                } else {
                  console.log("No rows selected.");
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
    </ThemeProvider>
  );
}

export default SimpleTable;
