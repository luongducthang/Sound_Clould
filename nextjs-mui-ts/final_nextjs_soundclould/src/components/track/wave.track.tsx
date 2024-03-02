'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveSurferOptions } from "wavesurfer.js";
import { useSearchParams } from 'next/navigation';
import { useWavesurfer } from "@/utils/customHook";
import './wave.scss';
import { Brightness1, Pause, PauseCircle, PauseCircleFilledOutlined, PauseCircleRounded, PlayArrow, PlayArrowTwoTone } from "@mui/icons-material";
import { Play } from "next/font/google";
import { Tooltip } from "@mui/material";



const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const [time, setTime] = useState<string>("0:00")
    const [duration, setDuration] = useState<string>("0:00")

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!




    // : Omit<WaveSurferOptions, 'container' là định dạng trả vể của useMemo
    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient, progressGradient;
        if (typeof window !== "undefined") {

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
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (!wavesurfer) {
            return setIsPlaying(false)
        }



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
    })


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

    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 50,
            user: "username 3",
            content: "just a comment3"
        },
    ]

    const calLeft = (moment: number) => {
        const hardCodeDuration = 199;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }

    return (
        <div className="box-track">

            <div className="title-img">

                <div className="header-leff">
                    <div className="info">
                        <h1 className="name-track back-color">Yop Song's</h1>
                        <span className="name-singer back-color">Thắng</span>
                    </div>
                    <div className="button-play">
                        <button className="play" onClick={() => onPlayClick()}>
                            {isPlaying ? <Pause sx={{ color: 'white', fontSize: '50px', }} /> : <PlayArrow sx={{ color: 'white', fontSize: '50px', }} />}
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <img src="" alt="" className="img-singer" />
                </div>

            </div>



            <div ref={containerRef} className="wave-from-container">
                <div className="time" id="time">{time}</div>
                <div className="duration" id="duration">{duration}</div>
                <div ref={hoverRef} className="hover-wave"></div>
                <div className="overlay"></div>
                <div className="comments">
                    {
                        arrComments.map(item => {
                            return (
                                <Tooltip title={item.content} arrow>
                                    <img
                                        onPointerMove={(e) => {
                                            const hover = hoverRef.current!;
                                            hover.style.width = calLeft(item.moment);
                                        }}
                                        key={item.id}
                                        style={{
                                            height: '20px',
                                            width: '20px',
                                            position: "relative",
                                            top: 97,
                                            zIndex: 30,
                                            left: calLeft(item.moment)
                                        }}
                                        src={`http://localhost:8000/images/chill1.png`} alt="" />
                                </Tooltip>
                            )
                        })
                    }


                </div>
            </div>

        </div>
    )
}

export default WaveTrack








