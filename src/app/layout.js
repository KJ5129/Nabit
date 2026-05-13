import './globals.css'
export const metadata = { title: "Nabit", description: "Campus food delivery" };
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-screen">
      <body className="antialiased text-black bg-gradient-to-b from-white to-gray-300 dark:from-gray-600 dark:to-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
