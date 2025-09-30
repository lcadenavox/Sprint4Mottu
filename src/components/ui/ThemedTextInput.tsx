import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../theme';

type Props = TextInputProps & { label?: string; error?: string };

export const ThemedTextInput: React.FC<Props> = ({ label, error, style, ...rest }) => {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? (
        <Text style={{ marginBottom: 6, color: theme.colors.text, fontWeight: '500' }}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.secondary}
        style={[
          {
            borderWidth: 1,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          },
          style,
        ]}
        {...rest}
      />
      {!!error && (
        <Text style={{ color: theme.colors.danger, marginTop: 6, fontSize: 12 }}>{error}</Text>
      )}
    </View>
  );
};
