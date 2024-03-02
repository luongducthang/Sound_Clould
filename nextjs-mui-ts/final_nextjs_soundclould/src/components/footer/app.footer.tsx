'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';


import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Container } from '@mui/material';
import { useHasMounted } from '../../utils/customHook';


export default function AppFooter() {
    const hasMounted = useHasMounted();

    if (!hasMounted) {
        return (<></>);
    }

    
    // console.log("check backend footer: ", process.env.NEXT_PUBLIC_BACKEND_URL);


    return (
        <div>
            <CssBaseline />
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, display: "flex", backgroundColor: '#f2f2f2' }}>
                <Container sx={{ display: "flex", gap: 10 }}>
                    <AudioPlayer
                        // autoPlay
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                        onPlay={e => console.log("onPlay")}
                    // other props here
                    />
                    <div style={{
                         color: '#000' ,
                         textAlign:'center',
                        width:'100px'
                }}>
                    
                        <div><p style={{color: '#ccc'}}>Name</p></div>
                        <div><h3 style={{color: '#000'}}>Mô tả</h3></div>
                    </div>
                </Container>
            </AppBar>

        </div>
    );
}