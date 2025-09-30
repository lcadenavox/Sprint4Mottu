import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../theme';

export const ThemedText: React.FC<TextProps> = ({ style, ...rest }) => {
  const { theme } = useTheme();
  return <Text style={[{ color: theme.colors.text }, style]} {...rest} />;
};
