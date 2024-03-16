
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AuthSignIn from '@/components/auth/auth.signin';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


 const SignInPage = async() => {
    const session = await getServerSession(authOptions)

    if (session) { // nế như đã có sesion (tức là người dùng đã đăng nhập thì redirec về trang home)
        redirect("/");
    }
    return (
        <div>
            <AuthSignIn />
        </div>


    )
}

export default SignInPage