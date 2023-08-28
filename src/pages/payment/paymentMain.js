import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddTaskTwoToneIcon from '@mui/icons-material/AddTaskTwoTone';
import AddToDriveTwoToneIcon from '@mui/icons-material/AddToDriveTwoTone';

import Payment from './Payment';
import CompletedPayment from './completedPayment';
import ConfirmedPayment from './ConfirmedPayment';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1890ff',
    },
    text: {
      secondary: '#000',
    },
  },
});

export default function Payments() {
  const [value, setValue] = React.useState('1');

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const storedValue = localStorage.getItem('selectedTab');
    if (storedValue) {
      setValue(storedValue);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('selectedTab', value);
  }, [value]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value} centered>
          {/* TabList with tabs */}
          <TabList onChange={handleTabChange}>
            <Tab
              label="Pending Payments"
              value="1" // Make sure this matches TabPanel value
              sx={{ '&.Mui-selected': { color: theme.palette.primary.main }, '&.Mui-selected .MuiTabIcon-root': { color: theme.palette.primary.main } }}
            />
            <Tab
              label="Customer Confirmed Payments"
              value="2" // Make sure this matches TabPanel value
              sx={{ '&.Mui-selected': { color: theme.palette.primary.main }, '&.Mui-selected .MuiTabIcon-root': { color: theme.palette.primary.main } }}
            />
            <Tab
              label="Completed Payments"
              value="3" // Make sure this matches TabPanel value
              sx={{ '&.Mui-selected': { color: theme.palette.primary.main }, '&.Mui-selected .MuiTabIcon-root': { color: theme.palette.primary.main } }}
            />
          </TabList>

          {/* TabPanels */}
          <TabPanel value="1" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}><Payment /></TabPanel>
          <TabPanel value="2" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}><ConfirmedPayment /></TabPanel>
          <TabPanel value="3" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}><CompletedPayment /></TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
}
