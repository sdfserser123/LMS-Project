import { useState, useCallback } from 'react';

/**
 * useGooglePicker Hook
 * 
 * Handles Google OAuth2 (Identity Services) and Google Drive Picker 
 * to allow users to select files from their Drive.
 */
export const useGooglePicker = () => {
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // Initialize the Token Client (GSI)
  const initTokenClient = useCallback(() => {
    if (window.google && !tokenClient) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (response) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            // After getting the token, we can trigger the picker directly if needed
          }
        },
      });
      setTokenClient(client);
    }
  }, [clientId, tokenClient]);

  // Main function to open the picker
  const openPicker = (onSelect) => {
    if (!accessToken) {
      // If no token, request one first
      if (tokenClient) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        initTokenClient();
        // Wait and request... better approach: show toast OR recursive call
      }
      return;
    }

    // Build the Picker
    if (window.gapi) {
      window.gapi.load('picker', {
        callback: () => {
          const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
            .setParent('root')
            .setIncludeFolders(true)
            .setSelectFolderEnabled(false);
          
          const picker = new window.google.picker.PickerBuilder()
            .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
            .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
            .setDeveloperKey(apiKey)
            .setAppId(clientId.split('-')[0]) // Optional: Usually first part of ClientID
            .setOAuthToken(accessToken)
            .addView(view)
            .addView(new window.google.picker.DocsView(window.google.picker.ViewId.VIDEO_FILES))
            .addView(new window.google.picker.DocsView(window.google.picker.ViewId.PDFS))
            .setCallback((data) => {
              if (data.action === window.google.picker.Action.PICKED) {
                const documents = data[window.google.picker.Response.DOCUMENTS];
                onSelect(documents);
              }
            })
            .build();
          picker.setVisible(true);
        }
      });
    }
  };

  return { openPicker, initTokenClient, isAuthenticated: !!accessToken };
};
