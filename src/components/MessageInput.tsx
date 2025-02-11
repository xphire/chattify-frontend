import { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { X, Image, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const MessageInput = () => {
	const [text, setText] = useState<string>('');
	const [imagePreview, setImagePreview] = useState<null | string>(null);
	const fileInputRef = useRef(null);
	const { sendMessage } = useChatStore();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;

		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}

		const reader = new FileReader();

        reader.readAsDataURL(file);

		reader.onload = () => {
			const image = reader.result;

			setImagePreview(image as string);
		};
	};

	const removeImage = () => {
		setImagePreview(null);
        //@ts-ignore
		if (fileInputRef.current) fileInputRef.current.value = null;
	};

	const handleSendMessage = async (e: React.ChangeEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(!text.trim() && !imagePreview) return;


		try {

            await sendMessage({
                text : text.trim(),
                image : imagePreview
            })

            setText('')
            setImagePreview(null)
            if(fileInputRef.current) fileInputRef.current = null

		} catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data.message)
                return
                }
                toast.error('message sending failed')
                return

        }
	};

	return (
		<div className='p-4 w-full'>
			{imagePreview && (
				<div className='mb-3 flex items-center gap-2'>
					<div className='relative'>
						<img
							src={imagePreview}
							alt='Preview'
							className='size-20 object-cover rounded-lg border border-zinc-700'
						/>
						<button
							onClick={removeImage}
							className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center'
							type='button'
						>
							<X className='size-3' />
						</button>
					</div>
				</div>
			)}

			<form onSubmit={handleSendMessage} className='flex items-center gap-2'>
				<div className='flex flex-1 gap-2'>
					<input
						type='text'
						className='w-full input input-bordered rounded-lg input-sm sm:input-md'
						placeholder='Type a message...'
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>

					<input
						type='file'
						accept='image/*'
						className='hidden'
						ref={fileInputRef}
						onChange={handleImageChange}
					/>

					<button
						type='button'
						className={`hidden sm:flex btn btn-circle ${
							imagePreview ? 'text-emerald-500' : 'text-zinc-400'
						}`}
						//@ts-ignore
						onClick={() => fileInputRef.current?.click()}
					>
						<Image size={20} />
					</button>
				</div>
				<button
					type='submit'
					className='btn btn-sm btn-circle'
					disabled={!text.trim() && !imagePreview}
				>
					<Send size={22} />
				</button>
			</form>
		</div>
	);
};

export default MessageInput;
