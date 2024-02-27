# lastfm-api-worker

This is a Cloudflare Worker script that fetches the recently played / now playing track from a Last.fm user and displays it as an HTML page.

## Demo

You can see a demo of this script in action [here](https://lastfm.api.ichigo.dev).

## Setup

To set up the script, follow these steps:

1. Clone this repository:

    ```bash
    git clone https://github.com/petitstrawberry/lastfm-api-worker.git
    cd lastfm-api-worker
    ```

2. Configuration:
   
   Edit `src/config.ts` and set your Last.fm API key and your username.

   ```ts
   export const config = {
    API_KEY: "YOUR_API_KEY",
    USERNAME: "YOUR_USERNAME"
   }
   ```


4. Build:

   Install dependencies:

    ```bash
    npm install
    ```

   Check if it is working:

    ```bash
    wrangler dev
    ```

5. Deployment:

    ```bash
    wrangler deploy
    ```

This will deploy the script to Cloudflare Workers.
