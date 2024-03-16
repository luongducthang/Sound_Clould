'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from "next/link";



interface IPops {
    data: ITrackTop[];
    title: string
}

const MainSlider = (props: IPops) => {
    const { data, title } = props;
    // console.log("check data", props)
    const NextArrow = (props: any) => {
        return (
            <Button color="inherit" variant="contained"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 25,
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >

                <ChevronRightIcon />
            </Button>
        )
    }                             



    const PrevArrow = (props: any) => {
        return (
            <Button color="inherit" variant="contained"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "25%", 
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };



    return (

        <Box // Box này nó giống như 1 thẻ div
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",
                    width:'100px',
                    height:'100px',
                    

                    "img":{
                        width:"150px",
                        height:"150px",
                    }
                },
                "h3": {
                    // padding: "20px",
                }
            }}>

            <h2>{title}</h2>

            <Slider {...settings}>
                {data.map(track => {
                    return (
                        <div className="track" key={track._id}>
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="" />
                            <Link href={`/track/${track._id}?audio=${track.trackUrl}&id=${track._id}`}>
                                <h3>{track.title}</h3>
                                </Link>
                            <p>{track.description}</p>
                        </div>
                    )
                })
                }
            </Slider>
            {/* Divider giống thẻ hr trong html */}
            <Divider />
        </Box>


    );
}

export default MainSlider;