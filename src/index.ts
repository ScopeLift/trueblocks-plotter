// --- Imports and setup ---
require('dotenv').config();
import util from 'util';
import { exec as execCallback } from 'child_process';
import { CallResponse, Exec, PlotLayout, QueryConfig } from './types';

const configPath = `../config/${String(process.env.ANALYSIS_NAME)}.config.ts`;
const config: QueryConfig = require(configPath).config; // dynamic path `import` statements not allowed
const plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_API_KEY);
const exec = util.promisify(execCallback);

// --- Execution ---
(async function () {
  // Generate chifra commands
  const { blocks, plotLayout, queries } = config;
  const range = `${blocks.start}-${blocks.end}:${blocks.interval}`;
  const commands = queries.map((call) => {
    if ('calldata' in call) {
      return `chifra state --call "${call.target}!${call.calldata}" ${range} --fmt json`;
    } else {
      // return `chifra blocks --logs --emitter ${call.target} --topic ${call.topic} ${range} --fmt json`;
      throw new Error('Log queries not yet supported');
    }
  });

  // Execute commands
  const outputs = <Exec[]>await Promise.all(commands.map((cmd) => exec(cmd)));
  const data = <CallResponse[][]>outputs.map((output) => JSON.parse(output.stdout).data);

  // Format data for plotting
  const plotData = data.map((res, i) => {
    // Get the output field name of this query
    // TODO support queries that return multiple fields
    // TODO we have to access the outputs by name, but maybe we can access them by index of the function output / topic
    const dataField = Object.keys(res[0].callResult.outputs)[0];
    return {
      x: res.map((x) => x.blockNumber),
      y: res.map((x) => x.callResult.outputs[dataField]),
      name: queries[i].plot.name,
      type: 'scatter', // TODO support other plot types
    };
  });

  // Global plot settings
  const layout: PlotLayout = {
    filename: plotLayout.filename || process.env.ANALYSIS_NAME,
    fileopt: plotLayout.fileopt || 'overwrite',
  };

  // Generate plot
  plotly.plot(plotData, layout, function (err: Error, msg: string) {
    if (err) return console.log(err);
    console.log(msg);
  });
})();
