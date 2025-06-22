import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ImageStyle;
}

export const Logo: React.FC<LogoProps> = ({ 
  width = 48, 
  height = 48,
  style 
}) => {
  return (
    <Image
      source={require('../../assets/icon.png')}
      style={[
        {
          width,
          height,
          resizeMode: 'contain',
        },
        style
      ]}
    />
  );
};
