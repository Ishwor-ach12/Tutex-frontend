import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const startPage = () => {
  const router = useRouter();
  useEffect(()=>{router.replace("./LandingPage")}, [])
  return (
    <View>
      <Text>startPage</Text>
    </View>
  )
}

export default startPage