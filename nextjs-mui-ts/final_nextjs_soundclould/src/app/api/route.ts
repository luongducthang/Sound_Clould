import { NextRequest, NextResponse } from "next/server";

//  phần này code từ next client chuyển sacng next server 
export async function GET(request: NextRequest, response: NextResponse) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const fileName =  searchParams.get('audio')
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`); 
     // dòng return này là từ next Server gọi đến Backend rồi từ Backend trả về dữ liệu cho Client

}



