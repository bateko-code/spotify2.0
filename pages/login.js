import React from 'react'
import { getProviders, signIn } from 'next-auth/react'

function login({ providers }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img
        className="mb-5 w-52"
        src="https://links.papareact.com/9xl"
        alt="spotify2.0 logo"
      />
      {/*goes through the providers array that came back*/}
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="rounded-lg bg-[#18D860] p-5 text-white"
            onClick={() => signIn(provider.id, {callbackUrl:"/"})}
          >
            login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export default login

// serve side render
export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: {
      providers,
    },
  }
}
