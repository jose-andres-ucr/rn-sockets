import React from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import Constants from "expo-constants";
import io from "socket.io-client";

const getIp = () => {
  // Para obtener la IP de la red actual, para no copiar y pegar la IP
  const debuggerHost = Constants.expoConfig?.hostUri;
  return debuggerHost?.split(":")[0] ?? "";
};

const socket = io(`http://${getIp()}:5000`); // Server address

const authorId = Math.round(Math.random() * 100);

export default function App() {
  const [input, setInput] = React.useState("");
  const [socketMessages, setSocketMessages] = React.useState(
    [] as { author: number; text: string }[]
  );

  const sendMessage = () => {
    // Sending a message
    if (input.trim() !== "") {
      socket.emit("message", { author: authorId, text: input });
      setInput("");
    }
  };

  React.useEffect(() => {
    // Listen to messages from the server
    socket.on("message", (msg) => {
      setSocketMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect(); // Close socket connection when component unmount
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 50 }}>
      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        {socketMessages.map((msg, index) => (
          <Text key={index}>{`Author: ${msg.author} - ${msg.text}`}</Text>
        ))}
      </ScrollView>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginRight: 8,
          }}
          onChangeText={(text) => setInput(text)}
          value={input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}
