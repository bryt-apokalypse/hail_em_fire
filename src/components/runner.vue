<template>
  <div>
    <h1>Module Results</h1>
    <div v-for="(result, module) in moduleResults" :key="module">
      <h2>{{ module }}</h2>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import GithubService from '../router/GithubService';
import { reactive, ref } from 'vue';
import { runCode, setEngine, setOptions } from 'client-side-python-runner';

export default {
  setup(props, { emit }) {
    const config = ref({});
    const moduleResults = reactive({});

    const fetchConfigAndRunModules = async () => {
      try {
        const fetchedConfig = await GithubService.getConfigFromGithub();
        config.value = fetchedConfig;
        emit('config-fetched', fetchedConfig);

        for (const task of fetchedConfig) {
          const moduleCode = await GithubService.getModuleCodeFromGithub(task.module);
          await runModule(task.module, moduleCode);
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    const runModule = async (moduleName, moduleCode) => {
      try {
        let output = ''; // Initialize output as a string

        const customLogger = (msg) => {
          output += msg + '\n'; // Append log messages to output
          console.log(msg); // Log to console
          localStorage.setItem('log_' + moduleName, output); // Save logs to local storage
        };

        setOptions({
          debug: true,
          output: customLogger,
          pythonVersion: 3,
          loadVariablesBeforeRun: true,
          storeVariablesAfterRun: true,
          onLoading: (engine, isFirst) => {},
          onLoaded: (engine, isLast) => {},
        });

        await setEngine('brython'); // Specify the engine to use

        const results = await runCode(moduleCode);
        output += results ? results : ''; // Append results to output if they exist

        const result = {
          success: true,
          output: output.trim(), // Trim the final output
        };

        await GithubService.storeResultToGithub(moduleName, result);

        moduleResults[moduleName] = result;
        emit('module-result', { module: moduleName, result });
      } catch (error) {
        console.error(`Error running module ${moduleName}:`, error);
        moduleResults[moduleName] = { error: error.message };
        emit('module-result', { module: moduleName, result: { error: error.message } });
      }
    };

    fetchConfigAndRunModules();

    return {
      config,
      moduleResults,
    };
  },
};
</script>
