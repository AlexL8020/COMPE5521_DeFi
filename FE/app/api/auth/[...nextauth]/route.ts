import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyMessage } from 'ethers'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        address: { label: 'Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.address || !credentials?.signature || !credentials?.message) {
            return null
          }

          // Verify the signature matches the address that signed the message
          const recoveredAddress = verifyMessage(
            credentials.message,
            credentials.signature
          )

          // Check if the recovered address matches the address provided
          if (recoveredAddress.toLowerCase() !== credentials.address.toLowerCase()) {
            return null
          }

          // Return the user object
          return {
            id: credentials.address,
            address: credentials.address,
          }
        } catch (error) {
          console.error('Error in authorize:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user address to the session
      return {
        ...session,
        user: {
          ...session.user,
          address: token.sub,
        },
      }
    },
  },
  pages: {
    signIn: '/', // Custom sign-in page path if needed
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }
