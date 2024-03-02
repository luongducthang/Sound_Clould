import BottomAppBar from "@/components/footer/app.footer";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export default async function HomePage() {   // async là chỉ được dùng trong NEXTJS
  const session = await getServerSession(authOptions)
  console.log("check sesion server: " , session)
  //   const res = await fetch("http://localhost:8000/api/v1/tracks/top", {
  //     method:"POST",
  //     headers:{
  //       "Content-Type": "application/json",

  //     },
  //      body:JSON.stringify({
  //       category: "CHILL",
  //       limit:10
  //      })
  //   });

  // console.log('check res:' , await res.json())

  // interface IUser{   //  interface IUser là dùng để mô tả hình thù data (để ràng buộc generic và khi dùng biến hàm . và tab ra nó sẽ gợi ý)
  //   name:string,
  //   age:number,
  // }

  const chill = await sendRequest<IBackendRes<ITrackTop[]>>({  //  cho thêm [] nghĩa là data là 1 array
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10
    }
  })


  const workout = await sendRequest<IBackendRes<ITrackTop[]>>({  //  cho thêm [] nghĩa là data là 1 array
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10
    }
  })


  const party = await sendRequest<IBackendRes<ITrackTop[]>>({  //  cho thêm [] nghĩa là data là 1 array
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10
    }
  })





  // console.log("check res TS",res.data[0]._id)
  return (
    <div>
      <Container>


        <MainSlider
          title={"Top Chill"}
          data={chill?.data ?? []} // chill?.data sẽ trả về undefined nếu biến chill không tồn tại hoặc không có thuộc tính data 
        // (toán tử nullish ?? lấy giá trị bên trái có giá trị là null hoặc undefile thì nó sẽ return ra giá trị bên phải )
        />
        <MainSlider
          title={"Top Workouts"}
          data={workout?.data ?? []}

        />
        <MainSlider
          title={"Top Party"}
          data={party?.data ?? []}

        />



      </Container>
    </div>
  );
}
