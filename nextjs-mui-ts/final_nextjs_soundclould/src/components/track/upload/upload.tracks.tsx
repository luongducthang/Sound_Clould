'use client'
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Steps1 from '../steps/steps1';
import Steps2 from '../steps/steps2';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}



const UploadTabs = () => {
    const [value, setValue] = React.useState(0);
    const [trackUpload, setTrackUpload] = React.useState({
        fileName: "",
        percent: 0,
        uploadedTrackName:""
    });
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }


    return (
        <Box sx={{ width: '100%', border:'1px solid #ccc' , mt:"20px"}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Tracks"  disabled={value !== 0}/>
                    <Tab label="Basic Information"  disabled={value !== 1}/>
                </Tabs>
            </Box>


            {/* hàm handleChange nó sẽ chạy tương ứng với index={0} , giá trị của 0 được truyền vào tham số của */}
            <CustomTabPanel value={value} index={0}>
                <Steps1
                    setValue={setValue}
                    setTrackUpload={setTrackUpload}
                    trackUpload={trackUpload}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
               <Steps2 
                    trackUpload={trackUpload}
                    setValue={setValue}
               />
            </CustomTabPanel>
            
        </Box>
    )
}



export default UploadTabs

