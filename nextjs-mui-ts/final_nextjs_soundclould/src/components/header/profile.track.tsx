'use client'
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTrackContext } from '@/lib/track.wrapper';
import { Pause, PauseCircleSharp, PauseTwoTone } from '@mui/icons-material';
import Link from 'next/link';


interface IProfile {
  data: any
}

const ProfileTrack = (props: IProfile) => {
  const { data } = props;
  // console.log(data)
  const theme = useTheme();

  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  // console.log(currentTrack)



  return (
    <Card sx={{
      display: 'flex',
      justifyContent: 'space-between',
      border: '1px solid',
      padding: "10px"
    }}>

      <Box>
        <CardContent>
          <Link style={{ textDecoration: "none", color: "#000" }} href={`/track/${data._id}?audio=${data.trackUrl}&id=${data._id}`}>

            <Typography component="div" variant="h5">
              {data.title}
            </Typography>
          </Link>

          <Typography variant="subtitle1" color="text.secondary" component="div">
            {data.description}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>


          {/* ///////////  Đk    ///////////*/}
          {(data._id !== currentTrack._id || data._id === currentTrack._id && currentTrack.isPlaying === false
          ) &&
            <IconButton
              aria-label="play/pause"
              onClick={() => setCurrentTrack({ ...data, isPlaying: true })}
            >
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
          }

          {data._id === currentTrack._id && currentTrack.isPlaying === true &&
            <IconButton
              aria-label="play/pause"
              onClick={() => setCurrentTrack({ ...data, isPlaying: false })}
            >
              <Pause sx={{ height: 38, width: 38 }} />
            </IconButton>
          }


          {/* {data._id === currentTrack._id && isPlaying === true && <PlayArrowIcon sx={{ height: 38, width: 38 }} />}  */}



          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>

      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={`http://localhost:8000/images/${data.imgUrl}`}
        alt="Live from space album cover"
      />
    </Card>
  );

}


export default ProfileTrack

