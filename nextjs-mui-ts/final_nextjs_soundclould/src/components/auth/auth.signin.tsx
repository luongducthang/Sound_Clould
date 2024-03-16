'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Avatar, Button, Divider, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const AuthSignIn = () => {

    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const [erTextUsername, setTextUsername] = React.useState<string>("");
    const [erTextPassword, setTextPassword] = React.useState<string>("");

    const [erUsername, setErUsername] = React.useState<boolean>(false);
    const [erPassword, setErPassword] = React.useState<boolean>(false);

    const [openMessage, setOpenMessage] = React.useState<boolean>(false)
    const [resMessage, setResMessage] = React.useState<string>("")

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }


    const getData = async () => {
        setErUsername(false);
        setErPassword(false);
        setTextUsername("");
        setTextPassword("");

        if (!username) {
            setErUsername(true);
            setTextUsername("Username is not empty");
            return false;
        }

        else if (!password) {
            setErPassword(true);
            setTextPassword("Password is not empty");
            return false;
        }

        else if (username && password) {
            console.log("Info login", username, password);
        }

        const res = await signIn("credentials", {
            username: username,  //  tham số thứ 2 là truyền đến credentials use và pass  đến Backend
            password: password,
            redirect: false
        })

        console.log("check: ", res);
        if (!res?.error) {
            router.push('/');
        } else {
            setOpenMessage(true);
            setResMessage(res.error)
        }

    }





    return (

        <Box>

            <Grid container
                sx={{
                    backgroundImage: "linear-gradient(to bottom,#ff9aef, #fedac1 , #d5e1cf,#b7e6d9)",
                    transform: 'translateY(30%)',
                    width: '400px',
                    height: '450px',
                    textAlign: 'center',
                    margin: 'auto',
                    boxShadow: '0px 0px 10px',
                    padding: '20px',
                }}>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div>
                        <Link href={"/"}>
                            <ArrowBackIcon sx={{
                                display: 'flex'
                            }} />
                        </Link>
                    </div>

                    <div>
                        <LockPersonRoundedIcon sx={{
                            margin: '10px 0',
                            color: '#fff',
                            backgroundColor: '#ccc',
                            borderRadius: '50%',
                            padding: '5px',
                            fontSize: '40px',
                        }} />
                    </div>


                    <TextField fullWidth label="Username"
                        sx={{
                            margin: '20px 0',
                        }}

                        onKeyDown={(e) => {
                            console.log("check button:", e.key);
                            if (e.key === "Enter") {
                                getData();
                            }
                        }}

                        onChange={(e) => setUsername(e.target.value)}
                        helperText={erTextUsername}
                        error={erUsername}

                    /><br />





                    <TextField

                        onKeyDown={(e) => {
                            // console.log("check button:", e.key);
                            if (e.key === "Enter") {
                                getData();
                            }
                        }}

                        fullWidth
                        label="Password"
                        helperText={erTextPassword}
                        error={erPassword}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword === false ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>

                        }}

                    >
                    </TextField><br />




                    <Button sx={{
                        margin: '20px 0',
                        width: '100%'
                    }}
                        onClick={getData} variant="contained">Login</Button>

                    <div style={{ margin: 'auto' }}><hr />
                        <p style={{
                            transform: 'translateY(-17px)',
                            backgroundColor: '#C6E3D3',
                            width: '70px',
                            margin: 'auto',
                        }}>Or using</p></div>

                    {/* <Divider>Or ussing</Divider> */}
                    <div >

                        <GitHubIcon sx={{
                            padding: "10px",
                            color: '#fff',
                            backgroundColor: 'orange',
                            borderRadius: '50%',
                            paddingBlock: '5px ',
                            margin: '0 5px',
                            cursor: 'pointer',
                            fontSize: '40px',
                        }}

                            onClick={() => {
                                signIn('github')
                            }}
                        />
                        <GoogleIcon sx={{ padding: "10px", color: '#fff', backgroundColor: 'orange', borderRadius: '50%', paddingBlock: '5px ', margin: '0 5px', cursor: 'pointer', fontSize: '40px' }} />
                    </div>

                </Grid>

            </Grid>


            <Snackbar
                open={openMessage}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpenMessage(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {resMessage}
                </Alert>
            </Snackbar>

        </Box >

    );
}



export default AuthSignIn;
