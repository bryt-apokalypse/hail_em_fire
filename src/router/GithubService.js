import axios from 'axios';

const GITHUB_USER = 'hail-grail-mary';
const GITHUB_REPO = 'make-it-rain';

// Access the token from environment variables
let githubToken = ''; // Initialize an empty token

const setToken = (token) => {
  githubToken = token; // Set the GitHub token
};
const githubConnect = async () => {
  return axios.create({
    baseURL: `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`,
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });
};

const getConfigFromGithub = async () => {
  const github = await githubConnect();
  const response = await github.get('contents/config/pk.json');
  return JSON.parse(atob(response.data.content));
};

const getModuleCodeFromGithub = async (moduleName) => {
  const github = await githubConnect();
  const response = await github.get(`/contents/modules/${moduleName}.py`);
  return atob(response.data.content);
};

const storeResultToGithub = async (moduleName, result) => {
  const github = await githubConnect();
  const path = `/contents/results/${moduleName}_result.json`;

  try {
    // Fetch the latest file information
    const { data } = await github.get(path);
    const latestSha = data.sha;

    // Update the file with the latest sha
    await github.put(path, {
      message: `Add result for ${moduleName}`,
      sha: latestSha,
      content: btoa(JSON.stringify(result)),
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // If the file does not exist, create it
      await github.put(path, {
        message: `Create result for ${moduleName}`,
        content: btoa(JSON.stringify(result)),
      });
    } else {
      console.error(`Error storing result for ${moduleName}:`, error);
      throw error;
    }
  }
};

export default {
  setToken,
  getConfigFromGithub,
  getModuleCodeFromGithub,
  storeResultToGithub,
};
