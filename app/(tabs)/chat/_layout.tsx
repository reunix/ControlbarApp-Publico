import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="eventchat" options={{ headerShown: false }} />
      <Stack.Screen name="privatechat" options={{ headerShown: false }} />
      <Stack.Screen name="viewimage" options={{ headerShown: false }} />
    </Stack>
  );
}
