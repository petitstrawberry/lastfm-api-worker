// index.ts
// lastfm-api-worker
// 2024-02-28
// PetitStrawberry
//
// This is a Cloudflare Worker script that fetches the recently played / now playing track from a Last.fm user and displays it as an HTML page.

import { LastFm } from '@petitstrawberry/lastfm-ts';
import { config } from './config';

export default {
	async fetch(request: Request): Promise<Response> {
		const lastFm = new LastFm(config.API_KEY);
		const user = (await lastFm.user.getInfo({ user: config.USERNAME })).user;
		const recenttracks = (await lastFm.user.getRecentTracks({ user: user.name })).recenttracks;
		const track = recenttracks.track[0];
		const isNowPlaying = track['@attr']?.nowplaying === 'true';
		console.log(track);

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
					min-width: 384px;
					min-height: 120px;
					width: 100%;
					aspect-ratio: 16 / 5;
					// max-height: 200px;



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
					white-space: nowrap;
					overflow: scroll;
					text-overflow: ellipsis;
				}
				.trackdetails::-webkit-scrollbar{
					display:none;
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
						<hr noshade>
						<p>Artist: ${track.artist['#text']}</p>
						<p>Album: ${track.album['#text']}</p>
					</div>
				</div>
			</div>
		</body>
		</html>
		`;

		return new Response(html, {
			headers: {
				"content-type": "text/html;charset=UTF-8",
			},
		});
	},
};
