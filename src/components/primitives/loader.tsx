import { Image } from 'react-native';

interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 128 }: LoaderProps) {
  return (
    <Image
      source={require('@/components/icons/vinaup-loader.gif')}
      style={{ width: size, height: size }}
      alt="Loading..."
    />
  );
}
