"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'

export default function SignupForm() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		// Validation
		if (password !== confirmPassword) {
			setError('Passwords do not match')
			setLoading(false)
			return
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters')
			setLoading(false)
			return
		}

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			})

			const data = await response.json()

			if (data.ok) {
				setSuccess('Account created successfully! Please check your email to verify your account.')
				// Clear form
				setName('')
				setEmail('')
				setPassword('')
				setConfirmPassword('')
				
				// Redirect after a short delay
				setTimeout(() => {
					router.push('/login')
				}, 2000)
			} else {
				setError(data.error || 'Signup failed')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>Sign up to start your reading journey</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					{success && (
						<Alert>
							<AlertDescription>{success}</AlertDescription>
						</Alert>
					)}
					
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Enter your full name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Create a password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
							minLength={6}
						/>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="Confirm your password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Account...
							</>
						) : (
							'Create Account'
						)}
					</Button>
				</form>
				
				<div className="mt-4 text-center text-sm">
					Already have an account?{' '}
					<a href="/login" className="text-blue-600 hover:underline">
						Sign in here
					</a>
				</div>
			</CardContent>
		</Card>
	)
}
