import { Image } from 'expo-image';

interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 128 }: LoaderProps) {
  return (
    <Image
      source={{ uri: 'vinaup_loader' }}
      style={{ width: size, height: size }}
      alt="Loading..."
    />
  );
}
