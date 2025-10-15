import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" />
      <Stack.Screen name="Login" />
    </Stack>
  )
}

export default _layout