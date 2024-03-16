'use client'
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';

import AudioPlayer from 'react-h5-audio-player';

import 'react-h5-audio-player/lib/styles.css';
import { Container } from '@mui/material';
import { useHasMounted } from '../../utils/customHook';
import { useContext, useEffect, useRef } from "react";
import { TrackContext, useTrackContext } from '@/lib/track.wrapper';




export default function AppFooter() {
    const hasMounted = useHasMounted();

    const playerRef = useRef(null);
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    // console.log(currentTrack)

    useEffect(() => {
        //@ts-ignore
        if (currentTrack?.isPlaying === true) {  //  phần code này là ở bên trong thư viện nó cung cấp (lên google search)  "playerRef?.current?.audio?.current?.pause()"
            //@ts-ignore
            playerRef?.current?.audio?.current?.play();
        }
        else if (currentTrack?.isPlaying === false) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.pause();
        }
    }, [currentTrack])


    if (!hasMounted) return (<></>);


    // console.log("check currentTrack", currentTrack);




    return (
        <>
      { currentTrack._id && <div style={{ marginTop: '100px' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{
                top: 'auto',
                bottom: 0,
                display: "flex",
                backgroundColor: '#f2f2f2',
   
            }}>
                <Container sx={{
                    display: "flex",
                    ".rhap_main": {
                        gap: "30px"
                    }
                }}>



                    <AudioPlayer style={{
                        width:'80%'
                    }}
                        ref={playerRef}
                        layout='horizontal-reverse'
                        // autoPlay
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                        // other props here

                        onPlay={(e) => {
                            setCurrentTrack({ ...currentTrack, isPlaying: true })
                        }}
                        onPause={(e) => {
                            setCurrentTrack({ ...currentTrack, isPlaying: false })
                        }}

                    />
                    <div style={{
                        color: '#000',
                        textAlign: 'center',
                        margin:'auto',
                        fontSize:'10px'
                    }}>

                        <div><p style={{ color: '#ccc' ,textOverflow:'ellipsis' }}>{currentTrack.title}</p></div>
                        <div><h3 style={{ color: '#000' ,textOverflow:'ellipsis' }}>{currentTrack.description}</h3></div>
                    </div>
                </Container>
            </AppBar>

        </div>} 
        </>
    );
}