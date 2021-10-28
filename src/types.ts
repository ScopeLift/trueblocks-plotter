// --- Configuration parameters for an analysis ---
// Plot layout settings
export interface PlotLayout {
  // Any plotly layout options are valid here
  // TODO add some stricter type definitions to help self-document options, since Plotly's
  // node docs seem to be lacking
  [key: string]: any;
}

// Plot settings for a give set of data
interface PlotDataConfig {
  name: string; // name used in plot legend
}

// Shape for calling a view method on a contract
interface CallConfigItem {
  target: string; // address to look at
  calldata: string; // ABI-encoded data to call on that address
  plot: PlotDataConfig;
}

// Shape for fetching event logs
interface LogConfigItem {
  target: string; // address to look at
  topic: string; // 32 byte topic
  index: number; // in the emitted event, which index contains the data we care about
  plot: PlotDataConfig;
}

// Each query specified in a config file must be this type
export type QueryConfig = {
  blocks: {
    start: number; // start block
    end: number; // end block
    interval: number; // interval between blocks
  };
  // TODO query types currently only support plotting one return value per query
  queries: (CallConfigItem | LogConfigItem)[];
  plotLayout: PlotLayout;
};

// --- Output data ---
// Shape of data returned from a shell command
export interface Exec {
  stdout: string;
  stderr: string;
}

// Data returned from a call to `chifra state --call`
export interface CallResponse {
  blockNumber: number; // block number of the call
  address: string; // target address called, from calls[i].target
  encoding: string; // calldata used, from calls[i].calldata
  bytes: string;
  compressedResult: string;
  callResult: {
    encoding: string; // function selector derived from that signature
    name: string; // name of the method called
    signature: string; // signature of the method called
    outputs: {
      [key: string]: any; // key name and value type are dependent on the function signature
    };
  };
}
