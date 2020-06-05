import React, { createContext, FunctionComponent, useEffect, useState, useContext } from 'react';
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

type AuthContextValue = {
  client?: Auth0Client
  loginWithPopup: () => void
}

interface AuthProviderProps {
  domain: string
  clientId: string
  redirectUri: string
}

export const AuthContext = createContext<AuthContextValue>({
  loginWithPopup: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
  domain,
  clientId,
  redirectUri
}) => {
  const [client, setClient] = useState<Auth0Client | undefined>();

  useEffect(() => {
    createAuth0Client({
      domain,
      client_id: clientId,
      redirect_uri: redirectUri
    }).then(client => {
      setClient(client);
    })
  });

  const loginWithPopup = async () => {
    if (!client) return;

    try {
      client.loginWithPopup();
    } catch(e) {
      console.error(e);
    } finally {

    }

    const user = await client.getUser();

    console.log({ user });
  }

  return (
    <AuthContext.Provider value={{
      client,
      loginWithPopup
    }}>
      {children}
    </AuthContext.Provider>
  );
}
