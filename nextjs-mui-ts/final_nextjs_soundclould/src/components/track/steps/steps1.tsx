'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone, FileWithPath } from 'react-dropzone';
import "./theme.css";
import { sendRequest, sendRequestFile } from '@/utils/api';
import { useSession } from "next-auth/react"
import axios from 'axios';

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

function InputFileUpload() {
    return (
        <Button
            onClick={(e) => e.preventDefault()}
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

interface IProps {
    setValue: (v: number) => void;
    setTrackUpload: any;
    trackUpload: any;

}

const Steps1 = (props: IProps) => {
    const { trackUpload } = props;

    const { data: session } = useSession()
    const onDrop = React.useCallback(async (acceptedFiles: FileWithPath[]) => {
        console.log("check", acceptedFiles)

        if (acceptedFiles && acceptedFiles[0]) {
            
            props.setValue(1);

            const audio = acceptedFiles[0];
            console.log(acceptedFiles[0]);
            const formData = new FormData();
            formData.append('fileUpload', audio);  // lấy giá trị của audio truyền vào biến fileUpload và nối thêm để đi cùng với thằng FormData



            try {
                const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData, {

                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                        'target_type': 'tracks',
                        delay: 5000
                    },
                    onUploadProgress: progressEvent => {
                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);

                        props.setTrackUpload({
                            ...trackUpload,
                            fileName: acceptedFiles[0].name,
                            percent: percentCompleted
                        })
                        // console.log("ckeck progress:", percentCompleted)
                    }
                })


// prevState là lấy giá trị của trang thái trước đó (tức là nó sẽ chờ cho setTrackUpload ở trên chạy xong thì nó sẽ copy giá trị state đó ) 
                props.setTrackUpload((prevState: any) => ({
                    ...prevState,
                    uploadedTrackName: res.data.data.fileName
                }))
                // console.log(res.data.data.fileName)
            }

            catch (error) {
                // @ts-ignore
                alert(error?.response?.data?.message)
            }

        }
    }, [session])
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDrop,
        accept: {
            'audio': [".mp3", '.mp4', '.m4a', '.wav'],
        }
    })




    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ))



    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Click hoặc Drop/Drag để upload file ảnh</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Steps1;