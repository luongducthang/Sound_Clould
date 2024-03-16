'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import { useSearchParams } from 'next/navigation';
import { useWavesurfer } from "@/utils/customHook";
import './wave.scss';
import { Pause, PlayArrow } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { fetchDelfaultImage, sendRequest } from "@/utils/api";
import { useTrackContext } from "@/lib/track.wrapper";
import CommentTrack from "./comment.track";



interface IProps {
    track: ITrackTop | null;
    comment: ITrackComment | null;
}

const WaveTrack = (props: IProps) => {
    const { track, comment } = props;

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    console.log(comment)

    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');

    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const [time, setTime] = useState<string>("0:00")
    const [duration, setDuration] = useState<string>("0:00")



    // : Omit<WaveSurferOptions, 'container' là định dạng trả vể của useMemo
    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient, progressGradient;
        if (typeof window !== "undefined") {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 2)!
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color



            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color



        }
        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            // autoplay:true,
            url: `/api?audio=${fileName}`,

        }
    }, []);







    //  phần click để đổi chữ của button
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);
    const [isPlaying, setIsPlaying] = useState<boolean>(false)


    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false)




        // Hover effect
        const hover = hoverRef.current!
        const waveform = containerRef.current!
        //@ts-ignore
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) =>
                setDuration(formatTime(duration))),
            wavesurfer.on('timeupdate', (currentTime) =>
                setTime(formatTime(currentTime))),
            wavesurfer.on('interaction', () =>
                wavesurfer.play())
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])


    //  On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
            setIsPlaying(wavesurfer.isPlaying())
        }
    }, [wavesurfer])



    // Current time & duration

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }



    const calLeft = (moment: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;  // getDuration() là thời gian của cả bài track
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }




    useEffect(() => {
        if (track) {
            setCurrentTrack({ ...currentTrack, isPlaying: false })
        }
    }, [track])




    // logic để làm cho khi play cái wavesurfer thì đưới footer phải dừng và ngược lại (để lúc nào cũng chỉ trông tình trạng phát 1 bài)

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) { // nếu như currentTrack.isPlaying là true tức là bài hát dưới footer đang play thì nút play trên wavesurfer phải dừng 
            wavesurfer?.pause();
        }
    }, [currentTrack])  //  dùng useEffect để quan sát sự thay đổi của một biến số 


    useEffect(() => {
        if (track?._id && !currentTrack._id) {  // nếu như chi vao chi tiết bài nhạc mà chưa click play thì currentTrack chư có dữ liệu thì  cho tạm dừng tất cả không cho chạy 
            setCurrentTrack({ ...track, isPlaying: false })
        }
    }, [track])  //  dùng useEffect để quan sát sự thay đổi của một biến số 

    // useEffect(() => {
    //     if (track?._id !== currentTrack._id) {  // nếu như chi vao chi tiết bài nhạc mà chưa click play thì currentTrack chư có dữ liệu thì  cho tạm dừng tất cả không cho chạy 
    //         setCurrentTrack({ ...track, isPlaying: false })
    //     }
    // }, [currentTrack])  //  dùng useEffect để quan sát sự thay đổi của một biến số 



    return (
        <div className="box-track" >

            <div className="title-img">

                <div className="header-leff" >
                    <div className="info">
                        <h1 className="name-track back-color">{track?.title}</h1>
                        <span className="name-singer back-color">{track?.description}</span>
                    </div>

                    <div className="button-play">
                        <button className="play" onClick={() => {
                            onPlayClick();
                            if (track && wavesurfer) {          //  làm nhầm nhưng viết ra để khi nào cần thì xem : cho thêm wavesurfer.isPlaying() là để bên  app.footer giá trị current sẽ được set ăn theo Component Wavesurfer
                                // setCurrentTrack({ ...track, isPlaying: !wavesurfer.isPlaying() });
                                setCurrentTrack({ ...track, isPlaying: false });
                            }
                        }}>
                            {isPlaying ? <Pause sx={{ color: 'white', fontSize: '50px', }} /> : <PlayArrow sx={{ color: 'white', fontSize: '50px', }} />}
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <img
                        style={{
                            maxWidth: "100%",
                            maxHeight: "200px"
                        }}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                        alt="" className="img-singer"
                    />
                </div>

            </div>




            <div ref={containerRef} className="wave-from-container">
                <div className="time" id="time">{time}</div>
                <div className="duration" id="duration">{duration}</div>
                <div ref={hoverRef} className="hover-wave"></div>
                <div className="overlay"></div>
                <div className="comments">

                    {
                        comment?.map((item: any) => {
                            // console.log(item)

                            return (
                                <Tooltip title={item.content} arrow key={item.id}>
                                    <img
                                        onPointerMove={(e) => {
                                            const hover = hoverRef.current!;
                                            hover.style.width = calLeft(item.moment);
                                        }}
                                        key={item.id}
                                        style={{
                                            height: 20, width: 20,
                                            position: "absolute",
                                            top: 71,
                                            zIndex: 20,
                                            left: calLeft(item.moment)
                                        }}
                                        src={fetchDelfaultImage(item?.user?.type)}
                                        alt="" />
                                </Tooltip>
                            )
                        })



                    }

                </div>
            </div>


            <div>
                <CommentTrack
                    comment={comment}
                    track={track}
                    wavesurfer={wavesurfer}
                />
            </div>

        </div>
    )
}

export default WaveTrack








