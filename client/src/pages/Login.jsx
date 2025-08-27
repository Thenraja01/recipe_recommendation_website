import {Input} from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BsGithub, BsGoogle } from 'react-icons/bs'

export default function Login() {
  return (
    <div className='w-full h-full m-auto'>
    <form className="grid p-4 mx-10 min-h-full content-center gap-4">  
        <h1 className='text-center font-bold'>Login Page</h1>
        <div className="form-inputs">
        <Label>Name</Label>
        <Input placeholder="enter a name"/>
        </div>

        <div className="form-inputs">
        <Label>Email or Phone Number</Label>
        <Input placeholder="enter a email or number"/>
        </div>

        <div className="form-inputs">
        <Label>Password</Label>
        <Input placeholder="enter a password" type="password" size="md"/>
        </div>
        <Button>Login</Button>
        <div className="">

        <div className="">
            <p className='text-center'>or</p>
            <h2 className='text-nowrap text-center mt-4 font-semibold'>Don't have an account ? <span className='text-blue-600 underline font-semibold '>Create Account</span></h2>
        </div>
        <div className="grid  justify-center gap-4 items-center">
            <p className='mt-4 text-center font-semibold '>Continue With</p>
            <div className="flex gap-x-4">
                <Button className="bg-white  ring ring-gray-800">
                    {/* <img src="./google.png" className='w-4' alt="" /> */}
                <BsGoogle className='text-orange-600'/>
            </Button>
            <Button className="bg-white  ring ring-gray-800">
                <BsGithub className='text-black'/>
            </Button>
            </div>
        </div>
        </div>

    </form>
    </div>
  )
}
