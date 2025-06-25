// utils/requestCameraPermission.ts
import { Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export async function requestCameraPermission(): Promise<boolean> {
  const permission = await Camera.requestCameraPermission();
  return permission === 'authorized';
}
