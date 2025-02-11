import { FormEvent, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import {
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	MessageSquare,
	User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export type SignUpFormData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

const SignUpPage = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [formData, setFormData] = useState<SignUpFormData>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	});

	const { signup, isSigningUp } = useAuthStore();

	const navigate = useNavigate();

	const validateForm = ({
		firstName,
		lastName,
		email,
		password,
	}: SignUpFormData): boolean | string => {
		if (!firstName) {
			return toast.error('First Name is required');
		}

		if (!lastName) {
			return toast.error('Last Name is required');
		}

		if (!email) {
			return toast.error('Email is required');
		}

		if (!password) {
			return toast.error('password is required');
		}

		if (password.length < 6) {
			return toast.error('password should be at least 6 characters');
		}

		return true;
	};

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			const validationResult = validateForm(formData);

			if (validationResult === true) {
				await signup(formData);
				toast.success('Account successfully created');
				navigate('/', {
					replace: true,
				});
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
				return;
			}
			toast.error(`Account creation failed, please try again later`);
		}
	};

	return (
		<div className='min-h-screen grid md:grid-cols-2'>
			{/*let side of form */}
			<div className='flex flex-col justify-center items-center p-6 sm:p-12'>
				<div className='w-full max-w-md space-y-8'>
					{/* LOGO */}
					<div className='text-center mb-8'>
						<div className='flex flex-col items-center gap-2 group'>
							<div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
								<MessageSquare className='size-6 text-primary' />
							</div>
							<h1 className='text-2xl font-bold mt-2'>Create Account</h1>
							<p className='text-base-content/60'>
								Get started with your free account
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text font-medium'>First Name</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='size-5 text-base-content/40' />
								</div>
								<input
									type='text'
									placeholder='enter first name here'
									className={`input input-bordered w-full pl-10`}
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
								/>
							</div>
						</div>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text font-medium'>Last Name</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='size-5 text-base-content/40' />
								</div>
								<input
									type='text'
									placeholder='enter last name here'
									className={`input input-bordered w-full pl-10`}
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
								/>
							</div>
						</div>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text font-medium'>Email</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='size-5 text-base-content/40' />
								</div>
								<input
									type='email'
									placeholder='enter email address here'
									className={`input input-bordered w-full pl-10`}
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
						</div>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text font-medium'>Password</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='size-5 text-base-content/40' />
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder='enter password here'
									className={`input input-bordered w-full pl-10`}
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
								/>
								<button
									type='button'
									className='absolute inset-y-0 right-0 pr-3 flex items-center'
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className='size-5 text-base-content/40' />
									) : (
										<Eye className='size-5 text-base-content/40' />
									)}
								</button>
							</div>
						</div>
						<button
							type='submit'
							className='btn btn-primary w-full'
							disabled={isSigningUp}
						>
							{isSigningUp ? (
								<>
									<Loader2 className='size-5 animate-spin' />
									Loading...
								</>
							) : (
								'Create Account'
							)}
						</button>
					</form>

					<div className='text-center'>
						<p className='text-base-content/60'>
							Already have an account?
							<Link to='/login' className='link link-primary'>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
			{/* right hand side */}
			<AuthImagePattern
				title='Join our community'
				subtitle='Connect with friends, share moments, and stay in touch with your loved ones.'
			/>
		</div>
	);
};

export default SignUpPage;
