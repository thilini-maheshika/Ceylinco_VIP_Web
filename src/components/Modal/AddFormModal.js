import React, { useState, useEffect } from 'react';
import { TextField, IconButton, FormControl, Select, MenuItem, InputLabel, InputAdornment, Grid, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const Yup = require('yup');

const passwordSchema = Yup.string()
    .min(12, 'Password must be at least 12 characters long')
    .matches(
        /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]+$/,
        'Password must include at least one letter, one number, and one symbol'
    )
    .required('This field is required');

const imageSchema = Yup.mixed().test('image', 'Invalid image format', (value) => {
    if (!value) {
        return true; // No image provided, validation will be handled separately
    }

    const acceptedFormats = ['image/jpeg', 'image/png']; // Add more formats if needed
    return acceptedFormats.includes(value.type);
});

export default function AddFormModal(props) {
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Add a new state and initial form data for the image field:
    const [selectedImage, setSelectedImage] = useState(null);
    // Add a new state and initial form data for the image field:


    const handlePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleFieldFocus = (field) => {
        setFocusedField(field);
    };

    const {
        enableAddButton,
        columns,
        formData,
        addButtonHeading,
        setFormData,
        formSubmit,
        isOpen,
        setIsOpen,
        handleClose
    } = props;

    const handleValidation = (validationType, field) => {
        if (validationType === 'requiredField') {
            const validation = Yup.string()
                .required('This field is required');
            field.validation = validation;
        } else if (validationType === 'mobile') {
            const validation = Yup.string()
                .matches(/^[+]\d{1,3}\s?(\d{10}|\d{12})$/, {
                    message: 'Invalid mobile number',
                    excludeEmptyString: true,
                })
                .required('This field is required');

            field.validation = validation;
        } else if (validationType === 'email') {
            const validation = Yup.string()
                .email('Invalid email address')
                .required('This field is required');
            field.validation = validation;
        } else if (validationType === 'userrole') {
            const validation = Yup.string()
                .required('User role is required');
            field.validation = validation;
        } else if (validationType === 'password') {
            field.validation = passwordSchema;
        } else if (validationType === 'image') {
            field.validation = imageSchema;
        }
    };

    // Update the formData object to include the image field:
    const initialFormData = {
        data: {
            // ... other fields ...
            image: null, // Initial value for the image field
        },
        errors: {
            // ... other errors ...
            image: null, // Initial error for the image field
        },
    };
    // Update the formData object to include the image field:


    // Define the imageField before pushing it into formFields
    //Add the image upload field to the formFields array://
    const imageField = {
        name: 'image',
        label: 'Image',
        type: 'image',
        validationType: 'image', // You can define image validation if needed
        isFormFeild: true,
        xs: 12, // You might want to use full width for the image field
    };

    const formFields = columns.reduce((fields, column) => {
        const { accessorKey, header, formFeild } = column;

        const field = {
            name: accessorKey,
            label: header,
            type: formFeild.type === 'TextField' ? 'text' : formFeild.type,
            xs: formFeild.xs,
        };

        if (formFeild.isFormFeild) {
            handleValidation(formFeild.validationType, field);
        }

        if (formFeild.type === 'select') {
            const options = column.editSelectOptions.map((option) => ({
                value: option.value,
                label: option.text,
            }));
            field.options = options;
        }
        if (formFeild.type === 'image') {
            fields.push(imageField);
            // Add the image upload field to the formFields array
        }
        if (formFeild.isFormFeild) {
            fields.push(field);
        }

        return fields;
    }, []);






    const newPasswordField = {
        name: 'newPassword',
        label: 'New Password',
        type: 'password',
        validationType: 'password',
        isFormFeild: true,
        xs: 6,
    };

    const confirmPasswordField = {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        validationType: 'password',
        isFormFeild: true,
        xs: 6,
    };


    if (addButtonHeading === 'Add User') {
        formFields.push(newPasswordField, confirmPasswordField);
        handleValidation(newPasswordField.validationType, newPasswordField);
        handleValidation(confirmPasswordField.validationType, confirmPasswordField);
    }


    // Add a function to handle image upload:
    // const handleImageChange = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedImage(file);
    //     const imageValidationOutput = checkValidation({
    //         target: {
    //             name: 'image',
    //             value: file,
    //         },
    //     });
    //     // console.log(imageValidationOutput);
    // };
    // Add a function to handle image upload:



    const handleChange = (event) => {
        checkValidation(event);
        //Update the handleChange function to handle the image field:
        // if (event.target.name === 'image') {
        //     handleImageChange(event);
        // } else {
        //     checkValidation(event);
        // }
        //Update the handleChange function to handle the image field:
    };

    const checkValidation = (event) => {
        const { name, value } = event.target;
        // Validate the field value
        const fieldSchema = formFields.find((field) => field.name === name)?.validation;
        let fieldError = null;
        if (fieldSchema) {
            try {
                fieldSchema.validateSync(value);
            } catch (error) {
                fieldError = error.message;
            }
        }

        if (name === 'confirmPassword' && value !== formData.data.newPassword) {
            fieldError = 'Passwords do not match';
        }

        setFormData((prevState) => ({
            data: {
                ...prevState.data,
                [name]: value,
            },
            errors: {
                ...prevState.errors,
                [name]: fieldError,
            },
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        checkValidation(event);
        const hasErrors = Object.values(formData.errors).some((error) => error !== null);
        if (!hasErrors) {
            formSubmit(event);
        }
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    background: '#fff',
                    color: '#000',
                    borderRadius: 25,
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    padding: 10,
                    textAlign: 'center',
                }}
            >
                <div
                    style={{ width: '100%', color: 'dark', height: '50px', borderRadius: '15px 15px 4px 4px', marginBottom: 15 }}
                >
                    <Typography variant="h6" component="h2" gutterBottom style={{ color: '#000', paddingTop: 10 }}>
                        {addButtonHeading}
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        style={{ marginRight: 15, marginTop: 15, position: 'absolute', top: 0, right: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                {enableAddButton && (
                    <div>
                        <div>
                            <form onSubmit={handleFormSubmit}>
                                <Grid container spacing={2}>

                                    {formFields.map((field) => (
                                        <Grid item xs={field.xs} key={field.name}>
                                            {field.type === 'image' && (
                                                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                                    <div style={{ border: '1px solid #000', borderRadius: '4px', paddingTop: '7.5px', display: 'flex', flexDirection: 'column', alignItems: 'right', height: 'auto' }}>
                                                        <InputLabel
                                                            style={{ backgroundColor: 'rgb(43, 54, 66)', borderRadius: '5px', margin: '0 ', color: focusedField === field.name ? '#000' : '#000000' }}
                                                        >
                                                            {field.label}
                                                        </InputLabel>
                                                        <input
                                                            name={field.name}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                setSelectedImage(e.target.files[0]);
                                                                handleChange(e); // Call the handleChange function separately
                                                            }}
                                                            style={{ display: 'none', }}
                                                            id={`${field.name}-upload-input`}
                                                        />

                                                        <label htmlFor={`${field.name}-upload-input`} style={{ textAlign: 'right', marginRight: '15px' }}>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                component="span"
                                                                style={{ color: '#000', backgroundColor: '#000' }}
                                                            >
                                                                Upload Image
                                                            </Button>
                                                        </label>

                                                        <div className='selectedImage-div' style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', marginTop: '8px', marginRight: '15px' }}>
                                                            {selectedImage && (
                                                                <Typography variant="body2" style={{ color: '#000', display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                                                                    {selectedImage.name}
                                                                </Typography>
                                                            )}
                                                            {formData.errors[field.name] && (
                                                                <Typography variant="body2" style={{ color: 'red', marginTop: '8px' }}>
                                                                    {formData.errors[field.name]}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </div>

                                                </FormControl>
                                            )}
                                            {field.type === 'select' && (
                                                <FormControl style={{  width: '100%', marginBottom: '15px' }}>
                                                    <InputLabel
                                                        style={{ backgroundColor: '#fff', borderRadius: '5px !important', marginLeft: '8px !important', marginRight: '8px !important', color: focusedField === field.name ? '#000' : '#000000', }}>
                                                        {field.label}
                                                    </InputLabel>
                                                    <Select
                                                        className='select-modal'
                                                        style={{
                                                            textAlign: 'left',
                                                            color: '#000', // Change the text color
                                                        }}
                                                        name={field.name}
                                                        value={formData.data[field.name] || ''}
                                                        onChange={handleChange}
                                                        required
                                                        onFocus={() => handleFieldFocus(field.name)}
                                                        onBlur={() => setFocusedField(null)}
                                                    >
                                                        {field.options.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}

                                            {field.type === 'text' && (
                                                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                                    <TextField
                                                        label={field.label}
                                                        name={field.name}
                                                        type={field.type}
                                                        value={formData.data[field.name] || ''}
                                                        onChange={handleChange}
                                                        error={!!formData.errors[field.name]}
                                                        helperText={formData.errors[field.name]}
                                                        fullWidth
                                                        required
                                                        InputLabelProps={{
                                                            style: {
                                                                color: focusedField === field.name ? '#000' : '#000000',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            style: {
                                                                color: '#000',
                                                                borderColor: focusedField === field.name ? '#000' : '#000',
                                                            },
                                                        }}
                                                        onFocus={() => handleFieldFocus(field.name)}
                                                        onBlur={() => setFocusedField(null)}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: focusedField === field.name ? '#000' : '#000',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#000',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#000',
                                                                },
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                color: '#000', // Change the text color
                                                            },
                                                        }}
                                                    />
                                                </FormControl>
                                            )}
                                            {field.type === 'password' && (
                                                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                                    <TextField
                                                        label={field.label}
                                                        name={field.name}
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.data[field.name] || ''}
                                                        onChange={handleChange}
                                                        color="secondary"
                                                        error={!!formData.errors[field.name]}
                                                        helperText={formData.errors[field.name]}
                                                        fullWidth
                                                        required
                                                        InputLabelProps={{
                                                            style: {
                                                                color: focusedField === field.name ? '#000' : '#000000',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            style: {
                                                                color: '#000',
                                                                borderColor: focusedField === field.name ? '#000' : '#000',
                                                            },
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                                        onClick={handlePasswordVisibility}
                                                                        edge="end"
                                                                        style={{ color: focusedField === field.name ? '#000' : '#000' }}
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        onFocus={() => handleFieldFocus(field.name)}
                                                        onBlur={() => setFocusedField(null)}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: focusedField === field.name ? '#000' : '#000',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#000',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#000',
                                                                },
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                color: '#000', // Change the text color
                                                            },
                                                        }}
                                                    />
                                                </FormControl>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    style={{ width: '100%', background: '#1790FF', color: 'white', height: '50px', borderRadius: '15px', marginBottom: 10 }}
                                >
                                    Submit
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
