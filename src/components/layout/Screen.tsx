import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, ViewProps } from 'react-native';
import { useTheme } from '../../theme';

type Props = ViewProps & { scroll?: boolean };

export const Screen: React.FC<Props> = ({ children, scroll, style, ...rest }) => {
  const { theme } = useTheme();
  const content = (
    <View style={[{ padding: 16 }, style]} {...rest}>
      {children}
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {scroll ? <ScrollView>{content}</ScrollView> : content}
    </SafeAreaView>
  );
};
