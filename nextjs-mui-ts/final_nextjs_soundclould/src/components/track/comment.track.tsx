'use client'
import { fetchDelfaultImage, sendRequest } from "@/utils/api"
import { Grid, TextField } from "@mui/material"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import WaveSurfer from "wavesurfer.js";
dayjs.extend(relativeTime)



interface IComment {
    comments: ITrackComment;
    track: ITrackTop | null;
    wavesurfer: WaveSurfer | null;
}


const CommentTrack = (props: IComment) => {
    const router = useRouter()
    const { data: session } = useSession()

    const { comment, track, wavesurfer } = props;

    // console.log("check comment", comment)
    // console.log("check track", track)


    const [yourComment, setYourComment] = useState('')


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }
 

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration(); 
            wavesurfer.seekTo(moment / duration); //  phương thức seekTo sử dụng để di chuyển đến một thời điểm cụ thể trong tệp âm thanh hoặc video mà bạn đang phát ,,, phương thức seekTo này được gọi, thanh trượt của WaveSurfer sẽ di chuyển đến vị trí tương ứng
            wavesurfer.play();
        }
    }


    const handleComment = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: "http://localhost:8000/api/v1/comments",
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),  // getCurrentTime()  lấy thời gian hiện tại bài hat ddang chạy track và trả về số thập phân,  Math.round làm tròn số thập phân
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })


        if (res?.data) {
            setYourComment('')
            router.refresh();
        }
    }




    return (
        <>
            <div>
                {session?.user &&
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label="Comment"
                        variant="standard"
                        value={yourComment}
                        onChange={(e) => setYourComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleComment();
                            }
                        }}
                        style={{
                            margin:'20px 0'
                        }}
                    />}





                <Grid container>
                    <div className="content" style={{
                        margin: "0px 0px 100px 0",
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                    }}>
                        <Grid item xs={12} sm={4} md={2} xl={2}>
                            <div className="content-left" style={{
                                textAlign: 'center'

                            }}>
                                <img
                                    src={fetchDelfaultImage(comment?.user?.type)}
                                    alt=""
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                    }}
                                />
                                <p>{track?.uploader.email}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={8} md={10} xl={10}>
                            <div className="content-right"
                                style={{
                                    width: '100%'
                                }}>
                                {
                                    comment.map(item => {
                                        // console.log(item)
                                        return (
                                            <>
                                                <div key={item._id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <div className="info" style={{
                                                        display: 'flex',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <div className="img-info" style={{
                                                            marginRight: '10px'
                                                        }}>
                                                            <img
                                                                src={fetchDelfaultImage(item?.user?.type)}
                                                                alt=""
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px"
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="content-info">
                                                            <div className="item-left">
                                                                <p style={{  margin: '0' , color:'#838181' }}>{item?.user?.email} at
                                                                    <span style={{ cursor: "pointer" }}
                                                                        onClick={() => handleJumpTrack(item.moment)}
                                                                    >
                                                                        &nbsp; {formatTime(item.moment)}
                                                                    </span>
                                                                </p>
                                                                
                                                                <p className="comment" style={{
                                                                    margin: '0'
                                                                }}>
                                                                    {item.content}
                                                                </p>
                                                            </div>

                                                        </div>


                                                    </div>


                                                    <div className="time">
                                                        <span style={{
                                                            color: '#ccc'
                                                        }}
                                                        >
                                                            {dayjs(item.createdAt).fromNow()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </Grid>

                    </div>
                </Grid>

            </div>
        </>
    )
}

export default CommentTrack