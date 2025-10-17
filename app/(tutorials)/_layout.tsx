import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="SignupTutorial" /> */}
      <Stack.Screen name="LoginTutorial" />
    </Stack>
  )
}

export default _layout