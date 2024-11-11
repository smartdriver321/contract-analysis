import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'
import { ReactQueryProvider } from '@/providers/tanstack/react-query-provider'
import { ModalProvider } from '@/providers/modals/modal-providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

export const metadata: Metadata = {
	title: 'Contract Analysis App',
	description: 'Generated by AI',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReactQueryProvider>
					<Header />
					<ModalProvider>{children}</ModalProvider>
					<Toaster />
				</ReactQueryProvider>
			</body>
		</html>
	)
}
