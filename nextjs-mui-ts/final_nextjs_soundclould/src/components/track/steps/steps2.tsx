'use client'
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, MenuItem, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useToast } from '../../../utils/toast';




// Thanh tiến trình

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel(props: IProps) {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.trackUpload.percent} />
        </Box>
    );
}


//  Upload file

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload(props: any) {
    const { setInfo, info } = props;
    const { data: session } = useSession()
    const toast = useToast()
    const handleUpload = async (image: any) => {
        const formData = new FormData();
        formData.append('fileUpload', image);  // lấy giá trị của audio truyền vào biến fileUpload và nối thêm để đi cùng với thằng FormData

        try {
            const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData, {

                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    'target_type': 'images',
                }

            })
            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })

        }

        catch (error) {
            // @ts-ignore

            alert(error?.response?.data?.message)
        }
    }
    return (
        <Button
            onChange={(e) => {
                const event = e.target as HTMLInputElement;
                if (event.files) {
                    handleUpload(event.files[0])
                    console.log("check file: ", event.files[0])
                }
            }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}



//  Button

function BasicButtons() {
    return (
        <Stack spacing={2} direction="row">
            <Button variant="outlined" onClick={() => { }}>Save</Button>
        </Stack>
    );
}



const category = [
    {
        value: 'CHILL',
        label: 'CHILL'
    },
    {
        value: 'WORHOUT',
        label: 'WORHOUT'
    },
    {
        value: 'PARTY',
        label: 'PARTY'
    },
]

interface IProps {
    trackUpload: {
        fileName: string,
        uploadedTrackName: string,
        percent: number
    }

    setValue: (num: number) => void;
}


interface INewTracks {
    title: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string
}





/////////////////////////////////////////////////////////

const Steps2 = (props: IProps) => {
    const { data: session } = useSession()

    const { trackUpload, setValue } = props;
    const toast = useToast()
    const [info, setInfo] = React.useState<INewTracks>({
        title: "",
        description: "",
        trackUrl: "",
        imgUrl: "",
        category: "",
    });
    console.log("check trackUpload:", trackUpload)


    React.useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
        }
    }, [trackUpload])


    const handleSubmitForm = async () => {
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: "http://localhost:8000/api/v1/tracks",
            method: "POST",
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })

        if (res.data) {
            setValue(0)
            toast.success("Create success a new track")

        } else {
            toast.error(res.message)
        }

    }



    return (
        <div>
            <p>{trackUpload.fileName}</p>
            <LinearWithValueLabel
                trackUpload={trackUpload}
                setValue={setValue}

            />

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <div style={{
                        textAlign: 'center'
                    }}>
                        <div className="img" style={{
                            width: '300px',
                            height: '300px',
                            backgroundColor: '#ccc',
                            margin: '20px auto',
                        }}>
                            {info.imgUrl &&
                                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} style={{ width: "100%", height: "100%" }} />}
                        </div>



                        {/* Button Upload */}
                        <InputFileUpload
                            setInfo={setInfo}
                            info={info}
                        />
                    </div>
                </Grid>

                <Grid item xs={12} md={8}>
                    <div style={{
                        lineHeight: '6'
                    }}>
                        <TextField
                            value={info?.title}
                            onChange={(e) => setInfo({
                                ...info,
                                title: e.target.value
                            })}
                            label="Title"
                            variant='standard'
                            fullWidth
                            margin='dense'
                        />

                        <TextField
                            value={info?.description}
                            onChange={(e) => setInfo({
                                ...info,
                                description: e.target.value
                            })}
                            label="Description"
                            variant='standard'
                            fullWidth
                            margin='dense' />

                        <TextField
                            value={info?.category}
                            onChange={(e) => setInfo({
                                ...info,
                                category: e.target.value
                            })}
                            label="Category"
                            select
                            defaultValue="EUR"
                            variant='standard'
                            fullWidth
                            margin='dense'
                        >
                            {category.map((ct) => (
                                <MenuItem key={ct.value} value={ct.value}>
                                    {ct.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            variant="outlined"

                            onClick={(e) => {
                                handleSubmitForm();
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Steps2;