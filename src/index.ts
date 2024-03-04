// index.ts
// lastfm-api-worker
// 2024-02-28
// PetitStrawberry
//
// API for getting the currently playing / the recently played track from a Last.fm user.

import { Hono } from "hono";
import { LastFm } from '@petitstrawberry/lastfm-ts';
import { web } from "./web";

import { config } from './config';
const lastFm = new LastFm(config.API_KEY);

const app = new Hono();

// Return the HTML page with the currently playing / the recently played track from a Last.fm user.
app.route("/", web);

// Get the info of the Last.fm user
app.get("/user", async (c) => {
	const user = (await lastFm.user.getInfo({ user: config.USERNAME })).user;
	return c.json(user);
});

// Get the nowplaying track from the Last.fm user
app.get("/nowplaying", async (c) => {
	const user = (await lastFm.user.getInfo({ user: config.USERNAME })).user;
	const recenttracks = (await lastFm.user.getRecentTracks({ user: user.name })).recenttracks;
	const track = recenttracks.track[0];
	const isNowPlaying = track['@attr']?.nowplaying === 'true';

	if (isNowPlaying) {
		return c.json({
			"nowPlaying": true,
			"track": track
		});
	} else {
		return c.json({
			"nowPlaying": false
		});
	}
});
// Get the recent tracks from the Last.fm user
app.get("/recenttracks", async (c) => {
	const count = c.req.query('count') || 10;
	const user = (await lastFm.user.getInfo({ user: config.USERNAME })).user;
	const recenttracks = (await lastFm.user.getRecentTracks({ user: user.name, limit: count.toString() })).recenttracks;
	return c.json(recenttracks);
});

export default app;