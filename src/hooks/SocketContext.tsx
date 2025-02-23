"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { SOCKET_CONFIG } from "@/data/socket";
import { SocketState, WebSocketMessage, LanyardData } from "@/types/socket";

const createSocketManager = () => {
	let socket: WebSocket | null = null;
	let heartbeatInterval: number | undefined;
	let reconnectAttempts = 0;
	const listeners = new Set<(data: SocketState) => void>();

	let currentState: SocketState = {
		status: "offline",
		data: null,
		connectionStatus: "disconnected",
	};

	const connect = () => {
		if (socket?.readyState === WebSocket.OPEN) return;

		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
		}

		socket = new WebSocket(SOCKET_CONFIG.SOCKET_URL);

		const updateState = (newState: Partial<SocketState>) => {
			currentState = { ...currentState, ...newState };
			listeners.forEach((listener) => listener(currentState));
		};

		updateState({ connectionStatus: "connecting" });

		socket.onopen = () => {
			reconnectAttempts = 0;
			updateState({ connectionStatus: "connected" });
			socket?.send(
				JSON.stringify({
					op: 2,
					d: { subscribe_to_id: SOCKET_CONFIG.DISCORD_USER_ID },
				}),
			);
		};

		socket.onmessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data) as WebSocketMessage;

				if (message.op === 1 && message.d.heartbeat_interval) {
					if (heartbeatInterval) clearInterval(heartbeatInterval);
					heartbeatInterval = window.setInterval(() => {
						if (socket?.readyState === WebSocket.OPEN) {
							socket.send(JSON.stringify({ op: 3 }));
						}
					}, message.d.heartbeat_interval);
					return;
				}

				if (
					message.op === 0 &&
					(message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE")
				) {
					updateState({
						status: message.d.discord_status || "offline",
						data: message.d as LanyardData,
					});
				}
			} catch (error) {
				console.error("WebSocket message error:", error);
			}
		};

		socket.onclose = () => {
			if (heartbeatInterval) clearInterval(heartbeatInterval);
			if (socket) socket.close();
			socket = null;

			if (reconnectAttempts < SOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
				const delay =
					SOCKET_CONFIG.RECONNECT_DELAY *
					Math.pow(SOCKET_CONFIG.BACKOFF_MULTIPLIER, reconnectAttempts);
				reconnectAttempts++;
				setTimeout(connect, delay);
			}

			updateState({ connectionStatus: "disconnected" });
		};

		socket.onerror = (error: Event) => {
			console.error("WebSocket error:", error);
			socket?.close();
		};
	};

	const subscribe = (listener: (data: SocketState) => void) => {
		listeners.add(listener);
		listener(currentState);
		return () => {
			listeners.delete(listener);
			return undefined;
		};
	};

	if (typeof window !== "undefined") {
		connect();
	}

	return { subscribe };
};

const socketManager = createSocketManager();
const SocketContext = createContext<SocketState | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
	const [socketData, setSocketData] = useState<SocketState>({
		status: "offline",
		data: null,
		connectionStatus: "disconnected",
	});

	useEffect(() => {
		return socketManager.subscribe(setSocketData);
	}, []);

	return (
		<SocketContext.Provider value={socketData}>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
}
