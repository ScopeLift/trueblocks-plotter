import { QueryConfig } from '../src/types';
import { ethers } from 'ethers';

const abi = ['function balanceOf(address account) external view returns (uint256)'];
const iface = new ethers.utils.Interface(abi);

const comp = '0xc00e94Cb662C3520282E6f5717214004A7f26888'; // COMP address
const comptroller = '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B'; // Compound comptroller address
const timelock = '0x6d903f6003cca6255D85CcA4D3B5E5146dC33925'; // Compound timelock

export const config: QueryConfig = {
  // Blocks to query
  blocks: {
    start: 13250000,
    end: 19000000,
    interval: "weekly",
  },
  // Each item in the array is converted to a chifra command to execute over the range of blocks specified above,
  // and the `plot` object is passed directly to Plotly
  queries: [
    {
      target: comp,
      calldata: iface.encodeFunctionData('balanceOf', [comptroller]),
      // See plotly.js docs or the `PlotData` interface in node_modules/@types/plotly.js/index.d.ts for supported options
      plot: {
        name: 'comptroller',
      },
    },
    {
      target: comp,
      calldata: iface.encodeFunctionData('balanceOf', [timelock]),
      plot: {
        name: 'timelock',
      },
    },
  ],
  // See plotly.js docs or the `Layout` interface in node_modules/@types/plotly.js/index.d.ts for supported options
  plotLayout: {
    title: 'COMP Balance Over Time',
    xaxis: { title: 'Block number' },
    yaxis: { title: 'COMP Balance' },
  },
};
