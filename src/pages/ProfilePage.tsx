import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
	const [selectedImage, setSelectedImage] = useState<null | string>(null);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const files = e.target.files;

			if (!files || files.length == 0) return;

			const file = files[0];

			const reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = async () => {
				try {
					const base64Image = reader.result;

					setSelectedImage(base64Image as string);

					await updateProfile(base64Image as string);

          			toast.success('profile image updated successfully')

				} catch (error) {
					if(error instanceof AxiosError){
                    toast.error(error.response?.data.message)
					return
				    }
					toast.error('failed to upload image')
					return
			   }
			};
		} catch (error) {
      console.log('error in image upload', error)
      if(error instanceof AxiosError){
         toast.error(error.response?.data.message)
         return
      }
      toast.error('failed to upload image')
      return 
    }
	};

	return (
		<div className='h-screen pt-20'>
			<div className='max-w-2xl mx-auto p-4 py-8'>
				<div className='bg-base-300 rounded-xl p-6 space-y-8'>
					<div className='text-center'>
						<h1 className='text-2xl font-semibold'>Profile</h1>
						<p className='mt-2'>Your profile information</p>
					</div>
					{/* Avatar upload section */}
					<div className='flex flex-col items-center gap-4'>
						<div className='relative'>
							<img
								src={selectedImage || authUser?.profilePic || '/avatar.png'}
								alt='Profile Picture'
								className='size-32 rounded-full object-cover border-4'
							/>
							<label
								htmlFor='avatar-upload'
								className={`absolute bottom-0 right-0
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                ${
									isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''
								}`}
							>
								<Camera className='w-5 h-5 text-base-200' />
								<input
									type='file'
									id='avatar-upload'
									className='hidden'
									accept='image/*'
									onChange={handleImageUpload}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
						<p className='text-sm text-zinc-400'>
							{isUpdatingProfile
								? 'Uploading...'
								: 'Click the camera icon to update your photo'}
						</p>
					</div>
					<div className='space-y-6'>
						<div className='space-y-1 5'>
							<div className='text-sm text-zinc-400 flex items-center gap-2'>
								<User className='w-4 h-4' />
								Full Name
							</div>
							<p className='px-4 py-2 5 bg-base-200 rounded-lg border'>
								{authUser?.firstName} {authUser?.lastName}
							</p>
						</div>
					</div>
					<div className='space-y-6'>
						<div className='space-y-1 5'>
							<div className='text-sm text-zinc-400 flex items-center gap-2'>
								<Mail className='w-4 h-4' />
								Email Address
							</div>
							<p className='px-4 py-2 5 bg-base-200 rounded-lg border'>
								{authUser?.email}
							</p>
						</div>
					</div>
					<div className='mt-6 bg-base-300 rounded-xl p-6'>
						<h2 className='text-lg font-medium mb-4'>Account Information</h2>
						<div className='space-y-3 text-sm'>
							<div className='flex items-center justify-between py-2 border-b border-zinc-700'>
								<span>Member Since</span>
								<span>{authUser?.createdAt.split('T')[0]}</span>
							</div>
							<div className='flex items-center justify-between py-2'>
								<span>Account Status</span>
								<span className='text-green-500'>Active</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
