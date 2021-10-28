# TrueBlocks Plotter

_This is a work in progress_

## Usage

1. Install [TrueBlocks](https://github.com/TrueBlocks/trueblocks-core/) if you don't already have it
2. Install packages with `yarn`
3. Run `cp .env.template .env`
4. Create a [Plotly](https://plotly.com/settings/api/) account and save the credentials in the `.env` file created in the previous step
5. Configure your analysis by creating a file in the `config` folder called `<analysisName>.config.ts`. See `example.config.ts` for more info on how to configure this file
6. Run `ANALYSIS_NAME=analysisName yarn start`
7. The URL of your plot will be logged to the console

You can run `ANALYSIS_NAME=example yarn start` to see an example
