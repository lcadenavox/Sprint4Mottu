import React from 'react';
import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export const ThemedButton: React.FC<Props> = ({ title, onPress, disabled, loading, style }) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: isDisabled ? theme.colors.secondary : theme.colors.primary,
          paddingVertical: 12,
          alignItems: 'center',
          borderRadius: 8,
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: '#fff', fontWeight: '600' }}>{title}</Text>
      )}
    </Pressable>
  );
};
