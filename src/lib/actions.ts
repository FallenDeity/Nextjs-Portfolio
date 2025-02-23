"use server";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { neon } from "@neondatabase/serverless";

import { logger } from "./logging";

const log = logger.child({ module: "actions" });

export interface ConfigVar {
	key: string;
	value: string;
}

export interface SpotifyProfile {
	display_name: string;
	images: {
		height: number;
		url: string;
		width: number;
	}[];
}

export interface SpotifyStatus {
	timestamp: number;
	progress_ms: number;
	is_playing: boolean;
	item: {
		album: {
			images: {
				height: number;
				url: string;
				width: number;
			}[];
			href: string;
			name: string;
		};
		artists: {
			href: string;
			name: string;
		}[];
		href: string;
		duration_ms: number;
		name: string;
	};
	last_updated: number;
}

export interface RefreshTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token: string;
}

const sql = neon(process.env.DATABASE_URL!);

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
);
`;

const INSERT_CONFIG = `
INSERT INTO config (key, value) VALUES ($1, $2);
`;

const SELECT_CONFIG = `
SELECT * FROM config WHERE key = $1;
`;

const UPDATE_CONFIG = `
UPDATE config SET value = $1 WHERE key = $2;
`;

const DELETE_CONFIG = `
DELETE FROM config WHERE key = $1;
`;

export async function createTable(): Promise<void> {
	log.info("Creating config table");
	await sql(CREATE_TABLE);
	log.info("Config Table created successfully");
}

export async function setConfig(key: string, value: string): Promise<void> {
	await sql(INSERT_CONFIG, [key, value]);
}

export async function updateConfig(key: string, value: string): Promise<void> {
	await sql(UPDATE_CONFIG, [value, key]);
}

export async function deleteConfig(key: string): Promise<void> {
	await sql(DELETE_CONFIG, [key]);
}

export async function getConfig(key: string): Promise<ConfigVar | undefined> {
	const [config] = await sql(SELECT_CONFIG, [key]);
	if (config) {
		return {
			key,
			value: config["value"] as string,
		};
	}

	return undefined;
}

export async function refreshSpotifyToken(): Promise<void> {
	const refresh_token = await getConfig("spotify_refresh_token");
	const scope = await getConfig("spotify_scope");

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refresh_token!.value,
			scope: scope!.value,
		}),
	});
	if (!response.ok) {
		throw new Error(`HTTP Error: ${response.status} ${JSON.stringify(await response.json())}`);
	}
	const data = (await response.json()) as RefreshTokenResponse;
	await updateConfig("spotify_access_token", data.access_token);
	await updateConfig("spotify_refresh_token", data.refresh_token || refresh_token!.value);
	return;
}

export async function getSpotifyStatus(): Promise<SpotifyStatus | undefined> {
	const config = await getConfig("spotify_access_token");
	if (!config) {
		return undefined;
	}

	const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
		headers: {
			Authorization: `Bearer ${config.value}`,
		},
	});
	if (!response.ok) {
		if (response.status === 401) {
			await refreshSpotifyToken();
			return await getSpotifyStatus();
		}
		log.error(`HTTP Error: ${response.status} ${JSON.stringify(await response.json())}`);
		return undefined;
	}

	if (response.status === 204) {
		return undefined;
	}

	const data = (await response.json()) as SpotifyStatus;

	return { ...data, last_updated: Date.now() };
}
