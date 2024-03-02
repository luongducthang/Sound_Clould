// khi chưa xác định được router thì không thể tạo foder được nên , phải lấy động bằng dùng foder [slug]
// tham số bên trong props chứa giá trị của router động 

'use client'

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container  from "@mui/material/Container";
const DeltailTrackPage = (props: any) => {
    const { params } = props;
    
    const searchParams = useSearchParams()
    
    const search = searchParams.get('audio')
    // console.log("check search", search);

    return (
        <Container>
            <div>
                <WaveTrack />
            </div>
        </Container>

    )
}

export default DeltailTrackPage

//  đây là nội dung bên trong router động
// ({ params }: { params: { slug: string } })