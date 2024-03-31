import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import pTimeout from "p-timeout";

const getText = async () => {
  // Para obtener la IP de la red actual, para no copiar y pegar la IP
  const debuggerHost = Constants.expoConfig?.hostUri;
  const ip = debuggerHost?.split(":")[0];

  try {
    const result = await pTimeout(fetch(`http://${ip}:5000`), {
      milliseconds: 2000,
    });

    if (result.ok) {
      const resultJson = await result.json();
      return resultJson.message;
    }
    return "Not ok error";
  } catch (error) {
    return "Error catch";
  }
};

export default function App() {
  const [apiText, setApiText] = React.useState("");

  React.useEffect(() => {
    const getExample = async () => {
      setApiText(await getText());
    };

    void getExample();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app</Text>
      <Text>Texto desde API: {apiText}</Text>
      <Button
        title="Refresh"
        onPress={async () => setApiText(await getText())}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
