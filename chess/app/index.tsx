// app/index.tsx

import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
// @ts-ignore
import ChessBoard from "@/components/chessboard";

import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const boardSize = Math.min(screenWidth - 40, 400);
const game = new Chess();
const socket = io(process.env.EXPO_PUBLIC_API_URL as string);
console.log("API:", process.env.EXPO_PUBLIC_API_URL);
export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [fen, setFen] = useState(game.fen());
    const [status, setStatus] = useState("");
    const [role, setRole] = useState<"w" | "b">("w");
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<string[]>([]);

    useEffect(() => {
        const handleStart = ({ message }: { message: string }) => {
            setStatus(message);
            setGameStarted(true);
            updateStatus();
        };

        const handleRole = ({ role }: { role: "w" | "b" }) => setRole(role);

        const handleMove = (move: { from: string; to: string; promotion?: string } ) => {
            try {
                const moves = game.moves({ verbose: true });
                const isValid = moves.some(
                    (m) => m.from === move.from && m.to === move.to
                );

                if (!isValid) return;

                game.move(move);
                updateStatus();
            } catch {
                console.log("Invalid move received");
            }
        };

        const handleChat = (msg: string) => {
            setChat((prev) => [...prev, msg]);
        };

        const handleWaiting = ({ message }: { message: string }) => {
            setStatus(message);
            setGameStarted(false);
        };

        socket.on("startGame", handleStart);
        socket.on("userrole", handleRole);
        socket.on("move", handleMove);
        socket.on("chatMessage", handleChat);
        socket.on("waitingForOpponent", handleWaiting);

        return () => {
            socket.off("startGame", handleStart);
            socket.off("userrole", handleRole);
            socket.off("move", handleMove);
            socket.off("chatMessage", handleChat);
            socket.off("waitingForOpponent", handleWaiting);
        };
    }, []);

    const updateStatus = () => {
        let status = "";
        const moveColor = game.turn() === "b" ? "Black" : "White";

        if (game.isCheckmate()) {
            status = `Game over, ${moveColor} is in checkmate.`;
        } else if (game.isDraw()) {
            status = "Game over, drawn position";
        } else {
            status = `${moveColor} to move`;
            if (game.isCheck()) {
                status += `, ${moveColor} is in check`;
            }
        }

        setStatus(status);
        setFen(game.fen());
    };

    const onMove = (move: any) => {
        try {
            const result = game.move(move);

            if (!result) return;

            socket.emit("move", result);
            updateStatus();
        } catch (err) {
            console.log("Invalid move attempt");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text>Role: {role}</Text>

            {!gameStarted ? (
                <Text>{status || "Waiting..."}</Text>
            ) : (
                <View style={{ width: boardSize, height: boardSize }}>
                    <ChessBoard game={game} role={role} onMove={onMove} />
                </View>
            )}

            <Text>Status: {status}</Text>
            <Text>FEN: {fen}</Text>

            {/* Chat */}
            <ScrollView style={{ height: 100 }}>
                {chat.map((msg, i) => (
                    <Text key={i}>{msg}</Text>
                ))}
            </ScrollView>

            <TextInput
                placeholder="Type message"
                value={message}
                onChangeText={setMessage}
            />

            <Button
                title="Send"
                color="#000"
                onPress={() => {
                    socket.emit("chatMessage", message);
                    setMessage("");
                }}
            />
        </View>
    );
}