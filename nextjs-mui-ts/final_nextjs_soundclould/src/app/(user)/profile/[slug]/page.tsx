import ProfileTrack from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api"
import { Container, Grid } from "@mui/material"

const ProfilePage = async ({ params }: { params: { slug: string } }) => {

    const track = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({  //  cho thêm [] nghĩa là data là 1 array
        url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
        method: "POST",
        body: {
            id: params.slug
        }
    })

    const data = track?.data?.result ?? [];

    console.log("check track:", track)
    return (
        <Container>
            <Grid container >
                <Grid spacing={9} xs={12} md={12} xl={12} sx={{
                    display: 'flex',
                    flexWrap: 'wrap',                    
                }}>
                    {data.map((item: ITrackTop, index: number) => {
                        return (
                            <Grid xs={12} md={6} xl={6} key={index} sx={{
                                padding:"10px 10px",

                            }}>
                                <ProfileTrack data={item} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
            {/* Profile Page slug {params.slug} */}
        </Container>
    )
}

export default ProfilePage