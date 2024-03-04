// web.ts
// lastfm-api-worker
// 2024-03-04
// PetitStrawberry
//
// Return an HTML page with the currently playing / the recently played track from a Last.fm user.

import { Hono } from "hono";
import { LastFm } from '@petitstrawberry/lastfm-ts';
import { config } from './config';

const web = new Hono();

web.get('/', async (c) => {
    const request = c.req;

    const lastFm = new LastFm(config.API_KEY);
    const user = (await lastFm.user.getInfo({ user: config.USERNAME })).user;
    const recenttracks = (await lastFm.user.getRecentTracks({ user: user.name, limit: '1' })).recenttracks;
    const track = recenttracks.track[0];
    const isNowPlaying = track['@attr']?.nowplaying === 'true';

    // Get aspect ratio from requset query
    const aspectRatio = request.query('aspect-ratio') || '3 / 1';

    // Get multiline from request query
    const multiline = request.query('multiline') == 'true' || false;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Recent track</title>
        <link href="https://use.fontawesome.com/releases/v6.2.0/css/all.css" rel="stylesheet">
        <style>
            html {
                height: 100%;
                width: 100%;
                overflow: hidden;
            }
            body {
                font-family: Arial, sans-serif;
                font-size: max(2vw, 10px);
                margin: 0;
                padding: 0;
                height: auto;
                width: 100%;
                aspect-ratio: ${aspectRatio};
            }
            .panel {
                display: flex;
                margin: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                background-image: url(${track.image[3]['#text']});
                background-size: cover;
                background-repeat: no-repeat;
                // clip background to the size of the viewport
                overflow: hidden;
            }
            .trackpanel {
                display: flex;
                margin: 0;
                width: 100%;
                height: 100%;
                padding: 10px;
                box-sizing: border-box;
                background-color: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                color: white;
                overflow: hidden;
            }
            .trackpanel img {
                object-fit: cover;
                height: 100%;
            }
            .trackdetails {
                width: 100%;
                height: 100%;
                padding-left: 10px;
                margin: 0;
                align-self: center;
                ${multiline ? '' : 'white-space: nowrap; overflow: scroll; text-overflow: ellipsis;'}

            }
            .trackdetails::-webkit-scrollbar{
                display:none;
            }
            .divider {
                border-bottom: 1px solid white;
                margin: 10px 0;
            }
        </style>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                // Reload the page when the image is clicked & 30s has passed
                setTimeout(() => {
                    window.location.reload();
                }, 30000);
                document.querySelector('img').addEventListener('click', () => {
                    window.location.reload();
                });
            });
        </script>
    </head>
    <body>
        <div class="panel">
            <div class="trackpanel">
            <img src="${track.image[3]['#text']}" />
                <div class="trackdetails">
                    <i class="fa-brands fa-lastfm"></i><br>
                    <small>${user.name}が${isNowPlaying ? '再生中' : '最近再生した曲'}</small>
                    <h3>${track.name}</h3>
                    <div class="divider"></div>
                    <p><b>Artist:</b> ${track.artist['#text']}</p>
                    <p><b>Album:</b> ${track.album['#text']}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    return c.html(html);
});

export { web };