<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

    <div class="config-section">
      <h2>Configuration</h2>
      <pre>{{ JSON.stringify(config, null, 2) }}</pre>
    </div>

    <runner @config-fetched="updateConfig" @module-result="updateModuleResult" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import runner from './components/runner.vue';
import { reactive } from 'vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    runner,
  },
  setup() {
    const config = reactive({});
    const moduleResults = reactive({});

    const updateConfig = (fetchedConfig) => {
      Object.assign(config, fetchedConfig);
    };

    const updateModuleResult = ({ module, result }) => {
      moduleResults[module] = result;
    };

    return {
      config,
      moduleResults,
      updateConfig,
      updateModuleResult,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.config-section, .results-section {
  margin-top: 20px;
}
pre {
  text-align: left;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}
</style>
