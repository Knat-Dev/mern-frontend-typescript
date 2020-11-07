const sessionName = 'qid';

let accessToken: string | null | undefined = '';

export const setAccessToken = (token: string | null | undefined) => {
  // sessionStorage.setItem(sessionName, token);
  accessToken = token;
};

export const getAccessToken = () => {
  // return sessionStorage.getItem(sessionName);
  return accessToken;
};
