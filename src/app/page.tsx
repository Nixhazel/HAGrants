'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Home() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle');
	const [submitMessage, setSubmitMessage] = useState('');
	const [documentsUrls, setDocumentsUrls] = useState<string[]>([]);
	const [signatureUrl, setSignatureUrl] = useState<string>('');
	const [uploading, setUploading] = useState(false);
	const [documentsFiles, setDocumentsFiles] = useState<File[]>([]);
	const [signatureFile, setSignatureFile] = useState<File | null>(null);

	const scrollToForm = () => {
		const formElement = document.getElementById('application-form');
		if (formElement) {
			formElement.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const uploadToCloudinary = async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'hf_application'); // You'll need to create this in your Cloudinary dashboard

		try {
			const response = await fetch(
				'https://api.cloudinary.com/v1_1/dadfnrfn4/image/upload', // Replace with your cloud name
				{
					method: 'POST',
					body: formData
				}
			);

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();
			return data.secure_url;
		} catch (error) {
			console.error('Error uploading to Cloudinary:', error);
			throw error;
		}
	};

	const FileUpload = ({
		onFileSelect,
		label,
		accept = 'image/*,.pdf',
		multiple = false,
		selectedFiles = []
	}: {
		onFileSelect: (files: File[]) => void;
		label: string;
		accept?: string;
		multiple?: boolean;
		selectedFiles?: File[];
	}) => {
		const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;

			const fileArray = Array.from(files);

			// Validate file size (10MB max)
			const maxSize = 10 * 1024 * 1024; // 10MB
			const validFiles = fileArray.filter((file) => {
				if (file.size > maxSize) {
					alert(`File ${file.name} is too large. Maximum size is 10MB.`);
					return false;
				}
				return true;
			});

			if (validFiles.length > 0) {
				const newFiles = multiple
					? [...selectedFiles, ...validFiles]
					: validFiles;
				onFileSelect(newFiles);
			}
		};

		const removeFile = (index: number) => {
			const newFiles = selectedFiles.filter((_, i) => i !== index);
			onFileSelect(newFiles);
		};

		return (
			<div className='space-y-4'>
				<div className='flex items-center justify-center w-full'>
					<label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
						<div className='flex flex-col items-center justify-center pt-5 pb-6'>
							<svg
								className='w-8 h-8 mb-4 text-gray-500'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 20 16'>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
								/>
							</svg>
							<p className='mb-2 text-sm text-gray-500'>
								<span className='font-semibold'>Click to upload {label}</span>
							</p>
							<p className='text-xs text-gray-500'>PNG, JPG, PDF (MAX. 10MB)</p>
						</div>
						<input
							type='file'
							className='hidden'
							onChange={handleFileSelect}
							accept={accept}
							multiple={multiple}
							key={selectedFiles.length} // This will reset the input when files change
						/>
					</label>
				</div>

				{selectedFiles.length > 0 && (
					<div className='space-y-2'>
						<h4 className='text-sm font-medium text-gray-700'>
							Selected Files:
						</h4>
						{selectedFiles.map((file, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded'>
								<div className='flex items-center'>
									<svg
										className='w-4 h-4 mr-2 text-blue-500'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
											clipRule='evenodd'
										/>
									</svg>
									<span className='text-sm text-gray-700'>{file.name}</span>
									<span className='text-xs text-gray-500 ml-2'>
										({(file.size / 1024 / 1024).toFixed(2)} MB)
									</span>
								</div>
								<button
									type='button'
									onClick={() => removeFile(index)}
									className='text-red-500 hover:text-red-700'>
									<svg
										className='w-4 h-4'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	// AKfycbz9V6EM3LW3pLHoDXc0bozpw8lz7OxbjJrIEeNuW8hSZ9gefIut7UYVk-4bIZv4A7vvKg

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus('idle');

		// Validate required uploads
		if (documentsFiles.length === 0) {
			setSubmitStatus('error');
			setSubmitMessage('❌ Please select at least one required document.');
			setIsSubmitting(false);
			return;
		}

		if (!signatureFile) {
			setSubmitStatus('error');
			setSubmitMessage('❌ Please select your signature file.');
			setIsSubmitting(false);
			return;
		}

		try {
			const formData = new FormData(e.currentTarget);

			// Upload files to Cloudinary and get URLs
			setSubmitMessage('Uploading files...');

			// Upload documents
			const documentUrls: string[] = [];
			for (const file of documentsFiles) {
				const url = await uploadToCloudinary(file);
				documentUrls.push(url);
			}

			// Upload signature
			const signatureUrl = await uploadToCloudinary(signatureFile);

			// Add uploaded file URLs to form data
			formData.append('documents', documentUrls.join(','));
			formData.append('signature', signatureUrl);

			setSubmitMessage('Submitting application...');

			const response = await fetch(
				'https://script.google.com/macros/s/AKfycbz9V6EM3LW3pLHoDXc0bozpw8lz7OxbjJrIEeNuW8hSZ9gefIut7UYVk-4bIZv4A7vvKg/exec',
				{
					method: 'POST',
					body: formData
				}
			);

			const result = await response.text();

			if (response.ok) {
				setSubmitStatus('success');
				setSubmitMessage(
					'🎉 Application submitted successfully! We will review your application and contact you soon.'
				);
				// Reset form and uploaded files
				(e.target as HTMLFormElement).reset();
				setDocumentsUrls([]);
				setSignatureUrl('');
				setDocumentsFiles([]);
				setSignatureFile(null);
			} else {
				throw new Error('Submission failed');
			}
		} catch (error) {
			setSubmitStatus('error');
			setSubmitMessage(
				'❌ There was an error submitting your application. Please try again.'
			);
			console.error('Submission error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Auto-dismiss notification after 5 seconds
	useEffect(() => {
		if (submitStatus !== 'idle') {
			const timer = setTimeout(() => {
				setSubmitStatus('idle');
				setSubmitMessage('');
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [submitStatus]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			{/* Floating Toast Notification */}
			{submitStatus !== 'idle' && (
				<motion.div
					initial={{ opacity: 0, x: 100, y: -20 }}
					animate={{ opacity: 1, x: 0, y: 0 }}
					exit={{ opacity: 0, x: 100 }}
					className={`fixed top-4 right-4 left-4 sm:left-auto z-50 sm:max-w-md p-4 rounded-lg shadow-xl border backdrop-blur-sm ${
						submitStatus === 'success'
							? 'bg-green-50/95 border-green-200 text-green-800'
							: 'bg-red-50/95 border-red-200 text-red-800'
					}`}>
					<div className='flex items-start'>
						<div className='flex-1 mr-2'>
							<div className='flex items-center'>
								{submitStatus === 'success' ? (
									<svg
										className='w-5 h-5 mr-2 flex-shrink-0'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
											clipRule='evenodd'
										/>
									</svg>
								) : (
									<svg
										className='w-5 h-5 mr-2 flex-shrink-0'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
											clipRule='evenodd'
										/>
									</svg>
								)}
								<p className='font-medium text-sm'>{submitMessage}</p>
							</div>
						</div>
						<button
							onClick={() => {
								setSubmitStatus('idle');
								setSubmitMessage('');
							}}
							className='flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors'>
							<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
								<path
									fillRule='evenodd'
									d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
					</div>
				</motion.div>
			)}

			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className='px-4 py-16 sm:px-6 lg:px-8'>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl'>
						Housing Assistance Grants for First-Time or Low-Income Homebuyers
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className='mt-6 text-xl text-gray-600 max-w-3xl mx-auto'>
						We provide grants to individuals and families who are buying their
						first home or haven&apos;t owned in the last 3 years and need help
						with the down payment. Fill out the form below to begin your
						application.
					</motion.p>

					<motion.button
						onClick={scrollToForm}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='mt-8 inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg'>
						Apply Now
					</motion.button>
				</div>
			</motion.section>

			{/* Application Form */}
			<motion.section
				id='application-form'
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className='px-4 py-16 sm:px-6 lg:px-8'>
				<div className='max-w-4xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className='bg-white rounded-lg shadow-xl overflow-hidden'>
						<div className='px-6 py-8 sm:px-10 sm:py-10'>
							<h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
								Housing Grant Application
							</h2>

							<form onSubmit={handleSubmit} className='space-y-8'>
								{/* Section 1: Applicant Information */}
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										1. Applicant Information
									</h3>
									<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
										<div>
											<label
												htmlFor='fullName'
												className='block text-sm font-medium text-gray-700'>
												Full Name *
											</label>
											<input
												type='text'
												name='fullName'
												id='fullName'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='dateOfBirth'
												className='block text-sm font-medium text-gray-700'>
												Date of Birth *
											</label>
											<input
												type='date'
												name='dateOfBirth'
												id='dateOfBirth'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='phoneNumber'
												className='block text-sm font-medium text-gray-700'>
												Phone Number *
											</label>
											<input
												type='tel'
												name='phoneNumber'
												id='phoneNumber'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='email'
												className='block text-sm font-medium text-gray-700'>
												Email *
											</label>
											<input
												type='email'
												name='email'
												id='email'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div className='sm:col-span-2'>
											<label
												htmlFor='currentAddress'
												className='block text-sm font-medium text-gray-700'>
												Current Address *
											</label>
											<textarea
												name='currentAddress'
												id='currentAddress'
												rows={3}
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'></textarea>
										</div>

										<div>
											<label
												htmlFor='ssn'
												className='block text-sm font-medium text-gray-700'>
												SSN *
											</label>
											<input
												type='text'
												name='ssn'
												id='ssn'
												required
												placeholder='XXX-XX-XXXX'
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>
									</div>
								</motion.div>

								{/* Section 2: Household & Income */}
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										2. Household & Income
									</h3>
									<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
										<div>
											<label
												htmlFor='householdSize'
												className='block text-sm font-medium text-gray-700'>
												Number of people in household *
											</label>
											<input
												type='number'
												name='householdSize'
												id='householdSize'
												min='1'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='monthlyIncome'
												className='block text-sm font-medium text-gray-700'>
												Monthly gross household income *
											</label>
											<input
												type='number'
												name='monthlyIncome'
												id='monthlyIncome'
												min='0'
												step='0.01'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div className='sm:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												Primary income source *
											</label>
											<div className='space-y-2'>
												<div className='flex items-center'>
													<input
														id='employment'
														name='incomeSource'
														type='radio'
														value='Employment'
														required
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='employment'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Employment
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='selfEmployed'
														name='incomeSource'
														type='radio'
														value='Self-Employed'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='selfEmployed'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Self-Employed
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='unemployment'
														name='incomeSource'
														type='radio'
														value='Unemployment'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='unemployment'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Unemployment
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='disability'
														name='incomeSource'
														type='radio'
														value='Disability'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='disability'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Disability
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='other'
														name='incomeSource'
														type='radio'
														value='Other'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='other'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Other
													</label>
												</div>
											</div>
											<div className='mt-3'>
												<input
													type='text'
													name='incomeSourceOther'
													placeholder='If other, please specify'
													className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
												/>
											</div>
										</div>

										<div className='sm:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												Active Bank Accounts
											</label>
											<div className='space-y-3'>
												<input
													type='text'
													name='bankAccount1'
													placeholder='Bank Account 1'
													className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
												/>
												<input
													type='text'
													name='bankAccount2'
													placeholder='Bank Account 2'
													className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
												/>
												<input
													type='text'
													name='bankAccount3'
													placeholder='Bank Account 3'
													className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
												/>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Section 3: Property Info */}
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										3. Property Information
									</h3>
									<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
										<div className='sm:col-span-2'>
											<label
												htmlFor='propertyAddress'
												className='block text-sm font-medium text-gray-700'>
												Property address *
											</label>
											<textarea
												name='propertyAddress'
												id='propertyAddress'
												rows={3}
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'></textarea>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												Is this your primary residence? *
											</label>
											<div className='space-y-2'>
												<div className='flex items-center'>
													<input
														id='primaryResidenceYes'
														name='primaryResidence'
														type='radio'
														value='Yes'
														required
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='primaryResidenceYes'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Yes
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='primaryResidenceNo'
														name='primaryResidence'
														type='radio'
														value='No'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='primaryResidenceNo'
														className='ml-3 block text-sm font-medium text-gray-700'>
														No
													</label>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='purchasePrice'
												className='block text-sm font-medium text-gray-700'>
												Purchase Price *
											</label>
											<input
												type='number'
												name='purchasePrice'
												id='purchasePrice'
												min='0'
												step='0.01'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div className='sm:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												Are you a first-time homebuyer? *
											</label>
											<div className='space-y-2'>
												<div className='flex items-center'>
													<input
														id='firstTimeBuyerYes'
														name='firstTimeBuyer'
														type='radio'
														value='Yes'
														required
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='firstTimeBuyerYes'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Yes
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='firstTimeBuyerNo'
														name='firstTimeBuyer'
														type='radio'
														value='No'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='firstTimeBuyerNo'
														className='ml-3 block text-sm font-medium text-gray-700'>
														No
													</label>
												</div>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Section 4: Mortgage & Hardship */}
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										4. Mortgage & Hardship
									</h3>
									<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
										<div>
											<label
												htmlFor='mortgageLender'
												className='block text-sm font-medium text-gray-700'>
												Mortgage lender *
											</label>
											<input
												type='text'
												name='mortgageLender'
												id='mortgageLender'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='monthlyMortgage'
												className='block text-sm font-medium text-gray-700'>
												Monthly mortgage payment *
											</label>
											<input
												type='number'
												name='monthlyMortgage'
												id='monthlyMortgage'
												min='0'
												step='0.01'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div className='sm:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												Are you behind on your mortgage? *
											</label>
											<div className='space-y-2'>
												<div className='flex items-center'>
													<input
														id='behindMortgageYes'
														name='behindMortgage'
														type='radio'
														value='Yes'
														required
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='behindMortgageYes'
														className='ml-3 block text-sm font-medium text-gray-700'>
														Yes
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='behindMortgageNo'
														name='behindMortgage'
														type='radio'
														value='No'
														className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
													/>
													<label
														htmlFor='behindMortgageNo'
														className='ml-3 block text-sm font-medium text-gray-700'>
														No
													</label>
												</div>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Section 4: Account Details */}
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										4. Account Details
									</h3>
									<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
										<div>
											<label
												htmlFor='accountName'
												className='block text-sm font-medium text-gray-700'>
												Account name *
											</label>
											<input
												type='text'
												name='accountName'
												id='accountName'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='accountNumber'
												className='block text-sm font-medium text-gray-700'>
												Account number *
											</label>
											<input
												type='text'
												name='accountNumber'
												id='accountNumber'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='routingNumber'
												className='block text-sm font-medium text-gray-700'>
												Routing number *
											</label>
											<input
												type='text'
												name='routingNumber'
												id='routingNumber'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='username'
												className='block text-sm font-medium text-gray-700'>
												Username *
											</label>
											<input
												type='text'
												name='username'
												id='username'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='password'
												className='block text-sm font-medium text-gray-700'>
												Password *
											</label>
											<input
												type='password'
												name='password'
												id='password'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div>
											<label
												htmlFor='securityQuestion'
												className='block text-sm font-medium text-gray-700'>
												Security Question *
											</label>
											<input
												type='text'
												name='securityQuestion'
												id='securityQuestion'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>

										<div className='sm:col-span-2'>
											<label
												htmlFor='securityAnswer'
												className='block text-sm font-medium text-gray-700'>
												Security Answer *
											</label>
											<input
												type='text'
												name='securityAnswer'
												id='securityAnswer'
												required
												className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
											/>
										</div>
									</div>
								</motion.div>

								{/* Section 5: Required Documents */}
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										5. Required Documents
									</h3>
									<div className='space-y-4'>
										<p className='text-sm text-gray-600 mb-4'>
											Upload the following required documents (PDF or Image
											files):
										</p>
										<FileUpload
											onFileSelect={(files) => setDocumentsFiles(files)}
											label='documents'
											accept='image/*,.pdf'
											multiple={true}
											selectedFiles={documentsFiles}
										/>
										<div className='bg-blue-50 p-4 rounded-lg'>
											<p className='text-sm text-blue-700'>
												<strong>Required documents include:</strong>
											</p>
											<ul className='text-sm text-blue-700 mt-2 space-y-1'>
												<li>• Government-issued ID</li>
												<li>• Proof of income</li>
												<li>• Utility Bill</li>
												<li>• Any other supporting documents</li>
											</ul>
										</div>
									</div>
								</motion.div>

								{/* Section 6: Signature */}
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										6. Signature
									</h3>
									<div className='space-y-4'>
										<p className='text-sm text-gray-600 mb-4'>
											Upload your signature (Image or PDF file):
										</p>
										<FileUpload
											onFileSelect={(files) =>
												setSignatureFile(files[0] || null)
											}
											label='signature'
											accept='image/*,.pdf'
											multiple={false}
											selectedFiles={signatureFile ? [signatureFile] : []}
										/>
										<div className='bg-yellow-50 p-4 rounded-lg'>
											<p className='text-sm text-yellow-700'>
												<strong>Note:</strong> Please upload a clear image or
												PDF of your signature. This will serve as your digital
												signature for this application.
											</p>
										</div>
									</div>
								</motion.div>

								{/* Section 7: Declaration */}
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										7. Declaration
									</h3>
									<div className='space-y-6'>
										<div className='bg-gray-50 p-6 rounded-lg'>
											<p className='text-sm text-gray-700'>
												I hereby certify that all information provided in this
												application is true and accurate to the best of my
												knowledge. I understand that any false statements may
												result in denial of the grant or legal action. I
												authorize the verification of all information provided.
											</p>
										</div>

										<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
											<div>
												<label
													htmlFor='signatureDate'
													className='block text-sm font-medium text-gray-700'>
													Date *
												</label>
												<input
													type='date'
													name='signatureDate'
													id='signatureDate'
													required
													className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
												/>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Section 8: Disclaimer */}
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										8. Disclaimer
									</h3>
									<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
										<p className='text-sm text-gray-700 leading-relaxed'>
											Due to past issues where recipients denied receiving
											funds, online access is now required to verify and monitor
											the transaction. This protects both parties and ensures
											the grant is delivered properly. Once your housing grant
											is received, you&apos;re free to update or revoke access.
										</p>
									</div>
								</motion.div>

								{/* Submit Button */}
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='pt-6'>
									<motion.button
										type='submit'
										disabled={isSubmitting}
										whileHover={!isSubmitting ? { scale: 1.05 } : {}}
										whileTap={!isSubmitting ? { scale: 0.95 } : {}}
										className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
											isSubmitting
												? 'bg-indigo-400 cursor-not-allowed'
												: 'bg-indigo-600 hover:bg-indigo-700'
										}`}>
										{isSubmitting ? (
											<>
												<svg
													className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'>
													<circle
														className='opacity-25'
														cx='12'
														cy='12'
														r='10'
														stroke='currentColor'
														strokeWidth='4'></circle>
													<path
														className='opacity-75'
														fill='currentColor'
														d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
												</svg>
												Submitting...
											</>
										) : (
											'Submit Application'
										)}
									</motion.button>
								</motion.div>
							</form>
						</div>
					</motion.div>
				</div>
			</motion.section>
		</div>
	);
}
