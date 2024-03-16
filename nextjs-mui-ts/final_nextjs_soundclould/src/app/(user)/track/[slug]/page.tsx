// khi chưa xác định được router thì không thể tạo foder được nên , phải lấy động bằng dùng foder [slug]
// tham số bên trong props chứa giá trị của router động 

// 'use client'  // đóng k ho render bên client (vì bản next13 hiện tại khi trong client mà hàm để export mà có async thì sẽ bị lỗi là lặp render data vô hạn bên Network)

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
import { useState } from "react";


const DeltailTrackPage = async (props: any) => {
    const { params } = props;
    console.log(params.slug)  // params là giá trị id trên thanh Url


    // const searchParams = useSearchParams() //  useSearchParams là 1 đối tượng để lấy Tham số trên thanh Url
    // const search = searchParams.get('audio')
    // console.log("check search", search);

// const [getComment, setGetComment] = useState([]);

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
    })

    const comment = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId:params.slug,
            sort:"-createdAt" // thêm cái sort:"_createdAt" vào để nó sắp xếp kết quả theo thời gian mà nó được tạo (để comment nó lên đầu)
        }
    })



    return (
        <Container>
            <div>
                <WaveTrack 
                track={res?.data ?? null}
                comment={comment?.data?.result ?? []}  
                />
            </div>

        </Container>

    )
}

export default DeltailTrackPage

//  đây là nội dung bên trong router động
// ({ params }: { params: { slug: string } })