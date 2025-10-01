import React from 'react';
import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'danger';
};

export const ThemedButton: React.FC<Props> = ({ title, onPress, disabled, loading, style, variant = 'primary' }) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const bg = variant === 'danger' ? theme.colors.danger : theme.colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: isDisabled ? theme.colors.secondary : bg,
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
