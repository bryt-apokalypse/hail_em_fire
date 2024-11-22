import { createApp } from 'vue';
import App from './App.vue';
import GithubService from './router/GithubService'; // Ensure the correct path to your service
import { githubToken } from '../config'; // Import the token from the config file

GithubService.setToken(githubToken); // Assuming you have a method to set the token in your service

const app = createApp(App);

app.config.globalProperties.$githubService = GithubService; // Optional: if you need to access this globally in your app

app.mount('#app');
