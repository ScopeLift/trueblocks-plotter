// --- Imports and setup ---
require('dotenv').config();
import util from 'util';
import { exec as execCallback } from 'child_process';
import { Layout, plot, Plot } from 'nodeplotlib';
import { CallResponse, Exec, QueryConfig } from './types';

const configPath = `../config/${String(process.env.ANALYSIS_NAME)}.config.ts`;
const config: QueryConfig = require(configPath).config; // dynamic path `import` statements not allowed
const exec = util.promisify(execCallback);

// --- Execution ---
(async function () {
  // Generate chifra commands
  const { blocks, plotLayout, queries, maxBuffer } = config;
  const range = `${blocks.start}-${blocks.end}:${blocks.interval}`;
  const commands = queries.map((call) => {
    if ('calldata' in call) {
      return `chifra state ${call.target} --call "${call.calldata}" ${range} --fmt json`;
    } else {
      // return `chifra blocks --logs --emitter ${call.target} --topic ${call.topic} ${range} --fmt json`;
      throw new Error('Log queries not yet supported');
    }
  });

  // Execute commands
  const outputs = <Exec[]>await Promise.all(commands.map((cmd) => exec(cmd, { maxBuffer })));
  const data = <CallResponse[][]>outputs.map((output) => JSON.parse(output.stdout).data);

  // Format data for plotting
  const plotData: Plot[] = data.map((res, i) => {
    // Get the output field name of this query
    // TODO support queries that return multiple fields
    // TODO we have to access the outputs by name, but maybe we can access them by index of the function output / topic
    const dataField = Object.keys(res[0].callResult.outputs)[0];
    return {
      ...queries[i].plot,
      x: res.map((x) => x.blockNumber),
      y: res.map((x) => x.callResult.outputs[dataField]),
    };
  });

  // Generate plot
  plot(plotData, plotLayout as Layout);
})();
